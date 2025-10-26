import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { useHistory, useLocation } from '@docusaurus/router';
import GroupTiles from './GroupTiles';
import GroupSidebar from './GroupSidebar';
import PlaceholderGrid from './PlaceholderGrid';
import ProductTilesGrid from './ProductTilesGrid';
import docContentMap from './docContentMap';
import groups from './groups';
import sidebarData from './sidebarData';
import styles from './styles.module.css';

const findSidebarItemByPath = (groupId, targetPath) => {
  const sections = sidebarData[groupId];
  if (!sections) return null;

  const stack = [...sections];
  while (stack.length) {
    const item = stack.pop();
    if (item.type === 'link' && item.to === targetPath) {
      return item;
    }
    if (item.items) {
      stack.push(...item.items);
    }
  }
  return null;
};

export default function ProductGroupsWireframe() {
  const [activeGroupId, setActiveGroupId] = useState(null);
  const [activeSidebarItem, setActiveSidebarItem] = useState(null);
  const [detailMode, setDetailMode] = useState('collections');
  const history = useHistory();
  const location = useLocation();

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

    // Don't show component placeholders - return empty state
    return (
      <div className={styles.placeholderPanel}>
        <h3>Welcome to {activeGroup.title}</h3>
        <p>Select a topic from the sidebar to view documentation.</p>
      </div>
    );
  };

  const openGroup = (groupId, mode = 'collections') => {
    setActiveGroupId(groupId);
    setActiveSidebarItem(null);
    setDetailMode(mode);
  };

  const showDocsForGroup = ({ groupId, docsPath, label }) => {
    if (!groupId || !docsPath) return;

    setActiveGroupId(groupId);
    setDetailMode('collections');

    const navItem = findSidebarItemByPath(groupId, docsPath);
    const derivedLabel = label || navItem?.label || 'Documentation';

    setActiveSidebarItem({
      type: 'link',
      id: docsPath,
      to: docsPath,
      label: derivedLabel,
    });

    const params = new URLSearchParams();
    params.set('group', groupId);
    params.set('doc', docsPath);
    history.replace(`/product-groups?${params.toString()}`);
  };

  const openGroupProductsPage = groupId => {
    history.push(`/product-groups/group-products?group=${groupId}`);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const requestedGroupId = params.get('group');
    const requestedDoc = params.get('doc');

    if (!requestedGroupId) return;
    const groupExists = groups.some(group => group.id === requestedGroupId);
    if (!groupExists) return;

    setActiveGroupId(requestedGroupId);
    setDetailMode('collections');

    if (requestedDoc) {
      const navItem = findSidebarItemByPath(requestedGroupId, requestedDoc);
      setActiveSidebarItem(
        navItem || {
          type: 'link',
          id: requestedDoc,
          to: requestedDoc,
          label: 'Documentation',
        },
      );
    } else {
      setActiveSidebarItem(null);
    }
  }, [location.search]);

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
            onSelect={openGroupProductsPage}
            onDocsNavigate={id => openGroup(id, 'collections')}
            onProductsNavigate={openGroupProductsPage}
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
              <ProductTilesGrid
                products={activeGroup.products}
                showDocsAction
                fallbackDocsLink={activeGroup.docsRoute}
                groupId={activeGroup.id}
                onDocsNavigate={({ docsPath, groupId: targetGroupId, product }) =>
                  showDocsForGroup({
                    groupId: targetGroupId,
                    docsPath,
                    label: product?.title,
                  })
                }
              />
            )}
          </section>
        </div>
      )}
    </div>
  );
}
