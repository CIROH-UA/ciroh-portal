import React, { useEffect, useMemo, useRef, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { MdArrowForward } from 'react-icons/md';
import groups from '@site/src/components/ProductGroups/groups';
import styles from './styles.module.css';


export default function ProductsGroupsPage() {
  const groupRefs = useRef({});
  // Only get groups that have a title defined
  const displayGroups = useMemo(
    () => groups.filter(group => group.title),
    [],
  );
  // Only load products for display groups
  const [groupStates, setGroupStates] = useState(() => {
    const initialState = {};
    displayGroups.forEach(group => {
      initialState[group.id] = {
        products: [],
        loading: true,
        error: null,
      };
    });
    return initialState;
  });

  useEffect(() => {
    setGroupStates(prev => {
      const next = { ...prev };
      displayGroups.forEach(group => {
        const existing = prev[group.id];
        next[group.id] = {
          products: existing?.products ?? [],
          loading: true,
          error: null,
        };
      });
      return next;
    });

  }, [displayGroups]);

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

        <h2 className={styles.sectionTitle}>Categories</h2>
        <div className={styles.cardsGrid}>
          {displayGroups.map(group => (
            <Link
              key={group.id}
              id={group.id}
              ref={el => (groupRefs.current[group.id] = el)}
              className={styles.groupCard}
              to={`/product-groups/${group.id}`}
            >
              <div className={styles.cardIconWrapper}>
                {group.icon && <group.icon className={styles.cardIcon} />}
              </div>
              <div className={styles.cardContent}>
                <h2 className={styles.cardTitle}>{group.title}</h2>
                <p className={styles.cardDescription}>{group.blurb}</p>
              </div>
              <div className={styles.cardArrow}>
                <MdArrowForward aria-hidden="true" />
              </div>
            </Link>
          ))}
        </div>
      </main>
    </Layout>
  );
}
