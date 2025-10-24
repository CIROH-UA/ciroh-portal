import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export default function GroupTile({
  group,
  isActive,
  onSelect,
  variant = 'grid',
}) {
  const imageUrl = group.thumbnail ? useBaseUrl(group.thumbnail) : null;
  const Icon = group.icon;
  const isGrid = variant === 'grid';

  const handleSelect = () => {
    onSelect(group.id);
  };

  return (
    <button
      type="button"
      className={clsx(
        styles.tile,
        isGrid ? styles.tileGrid : styles.tileList,
        isActive && styles.tileActive,
      )}
      onClick={handleSelect}
      aria-pressed={isActive}
    >
      <div
        className={clsx(
          styles.tileImageWrapper,
          isGrid ? styles.tileImageWrapperGrid : styles.tileImageWrapperList,
        )}
      >
        {Icon ? (
          <Icon
            className={clsx(
              styles.tileIcon,
              isGrid ? styles.tileIconGrid : styles.tileIconList,
            )}
          />
        ) : (
          imageUrl && (
            <img src={imageUrl} alt={group.title} className={styles.tileImage} />
          )
        )}
      </div>

      {isGrid ? (
        <div className={clsx(styles.tileContent, styles.tileContentGrid)}>
          <span className={styles.tileTitle}>{group.title}</span>
        </div>
      ) : (
        <div className={clsx(styles.tileContent, styles.tileContentList)}>
          <h3 className={styles.tileTitle}>{group.title}</h3>
          <p className={styles.tileBlurb}>{group.blurb}</p>
        </div>
      )}
    </button>
  );
}
