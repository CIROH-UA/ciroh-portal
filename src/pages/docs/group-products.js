import React, { useEffect, useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import { useHistory, useLocation } from '@docusaurus/router';
import Header from '@site/src/components/Header';
import ProductTilesGrid from '@site/src/components/ProductGroupsWireframe/ProductTilesGrid';
import groups from '@site/src/components/ProductGroupsWireframe/groups';
import { fetchHydroShareProductsForGroup, buildGroupKeywords } from '@site/src/components/ProductGroupsWireframe/hydroshareProducts';

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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!group) {
      return;
    }

    const keywords = buildGroupKeywords(group);
    console.log('Fetching products for group:', group.id, 'with keywords:', keywords);
    if (keywords.length === 0) {
      setProducts([]);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setProducts([]);

    (async () => {
      try {
        const fetchedProducts = await fetchHydroShareProductsForGroup(keywords, {
          includeMetadata: true,
        });

        if (!cancelled) {
          setProducts(fetchedProducts);
        }
      } catch (fetchError) {
        if (!cancelled) {
          console.error(`Unable to load HydroShare resources for group ${group.id}:`, fetchError);
          setError(fetchError);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [group]);

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
    { label: 'Back to Product Groups', href: '/docs' },
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
        {loading && (
          <div className="alert alert--info" role="status">
            Loading HydroShare resources…
          </div>
        )}
        {error && (
          <div className="alert alert--danger" role="alert">
            Unable to load HydroShare resources right now. Please try again later.
          </div>
        )}
        <section className="margin-top--lg margin-bottom--lg">
          <ProductTilesGrid
            products={products}
            showDocsAction
            fallbackDocsLink={group.docsRoute}
            groupId={group.id}
            onDocsNavigate={({ docsPath, groupId: targetGroupId }) => {
              const params = new URLSearchParams();
              params.set('group', targetGroupId);
              if (docsPath) {
                params.set('doc', docsPath);
              }
              history.push(`/docs?${params.toString()}`);
            }}
          />
        </section>
      </main>
    </Layout>
  );
}
