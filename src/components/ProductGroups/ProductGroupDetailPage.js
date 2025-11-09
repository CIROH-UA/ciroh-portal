import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import ProductTilesGrid from './ProductTilesGrid';
import {
  fetchHydroShareProductsForGroup,
  buildGroupKeywords,
  hydrateProductMetadata,
} from './hydroshareProducts';
import styles from './product-group-detail.module.css';
import { HeaderGroup } from '../HeaderGroup';
import { SkeletonPlaceholders } from '@site/src/components/SkeletonPlaceHolders';
import { TYPE_FILTERS } from './filterTags';
import { buildDocsUrl, handleDocsNavigate, normalize  } from './utils';


const PAGE_SIZE = 15;

export default function ProductGroupDetailPage({ group }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeType, setActiveType] = useState(null);
  const [dynamicProducts, setDynamicProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const metadataFetchRef = useRef(new Set());
  const loadMoreFetchingRef = useRef(false);
  const requestIdRef = useRef(0);
  const loadMoreRef = useRef(null);
  const hydratedProductCache = useRef(new Map());
  const docsUrl = useMemo(() => buildDocsUrl(group?.docsRoute), [group?.docsRoute]);
  const normalizedSearchTerm = useMemo(() => normalize(searchTerm), [searchTerm]);

  const groupKeywords = useMemo(
    () => buildGroupKeywords(group),
    [group],
  );

  // Intersection Observer for infinite scroll
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !loadingMore && hasMore) {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        fetchProducts({ page: nextPage, append: true });
      }
    });
  });
  
  // Effect to observe load more sentinel
  const loadEffectUpdate = () => {
    if (!hasMore || productsLoading) {
      return;
    }
    const sentinel = loadMoreRef.current;
    if (!sentinel) {
      return;
    }
    observer.observe(sentinel);
    return () => observer.disconnect();
  }

  const fetchProducts = useCallback(
    async ({ page: pageToLoad = 1, append = false } = {}) => {
      if (groupKeywords.length === 0) {
        setDynamicProducts([]);
        setProductsLoading(false);
        setProductsError(null);
        setHasMore(false);
        return;
      }

      if (append && loadMoreFetchingRef.current) {
        return;
      }

      const requestId = append ? requestIdRef.current : requestIdRef.current + 1;
      if (!append) {
        requestIdRef.current = requestId;
      }

      if (append) {
        loadMoreFetchingRef.current = true;
        setLoadingMore(true);
      } else {
        setProductsLoading(true);
        setProductsError(null);
      }

      try {
        console.log(`Fetching HydroShare products ${normalizedSearchTerm}`);
        const baseProducts = await fetchHydroShareProductsForGroup(groupKeywords, {
          includeMetadata: false,
          page: pageToLoad,
          count: PAGE_SIZE,
          fullTextSearch: normalizedSearchTerm,
        });

        const seededProducts = baseProducts.map(product => {
          const cached = hydratedProductCache.current.get(product.id);
          return cached ? cached : product;
        });

        if (requestId !== requestIdRef.current) {
          return;
        }

        setHasMore(baseProducts.length === PAGE_SIZE);

        setDynamicProducts(current =>
          append
            ? [
                ...current,
                ...seededProducts.filter(
                  product => !current.some(existing => existing.id === product.id),
                ),
              ]
            : seededProducts,
        );

        if (!append) {
          setProductsLoading(false);
        } else {
          setLoadingMore(false);
        }

        baseProducts.forEach(product => {
          if (hydratedProductCache.current.has(product.id) || metadataFetchRef.current.has(product.id)) {
            return;
          }
          metadataFetchRef.current.add(product.id);
          hydrateProductMetadata(product)
            .then(enrichedProduct => {
              if (!enrichedProduct || requestId !== requestIdRef.current) {
                return;
              }
              hydratedProductCache.current.set(enrichedProduct.id, enrichedProduct);
              setDynamicProducts(current =>
                current.map(item =>
                  item.id === enrichedProduct.id ? { ...item, ...enrichedProduct } : item,
                ),
              );
            })
            .catch(metadataError => {
              console.error(`Unable to enrich product ${product.id}:`, metadataError);
            })
            .finally(() => {
              metadataFetchRef.current.delete(product.id);
            });
        });
      } catch (error) {
        console.error(`Unable to load HydroShare resources for group ${group?.id}:`, error);
        if (!append) {
          setProductsError(error);
          setDynamicProducts([]);
          setProductsLoading(false);
        } else {
          setLoadingMore(false);
        }
      } finally {
        if (append) {
          loadMoreFetchingRef.current = false;
        }
      }
    },
    [groupKeywords, normalizedSearchTerm, group?.id],
  );

  useEffect(() => {
    metadataFetchRef.current = new Set();
    hydratedProductCache.current = new Map();
  }, [group?.id]);


  useEffect(() => {
    setDynamicProducts([]);
    setHasMore(true);
    setCurrentPage(1);
    metadataFetchRef.current.clear();
    hydratedProductCache.current.clear();
    if (groupKeywords.length === 0) {
      setProductsLoading(false);
      setProductsError(null);
      return;
    }
    fetchProducts({ page: 1, append: false });
  }, [normalizedSearchTerm]);

  useEffect(() => {
    return loadEffectUpdate();
  }, [hasMore, loadingMore, productsLoading]);

  const products = dynamicProducts;
  const typeCounts = useMemo(() => {
    return TYPE_FILTERS.reduce((acc, filter) => {
      const count = products.filter(product => {
        const productType = normalize(product?.type);
        return filter.values.some(value => productType === value);
      }).length;
      acc[filter.label] = count;
      return acc;
    }, {});
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = normalize(searchTerm);
    const activeFilter = TYPE_FILTERS.find(filter => filter.label === activeType);

    return products.filter(product => {
      const productType = normalize(product?.type);
      const matchesType = activeFilter
        ? activeFilter.values.some(value => productType === value)
        : true;

      if (!matchesType) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const haystack = [
        product.title,
        product.type,
        product.summary,
        product.primaryKeyword,
        product.secondaryKeyword,
        product.productTypeMetadata,
        product.productTypeResource,
        Array.isArray(product.keywords) ? product.keywords.join(' ') : null,
        Array.isArray(product.authors) ? product.authors.join(' ') : null,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });
  }, [products, activeType, searchTerm]);

  const totalCount = products.length;
  const hasProducts = totalCount > 0;
  const hasFilteredResults = filteredProducts.length > 0;
  const filtersActive = Boolean(activeType || normalize(searchTerm));

  return (
    <Layout title={group.title} description={group.blurb}>
      <main className={styles.pageWrapper}>
        <HeaderGroup group={group} backLink="product-groups" docsUrl={docsUrl} />

        <section className={styles.productsSection}>
          <div className={styles.filtersBar}>
            <div className={styles.searchWrapper}>
              <input
                type="search"
                className={styles.searchInput}
                placeholder="Search products by name, type, or description"
                value={searchTerm}
                onChange={event => setSearchTerm(event.target.value)}
                aria-label="Search products"
              />
              {searchTerm ? (
                <button
                  type="button"
                  className={styles.clearSearchButton}
                  onClick={() => setSearchTerm('')}
                >
                  Clear
                </button>
              ) : null}
            </div>
            <div className={styles.filterTags}>
              {TYPE_FILTERS.map(filter => {
                const isActive = activeType === filter.label;
                const count = typeCounts[filter.label] || 0;
                if (count === 0) {
                  return null;
                }
                const isAvailable = count > 0;
                const themeVars = filter.color
                  ? { '--tag-color': filter.color }
                  : undefined;
                return (
                  <button
                    key={filter.label}
                    type="button"
                    className={clsx(
                      styles.filterTag,
                      isActive && styles.filterTagActive,
                      !isAvailable && styles.filterTagDisabled,
                    )}
                    onClick={() => setActiveType(isActive ? null : filter.label)}
                    disabled={!isAvailable && !isActive}
                    style={themeVars}
                  >
                    {filter.icon ? (
                      <filter.icon className={styles.filterIcon} aria-hidden="true" />
                    ) : null}
                    <span className={styles.filterEmoji} aria-hidden="true">
                      {filter.emoji}
                    </span>
                    <span>{filter.label}</span>
                    <span className={styles.filterCount}>
                      {count}
                    </span>
                  </button>
                );
              })}
              {filtersActive ? (
                <button
                  type="button"
                  className={styles.resetFiltersButton}
                  onClick={() => {
                    setActiveType(null);
                    setSearchTerm('');
                  }}
                >
                  Reset
                </button>
              ) : null}
            </div>
            {productsError ? (
              <div className={styles.productLoadError}>
                Unable to load live HydroShare resources right now. Please try again later.
              </div>
            ) : null}
          </div>

          <div className={styles.sectionHeader}>
            <span className={styles.resultsMeta}>
              {productsLoading
                ? 'Loading products…'
                : productsError
                  ? 'No products available right now'
                  : hasProducts
                  ? `${filteredProducts.length} Products Loaded`
                  : 'No products available yet'}
            </span>
          </div>
          {productsLoading && dynamicProducts.length === 0 ? (
            <SkeletonPlaceholders
              count={6}
            />
          ) : hasFilteredResults ? (
            <ProductTilesGrid
              products={filteredProducts}
              showDocsAction
              fallbackDocsLink={group.docsRoute}
              groupId={group.id}
              onDocsNavigate={handleDocsNavigate}
            />
          ) : productsError ? null : (
            <div className={styles.noProducts}>
              {hasProducts
                ? 'No products match your filters yet. Try a different search or reset the filters.'
                : 'We are still cataloging individual products for this group. Check back soon.'}
            </div>
          )}
          {!productsLoading && hasMore ? (
            <div ref={loadMoreRef} className={styles.loadMoreTrigger} aria-hidden="true" />
          ) : null}
          {loadingMore ? (
            <SkeletonPlaceholders
              count={4}
            />  
          ) : null}
        </section>
      </main>
    </Layout>
  );
}

