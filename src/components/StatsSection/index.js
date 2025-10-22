
import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import Counter from "./Counter";
import styles from "./styles.module.css";
import { fetchResourcesByKeyword, getCommunityResources, fetchRawCuratedResources } from "@site/src/components/HydroShareImporter";
import { fetchTotal } from "@site/src/components/Publications";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { FaRocket, FaBook, FaFlask, FaUserGraduate, FaTv  } from "react-icons/fa6";
import HeroSection from "@site/src/components/HeroSection";
import Link from "@docusaurus/Link";

const LOOKUP_TYPE_KEYWORD = {
    'products': 'nwm_portal_app',
    'datasets': 'datasets',
    'courses': 'nwm_portal_module',
    'publications': 'publications',
    'presentations': 'presentations',
}

function joinExtraResources(groupResources, extraResources) {
  const seenResourceIds = new Set();
  const allResources = groupResources.concat(extraResources);
  const uniqueResources = [];
  
  // Filter and collect unique resources
  allResources.forEach( (resource) => {
    const resourceId = resource.resource_id;
    if (!seenResourceIds.has(resourceId)) {
      seenResourceIds.add(resourceId);
      uniqueResources.push(resource);
    }
  });

  return uniqueResources;

}

const fetchAllPresentations = async () => {
  const CURATED_PARENT_ID = "200fa86bea61438aa862d437103485db";
  try {
    const [rawCuratedResources, invKeywordResources, invCollections] = await Promise.all([
      fetchRawCuratedResources(CURATED_PARENT_ID), // get array of curated resource IDs
      fetchResourcesByKeyword("ciroh_portal_presentation"), // Chronological order
      fetchResourcesByKeyword("ciroh_portal_pres_collections"),
    ]);
    console.log('Fetched presentations data:', { rawCuratedResources, invKeywordResources, invCollections });
    const rawKeywordResources = invKeywordResources.reverse(); // Revr

    const rawResources = joinExtraResources(rawKeywordResources, rawCuratedResources); // Merge ensures backwards compatibility for presentations predating the keyword  
    return rawResources.length;

  } catch (err) {
    console.error(`Error fetching resources: ${err.message}`);
    return 0;
  }
};

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
      target: 20,
      Icon: FaRocket,
      accent: "#4BC1D3",
      accentSoft: "#4BC1D3",
      href: "/products",
    },
    {
      label: "Datasets",
      target: 20,
      Icon: FaFlask,
      accent: "#255F9C",
      accentSoft: "#255F9C",
      href: "/datasets",
    },
    {
      label: "Presentations",
      target: 25,
      Icon: FaTv,
      accent: "#4BC1D3",
      accentSoft: "#4BC1D3",
      href: "/presentations",
    },
    {
      label: "Publications",
      target: 100,
      Icon: FaBook,
      accent: "#255F9C",
      accentSoft: "#255F9C",
      href: "/publications",
    },
    {
      label: "Courses",
      target: 10,
      Icon: FaUserGraduate,
      accent: "#4BC1D3",
      accentSoft: "#4BC1D3",
      href: "/courses",
    },
  ]);
  const [items, setItems] = useState(itemDefaults.current);
  const [startCounting, setStartCounting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const {
    siteConfig: { customFields },
  } = useDocusaurusContext();


  useEffect(() => {
    let isMounted = true;
    setIsClient(true);
    (async () => {
      const updatedItems = await Promise.all(
        itemDefaults.current.map(async (item) => {
          const keyword = LOOKUP_TYPE_KEYWORD[item.label.toLowerCase()];
          console.log(`Fetching count for ${item.label} with keyword: ${keyword}`);

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
          else if (keyword === 'presentations') {
            try {
              const resources = await fetchAllPresentations();
              console.log('Total presentations fetched:', resources);
              return { ...item, target: resources };
            }
            catch (error) {
              console.error(`[StatsSection] Failed to load ${item.label}`, error);
              return item;
            }
          }
          else if (keyword === 'publications') {
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
          else {
            try {
              const resources = await fetchResourcesByKeyword(keyword);
              const count = resources.length;
              return { ...item, target: count };
            } catch (error) {
              console.error(`[StatsSection] Failed to load ${item.label}`, error);
              return item;
            }
          }
        })
      );
      if (isMounted) {
        setItems(updatedItems);
      }
    })();
    
    return () => {
      isMounted = false;
    };
  }, []);

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
      background="secondary"
    >
      <div
        ref={sectionRef}
        className={clsx(styles.statsSection)}
        aria-label="Portal statistics"
      >
        <div className={styles.statsGrid}>
          {items.map(({ label, target, Icon, accent, accentSoft, href }, index) => {
            const duration = 1800;

            return (
              <Link
                key={label}
                to={href}
                className={styles.statCardLink}
                aria-label={`${label} resources`}
              >
                <article
                  className={clsx(
                    styles.statCard,
                    isClient && styles.statCardAnimated,
                    isClient && isVisible && styles.statCardVisible,
                  )}
                  style={{ '--accent': accent, '--accent-soft': accentSoft, '--delay': index }}
                >
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
                  </div>
                  <div aria-hidden="true">
                    <span className={styles.statLabel}>{label}</span>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </HeroSection>
  );
}
