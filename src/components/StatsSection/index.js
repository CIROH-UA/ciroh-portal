
import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import Counter from "./Counter";
import styles from "./styles.module.css";
import { fetchResourcesByKeyword, getCommunityResources } from "@site/src/components/HydroShareImporter";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { FaRocket, FaBook, FaFlask, FaUserGraduate } from "react-icons/fa6";
import HeroSection from "@site/src/components/HeroSection";

const LOOKUP_TYPE_KEYWORD = {
    'products': 'nwm_portal_app',
    'datasets': 'datasets',
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

function usePrefersReducedMotion() {
  const [prefers, setPrefers] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;

    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (event) => setPrefers(event.matches);

    setPrefers(query.matches);
    if (query.addEventListener) {
      query.addEventListener("change", handleChange);
    } else if (query.addListener) {
      query.addListener(handleChange);
    }

    return () => {
      if (query.removeEventListener) {
        query.removeEventListener("change", handleChange);
      } else if (query.removeListener) {
        query.removeListener(handleChange);
      }
    };
  }, []);

  return prefers;
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
  const [isVisible, setIsVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const {
    siteConfig: { customFields },
  } = useDocusaurusContext();

  useEffect(() => {
    setIsClient(true);
  }, []);

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
          if (keyword ==='datasets'){
            try{
              const resources = await getCommunityResources();
              const count = resources.length;
              return { ...item, target: count };
            }
            catch (error){
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
    if (isVisible) return;

    if (prefersReducedMotion) {
      setStartCounting(true);
      setIsVisible(true);
      return undefined;
    }

    const node = sectionRef.current;
    if (!node || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setStartCounting(true);
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStartCounting(true);
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [isVisible, prefersReducedMotion]);

  return (
    <HeroSection
      description="Our team of researchers, hydrologists, 
        and engineers is committed to advancing our understanding of hydrologic processes, 
        improving operational hydrologic forecasting techniques and workflows."
    >
      <div
        ref={sectionRef}
        className={clsx(styles.statsSection)}
        aria-label="Portal statistics"
      >
        <div className={styles.statsGrid}>
          {items.map(({ label, target, Icon, accent, accentSoft }, index) => {
            const duration = 720 + index * 80;

            return (
            <article
              key={label}
              className={clsx(
                styles.statCard,
                isClient && styles.statCardAnimated,
                isClient && isVisible && styles.statCardVisible,
              )}
              style={{ '--accent': accent, '--accent-soft': accentSoft, '--delay': index }}
            >
             {/* <div className={styles.iconBadge} aria-hidden="true">
                <Icon size={36} />
              </div> */}
              <div className={styles.statContent}>
               <div className={styles.iconBadge} aria-hidden="true">
                  <Icon size={80} />
                </div>
                <Counter
                  target={target}
                  start={startCounting}
                  duration={duration}
                  format={(n) => n.toLocaleString()}
                />

                {/* <span className={styles.statLabel}>{label}</span> */}
              </div>
              <div aria-hidden="true">
                
                <span className={styles.statLabel}>{label}</span>
              </div>


            </article>
            );
          })}
        </div>
      </div>
    </HeroSection>
  );
}
