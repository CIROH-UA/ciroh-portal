import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

export default function ProductTilesGrid({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className={styles.placeholderPanel}>
        <h3>Products coming soon</h3>
        <p>We are still cataloging items for this product group. Check back shortly.</p>
      </div>
    );
  }

  return (
    <div className={styles.productGrid}>
      {products.map(product => {
        const iconSrc = product.icon ? useBaseUrl(product.icon) : null;
        return (
          <article key={product.id} className={styles.productCard}>
            {iconSrc && (
              <div className={styles.productCardIconWrapper}>
                <img src={iconSrc} alt={product.title} className={styles.productCardIcon} />
              </div>
            )}
            <div className={styles.productCardBody}>
              {product.type && (
                <span className={styles.productCategory}>{product.type}</span>
              )}
              <h4 className={styles.productTitle}>{product.title}</h4>
              {product.summary && (
                <p className={styles.productSummary}>{product.summary}</p>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
