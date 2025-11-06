import React, { useEffect, useMemo, useRef, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import ProductTilesGrid from '@site/src/components/ProductGroupsWireframe/ProductTilesGrid';
import groups from '@site/src/components/ProductGroupsWireframe/groups';
import { fetchHydroShareProductsForGroup, buildGroupKeywords } from '@site/src/components/ProductGroupsWireframe/hydroshareProducts';
import styles from './product-groups.module.css';

export default function ProductsGroupsPage() {
  const location = useLocation();
  const groupRefs = useRef({});
  const displayGroups = useMemo(
    () => groups.filter(group => group.docsRoute),
    [],
  );
  const [groupStates, setGroupStates] = useState(() => {
    const initialState = {};
    displayGroups.forEach(group => {
      initialState[group.id] = {
        products: [],
        loading: true,
        error: null,
      };
    });
    return initialState;
  });

  useEffect(() => {
    // Handle hash-based navigation (e.g., #ngiab)
    const hash = location.hash.replace('#', '');

    if (hash && groupRefs.current[hash]) {
      setTimeout(() => {
        groupRefs.current[hash].scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    }
  }, [location.hash]);

  useEffect(() => {
    let cancelled = false;

    setGroupStates(prev => {
      const next = { ...prev };
      displayGroups.forEach(group => {
        const existing = prev[group.id];
        next[group.id] = {
          products: existing?.products ?? [],
          loading: true,
          error: null,
        };
      });
      return next;
    });

    async function loadGroupResources() {
      await Promise.all(
        displayGroups.map(async group => {
          const keywords = buildGroupKeywords(group);

          if (keywords.length === 0) {
            if (!cancelled) {
              setGroupStates(prev => ({
                ...prev,
                [group.id]: {
                  products: [],
                  loading: false,
                  error: null,
                },
              }));
            }
            return;
          }

          try {
            const fetchedProducts = await fetchHydroShareProductsForGroup(keywords, {
              // limit: 6,
              includeMetadata: true,
            });

            if (cancelled) {
              return;
            }

            setGroupStates(prev => ({
              ...prev,
              [group.id]: {
                products: fetchedProducts,
                loading: false,
                error: null,
              },
            }));
          } catch (error) {
            console.error(`Unable to load HydroShare resources for group ${group.id}:`, error);
            if (cancelled) {
              return;
            }
            setGroupStates(prev => ({
              ...prev,
              [group.id]: {
                products: [],
                loading: false,
                error,
              },
            }));
          }
        }),
      );
    }

    loadGroupResources();

    return () => {
      cancelled = true;
    };
  }, [displayGroups]);

  // Handler for when user clicks "Read docs" on a product
  const handleDocsNavigate = ({ docsPath, groupId, product }) => {
    // Always open docs in external site
    const docsUrl = docsPath.startsWith('http')
      ? docsPath
      : `https://docs.ciroh.org${docsPath}`;
    window.open(docsUrl, '_blank');
  };

  return (
    <Layout
      title="Products"
      description="Explore CIROH product groups and their associated products."
    >
      <main className="container margin-vert--lg">
        <div className={styles.pageHeader}>
          <h1>Products</h1>
          <p className={styles.pageDescription}>
            Enhance forecasting, analysis, and water resource management by
            making your web applications and tools accessible to CIROH and NOAA's hydrologic research initiatives.
          </p>
        </div>

        {displayGroups.map(group => (
          <section
            key={group.id}
            id={group.id}
            ref={el => (groupRefs.current[group.id] = el)}
            className={styles.groupSection}
          >
            <div className={styles.groupHeader}>
              <div className={styles.groupHeaderContent}>
                {group.icon && <group.icon className={styles.groupIcon} />}
                <div>
                  <h2 className={styles.groupTitle}>{group.title}</h2>
                  <p className={styles.groupBlurb}>{group.blurb}</p>
                </div>
              </div>
              <div className={styles.groupHeaderAction}>
                <Link
                  className="button button--primary button--md"
                  to={`/product-groups/${group.id}`}
                >
                  Explore group
                </Link>
              </div>
            </div>

            {groupStates[group.id]?.loading && !(groupStates[group.id]?.products?.length) ? (
              <p className={styles.loadingNotice}>Loading HydroShare resources…</p>
            ) : groupStates[group.id]?.products?.length ? (
              <ProductTilesGrid
                products={groupStates[group.id].products}
                showDocsAction
                fallbackDocsLink={group.docsRoute}
                groupId={group.id}
                onDocsNavigate={handleDocsNavigate}
              />
            ) : (
              <p className={styles.noProducts}>No products available for this group.</p>
            )}
            {groupStates[group.id]?.error ? (
              <p className={styles.groupErrorNotice}>
                Unable to load live HydroShare resources right now. Please try again later.
              </p>
            ) : null}
          </section>
        ))}
      </main>
    </Layout>
  );
}
