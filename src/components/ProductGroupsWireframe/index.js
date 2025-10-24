import React, { useMemo, useState } from 'react';
import clsx from 'clsx';
import GroupTiles from './GroupTiles';
import GroupSidebar from './GroupSidebar';
import PlaceholderGrid from './PlaceholderGrid';
import ProductTilesGrid from './ProductTilesGrid';
import docContentMap from './docContentMap';
import groups from './groups';
import styles from './styles.module.css';

export default function ProductGroupsWireframe() {
  const [activeGroupId, setActiveGroupId] = useState(null);
  const [activeSidebarItem, setActiveSidebarItem] = useState(null);
  const [detailMode, setDetailMode] = useState('collections');

  const activeGroup = useMemo(
    () => groups.find(group => group.id === activeGroupId),
    [activeGroupId],
  );

  const renderCollections = () => {
    if (!activeGroup) return null;

    if (activeSidebarItem?.type === 'link') {
      const DocComponent = docContentMap[activeSidebarItem.to];
      if (DocComponent) {
        return (
          <div className={styles.docContentWrapper}>
            <DocComponent />
          </div>
        );
      }

      return (
        <div className={styles.placeholderPanel}>
          <h3>{activeSidebarItem.label}</h3>
          <p>
            This section has not been synced from DocuHub yet. Open the
            original page to view the latest content.
          </p>
        </div>
      );
    }

    return (
      <PlaceholderGrid
        title={`${activeGroup.title} Components`}
        items={activeGroup.componentPlaceholders}
      />
    );
  };

  return (
    <div className={clsx('margin-bottom--xl', styles.wrapper)}>
      {!activeGroup && (
          <section className={clsx('margin-top--xl', styles.hero)}>
            <h1 className={styles.heroTitle}>Products</h1>
            <p className={styles.heroDescription}>
              En­hance fore­cast­ing, ana­lys­is, and wa­ter re­source man­age­ment by 
              mak­ing your web ap­plic­a­tions and tools ac­cess­ible to CIROH and NOAA's hy­dro­lo­gic re­search ini­ti­at­ives.
            </p>
          </section>
      )}

      {!activeGroup && (
        <div className={clsx('container', styles.overview)}>
          <GroupTiles
            groups={groups}
            activeGroupId={activeGroupId}
            onSelect={id => {
              setActiveGroupId(id);
              setActiveSidebarItem(null);
              setDetailMode('collections');
            }}
            variant="grid"
          />
        </div>
      )}

      {activeGroup && (
        <div className={styles.detailLayout}>
          <aside className={styles.sidebar}>
            <GroupSidebar
              groupId={activeGroupId}
              onBack={() => {
                setActiveGroupId(null);
                setActiveSidebarItem(null);
                setDetailMode('collections');
              }}
              onSelect={item => {
                setActiveSidebarItem(item);
                setDetailMode('collections');
              }}
              activeItem={activeSidebarItem}
            />
          </aside>

          <section className={styles.detailPane}>
            {!activeSidebarItem && (
              <div className={styles.detailToolbar}>
                <div className={styles.metricChips}>
                  {activeGroup.metrics?.map(metric => (
                    <span key={metric.id} className={styles.metricChip}>
                      <strong>{metric.count}</strong>
                      <span>{metric.label}</span>
                    </span>
                  ))}
                </div>
                <div className={styles.viewToggle} role="group" aria-label="Detail view toggle">
                  <button
                    type="button"
                    className={clsx(styles.toggleButton, detailMode === 'collections' && styles.toggleButtonActive)}
                    onClick={() => setDetailMode('collections')}
                  >
                    Collections
                  </button>
                  <button
                    type="button"
                    className={clsx(styles.toggleButton, detailMode === 'products' && styles.toggleButtonActive)}
                    onClick={() => setDetailMode('products')}
                  >
                    Products
                  </button>
                </div>
              </div>
            )}

            {(detailMode === 'collections' || activeSidebarItem) ? (
              renderCollections()
            ) : (
              <ProductTilesGrid products={activeGroup.products} />
            )}
          </section>
        </div>
      )}
    </div>
  );
}
