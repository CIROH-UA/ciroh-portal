import React, { useEffect, useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import { MdApps } from 'react-icons/md';
import { SiJupyter, SiPython } from 'react-icons/si';
import { BsBucketFill } from "react-icons/bs";
import ProductTilesGrid from './ProductTilesGrid';
import { fetchHydroShareProductsForGroup, buildGroupKeywords } from './hydroshareProducts';
import styles from './product-group-detail.module.css';

function buildDocsUrl(docsPath) {
  if (!docsPath) {
    return null;
  }
  return docsPath.startsWith('http')
    ? docsPath
    : `https://docs.ciroh.org${docsPath}`;
}

const TYPE_FILTERS = [
  {
    label: 'Apps',
    values: ['application'],
    icon: MdApps,
    color: 'var(--ifm-color-primary)',
  },
  {
    label: 'Libraries',
    values: ['library'],
    icon: SiPython,
    color: 'color-mix(in srgb, var(--ifm-color-primary) 70%, var(--ifm-color-secondary))',
  },
  {
    label: 'Datasets',
    values: ['dataset'],
    icon: BsBucketFill,
    color: 'color-mix(in srgb, var(--ifm-color-primary) 50%, var(--ifm-color-secondary) 50%)',
  },
  {
    label: 'Notebooks',
    values: ['jupyter notebook', 'notebook', 'jupyter'],
    icon: SiJupyter,
    color: 'color-mix(in srgb, var(--ifm-color-primary) 30%, var(--ifm-color-secondary) 70%)',
  },
];

const normalize = value =>
  value ? value.toString().toLowerCase().trim() : '';

export default function ProductGroupDetailPage({ group }) {
  const Icon = group?.icon;
  const [searchTerm, setSearchTerm] = useState('');
  const [activeType, setActiveType] = useState(null);
  const [dynamicProducts, setDynamicProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const docsUrl = useMemo(() => buildDocsUrl(group?.docsRoute), [group?.docsRoute]);

  const groupKeywords = useMemo(
    () => buildGroupKeywords(group),
    [group],
  );

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      if (groupKeywords.length === 0) {
        setDynamicProducts([]);
        setProductsLoading(false);
        setProductsError(null);
        return;
      }

      setProductsLoading(true);
      setProductsError(null);
      setDynamicProducts([]);

      try {
        const fetchedProducts = await fetchHydroShareProductsForGroup(groupKeywords, {
          includeMetadata: true,
        });
        if (!cancelled) {
          setDynamicProducts(fetchedProducts);
        }
      } catch (error) {
        console.error(`Unable to load HydroShare resources for group ${group?.id}:`, error);
        if (!cancelled) {
          setProductsError(error);
          setDynamicProducts([]);
        }
      } finally {
        if (!cancelled) {
          setProductsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [group?.id, groupKeywords]);

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

  const handleDocsNavigate = ({ docsPath }) => {
    const targetUrl = buildDocsUrl(docsPath);
    if (!targetUrl) {
      return;
    }

    if (typeof window !== 'undefined') {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Layout title={group.title} description={group.blurb}>
      <main className={styles.pageWrapper}>
        <Link className={styles.backLink} to="/product-groups">
          ← All product groups
        </Link>

        <article className={styles.headerCard}>
          <div className={styles.headerMain}>
            {Icon ? <Icon className={styles.headerIcon} aria-hidden="true" /> : null}
            <div>
              <h1 className={styles.headerTitle}>{group.title}</h1>
              {group.blurb ? (
                <p className={styles.headerBlurb}>{group.blurb}</p>
              ) : null}
              {docsUrl ? (
                <div className={styles.ctaRow}>
                  <a
                    className={clsx(styles.ctaButton, styles.ctaButtonPrimary)}
                    href={docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View documentation
                  </a>
                </div>
              ) : null}
            </div>
          </div>

        </article>

        <section className={styles.productsSection}>
          <div className={styles.sectionHeader}>
            {/* <h2 className={styles.sectionTitle}>Featured products</h2> */}
            <span className={styles.resultsMeta}>
              {productsLoading
                ? 'Loading products…'
                : productsError
                  ? 'No products available right now'
                  : hasProducts
                  ? `${filteredProducts.length} of ${totalCount} shown`
                  : 'No products available yet'}
            </span>
          </div>

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

          {productsLoading && dynamicProducts.length === 0 ? (
            <div className={styles.loadingProducts}>Loading HydroShare resources…</div>
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
        </section>
      </main>
    </Layout>
  );
}
