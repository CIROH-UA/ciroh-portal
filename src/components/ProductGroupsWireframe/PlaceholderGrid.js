import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

function buildPlaceholders(title, fallbackItems) {
  if (Array.isArray(fallbackItems) && fallbackItems.length > 0) {
    return fallbackItems;
  }

  return Array.from({ length: 6 }).map((_, index) => ({
    id: `${title}-placeholder-${index + 1}`,
    label: `${title} Item ${index + 1}`,
  }));
}

export default function PlaceholderGrid({ title, items }) {
  const data = buildPlaceholders(title, items);

  return (
    <div className={styles.placeholderGridWrapper}>
      <h3 className={styles.placeholderGridTitle}>{title}</h3>
      <div className={styles.placeholderGrid}>
        {data.map(item => {
          const iconSrc = item.icon ? useBaseUrl(item.icon) : null;
          return (
            <div key={item.id || item.label} className={styles.placeholderCard}>
              <div
                className={styles.placeholderCardImage}
                data-with-icon={Boolean(iconSrc)}
              >
                {iconSrc && (
                  <img
                    src={iconSrc}
                    alt={item.label}
                    className={styles.placeholderCardIcon}
                  />
                )}
              </div>
              <p className={styles.placeholderCardLabel}>{item.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
