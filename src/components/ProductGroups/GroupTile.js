import React from 'react';
import clsx from 'clsx';
import { MdMenuBook, MdViewList } from 'react-icons/md';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

export default function GroupTile({
  group,
  isActive,
  onSelect,
  onDocsNavigate,
  onProductsNavigate,
  variant = 'grid',
}) {
  const imageUrl = group.thumbnail ? useBaseUrl(group.thumbnail) : null;
  const Icon = group.icon;
  const isGrid = variant === 'grid';

  const handleSelect = () => {
    onSelect(group.id);
  };

  const handleKeyDown = event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSelect();
    }
  };

  const handleDocsClick = event => {
    event.stopPropagation();
    if (onDocsNavigate) {
      onDocsNavigate(group.id);
    } else {
      onSelect(group.id);
    }
  };

  const handleProductsClick = event => {
    event.stopPropagation();
    if (onProductsNavigate) {
      onProductsNavigate(group.id);
    } else {
      onSelect(group.id);
    }
  };

  const renderGridCard = () => (
    <>
      <div className={styles.tileCardMedia}>
        {Icon ? (
          <Icon className={styles.tileCardIcon} aria-hidden="true" />
        ) : (
          imageUrl && (
            <img src={imageUrl} alt={group.title} className={styles.tileCardImage} />
          )
        )}
      </div>
      <div className={styles.tileCardBody}>
        <span className={styles.tileBadge}>Product Group</span>
        <h3 className={styles.tileTitle}>{group.title}</h3>
        <p className={styles.tileBlurb}>{group.blurb}</p>
      </div>
      <div className={styles.tileActionsRow}>
        <button
          type="button"
          className={styles.tileActionButton}
          onClick={handleDocsClick}
        >
          <MdMenuBook className={styles.tileActionIcon} aria-hidden="true" />
          <span>Docs</span>
        </button>
        <button
          type="button"
          className={clsx(styles.tileActionButton, styles.tileActionSecondary)}
          onClick={handleProductsClick}
        >
          <MdViewList className={styles.tileActionIcon} aria-hidden="true" />
          <span>Products</span>
        </button>
      </div>
    </>
  );

  const renderListTile = () => (
    <>
      <div className={clsx(styles.tileImageWrapper, styles.tileImageWrapperList)}>
        {Icon ? (
          <Icon className={clsx(styles.tileIcon, styles.tileIconList)} />
        ) : (
          imageUrl && (
            <img src={imageUrl} alt={group.title} className={styles.tileImage} />
          )
        )}
      </div>
      <div className={clsx(styles.tileContent, styles.tileContentList)}>
        <h3 className={styles.tileTitle}>{group.title}</h3>
        <p className={styles.tileBlurb}>{group.blurb}</p>
      </div>
    </>
  );

  return (
    <div
      className={clsx(
        styles.tile,
        isGrid ? styles.tileGrid : styles.tileList,
        isActive && styles.tileActive,
      )}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
    >
      {isGrid ? renderGridCard() : renderListTile()}
    </div>
  );
}
