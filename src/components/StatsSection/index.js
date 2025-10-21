
import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import Counter from "./Counter";
import styles from "./styles.module.css";
import { fetchResourcesByKeyword } from "@site/src/components/HydroShareImporter";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { FaRocket, FaBook, FaFlask, FaUserGraduate } from "react-icons/fa6";


const LOOKUP_TYPE_KEYWORD = {
    'products': 'nwm_portal_app',
    'datasets': 'ciroh_portal_data',
    'courses': 'nwm_portal_module',
    'publications': 'publications',
}

async function fetchTotal(groupId, apiKey, params, keyStr = '') {
  const path = keyStr ? `/collections/${keyStr}/items/top` : '/items/top';

  const url = new URL(`https://api.zotero.org/groups/${groupId}${path}`);
  Object.entries({ ...params, limit: 1 }).forEach(([k, v]) =>
    url.searchParams.append(k, v),
  );

  const resp = await fetch(url.href, { headers: { 'Zotero-API-Key': apiKey } });
  if (!resp.ok) return null;
  const hdr = resp.headers.get('Total-Results');
  return hdr ? Number(hdr) : null;
}

export default function StatsSection() {
  const sectionRef = useRef(null);
  const itemDefaults = useRef([
    {
      label: "Products",
      target: 0,
      Icon: FaRocket,
      accent: "#4BC1D3",
      accentSoft: "#4BC1D3",
    },
    {
      label: "Datasets",
      target: 0,
      Icon: FaFlask,
      accent: "#255F9C",
      accentSoft: "#255F9C",
    },
    {
      label: "Publications",
      target: 0,
      Icon: FaBook,
      accent: "#4BC1D3",
      accentSoft: "#4BC1D3",
    },
    {
      label: "Courses",
      target: 0,
      Icon: FaUserGraduate,
      accent: "#255F9C",
      accentSoft: "#255F9C",
    },
  ]);
  const [items, setItems] = useState(() =>
    itemDefaults.current.map((item) => ({ ...item, target: 0 })),
  );
  const [startCounting, setStartCounting] = useState(false);

  const {
    siteConfig: { customFields },
  } = useDocusaurusContext();

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const updatedItems = await Promise.all(
        itemDefaults.current.map(async (item) => {
          const keyword = LOOKUP_TYPE_KEYWORD[item.label.toLowerCase()];
          if (keyword && keyword !== 'publications') {
            try {
              const resources = await fetchResourcesByKeyword(keyword);
              const count = resources.length;
              return { ...item, target: count };
            } catch (error) {
              console.error(`[StatsSection] Failed to load ${item.label}`, error);
              return item;
            }
          }
          if (keyword === 'publications') {
            if (!customFields?.zotero_group_id || !customFields?.zotero_api_key) {
              return item;
            }
            try {
              const count = await fetchTotal(
                customFields.zotero_group_id,
                customFields.zotero_api_key,
                { itemType: 'journalArticle' },
                '',
              );
              return { ...item, target: count ?? 0 };
            } catch (error) {
              console.error('[StatsSection] Failed to load publications', error);
              return { ...item, target: 0 };
            }
          }
          return item;
        })
      );
      if (isMounted) {
        setItems(updatedItems);
      }
    })();
    
    return () => {
      isMounted = false;
    };
  }, [customFields]);

  useEffect(() => {
    if (startCounting) return;

    const node = sectionRef.current;
    if (!node || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setStartCounting(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStartCounting(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.35 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [startCounting]);

  return (
    <section
      ref={sectionRef}
      className={clsx(styles.statsSection)}
      aria-label="Portal statistics"
    >
      <div className={styles.statsGrid}>
        {items.map(({ label, target, Icon, accent, accentSoft }) => (
          <article
            key={label}
            className={styles.statCard}
            style={{ '--accent': accent, '--accent-soft': accentSoft }}
          >
            <div className={styles.iconBadge} aria-hidden="true">
              <Icon size={36} />
            </div>
            <div className={styles.statContent}>
              <Counter
                target={target}
                start={startCounting}
                format={(n) => n.toLocaleString()}
              />
              <span className={styles.statLabel}>{label}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
