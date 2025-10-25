import React from 'react';
import { MdArrowOutward } from 'react-icons/md';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

export default function ProductTilesGrid({
  products,
  showDocsAction = false,
  fallbackDocsLink,
  groupId,
  onDocsNavigate,
}) {
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
        const docsPath = product.docsLink || fallbackDocsLink;
        const owningGroupId = product.groupId || groupId;

        const handleDocsClick = () => {
          if (onDocsNavigate && docsPath) {
            onDocsNavigate({
              product,
              docsPath,
              groupId: owningGroupId,
            });
          }
        };

        return (
          <article key={product.id} className={styles.productCard}>
            <div className={styles.productCardMedia}>
              {iconSrc ? (
                <img src={iconSrc} alt={product.title} className={styles.productCardMediaImage} />
              ) : (
                <span className={styles.productCardMediaPlaceholder}>{product.title}</span>
              )}
            </div>
            <div className={styles.productCardBody}>
              {product.type && (
                <span className={styles.productCategory}>{product.type}</span>
              )}
              <h4 className={styles.productTitle}>{product.title}</h4>
              {product.summary && (
                <p className={styles.productSummary}>{product.summary}</p>
              )}
            </div>
            {showDocsAction && docsPath && onDocsNavigate && (
              <div className={styles.productCardCTA}>
                <button
                  type="button"
                  className={styles.productCardCTAButton}
                  onClick={handleDocsClick}
                  aria-label={`Open docs for ${product.title}`}
                >
                  <span>Read docs</span>
                  <MdArrowOutward aria-hidden="true" />
                </button>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
