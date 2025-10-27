import React, { useEffect, useRef } from 'react';
import Layout from '@theme/Layout';
import { useLocation } from '@docusaurus/router';
import ProductTilesGrid from '@site/src/components/ProductGroupsWireframe/ProductTilesGrid';
import groups from '@site/src/components/ProductGroupsWireframe/groups';
import styles from './product-groups.module.css';

export default function ProductsGroupsPage() {
  const location = useLocation();
  const groupRefs = useRef({});

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

  // Filter to only show groups that have docsRoute (same as dropdown)
  const displayGroups = groups.filter(group => group.docsRoute);

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
            </div>

            {group.products && group.products.length > 0 ? (
              <ProductTilesGrid
                products={group.products}
                showDocsAction
                fallbackDocsLink={group.docsRoute}
                groupId={group.id}
                onDocsNavigate={handleDocsNavigate}
              />
            ) : (
              <p className={styles.noProducts}>No products available for this group.</p>
            )}
          </section>
        ))}
      </main>
    </Layout>
  );
}
