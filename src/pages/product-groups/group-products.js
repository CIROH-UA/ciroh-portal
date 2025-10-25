import React, { useMemo } from 'react';
import Layout from '@theme/Layout';
import { useHistory, useLocation } from '@docusaurus/router';
import Header from '@site/src/components/Header';
import ProductTilesGrid from '@site/src/components/ProductGroupsWireframe/ProductTilesGrid';
import groups from '@site/src/components/ProductGroupsWireframe/groups';

function useSelectedGroup(locationSearch) {
  return useMemo(() => {
    const params = new URLSearchParams(locationSearch);
    const requestedId = params.get('group');
    const found = groups.find(group => group.id === requestedId);
    return {
      group: found ?? groups[0],
      requestedId,
    };
  }, [locationSearch]);
}

export default function ProductGroupProductsPage() {
  const location = useLocation();
  const history = useHistory();
  const { group, requestedId } = useSelectedGroup(location.search);

  if (!group) {
    return (
      <Layout title="Product Group Products">
        <main className="container margin-vert--lg">
          <p>We could not find any product groups to display.</p>
        </main>
      </Layout>
    );
  }

  const title = `${group.title} Products`;
  const heroButtons = [
    { label: 'Back to Product Groups', href: '/product-groups' },
  ];
  if (group.docsRoute) {
    heroButtons.unshift({
      label: 'View Docs',
      href: group.docsRoute,
      primary: true,
    });
  }

  return (
    <Layout title={title} description={group.blurb}>
      <div className="margin-top--lg">
        <Header
          title={title}
          tagline={group.blurb}
          buttons={heroButtons}
        />
      </div>
      <main className="container margin-vert--lg">
        {!requestedId && (
          <div className="alert alert--info" role="status">
            <strong>Heads up:</strong> No group was specified, so we defaulted to {group.title}.
          </div>
        )}
        <section className="margin-top--lg margin-bottom--lg">
          <ProductTilesGrid
            products={group.products}
            showDocsAction
            fallbackDocsLink={group.docsRoute}
            groupId={group.id}
            onDocsNavigate={({ docsPath, groupId: targetGroupId }) => {
              const params = new URLSearchParams();
              params.set('group', targetGroupId);
              if (docsPath) {
                params.set('doc', docsPath);
              }
              history.push(`/product-groups?${params.toString()}`);
            }}
          />
        </section>
      </main>
    </Layout>
  );
}
