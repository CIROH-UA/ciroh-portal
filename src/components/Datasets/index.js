import React, { useEffect, useState, startTransition, useMemo } from "react";
import clsx from "clsx";
import { FaThLarge, FaBars, FaListUl } from "react-icons/fa";
import styles from "./styles.module.css";
import HydroShareResourcesTiles from "@site/src/components/HydroShareResourcesTiles";
import HydroShareResourcesRows from "@site/src/components/HydroShareResourcesRows";
import { getCommunityResources, getCuratedIds,fetchResourceCustomMetadata } from "@site/src/components/HydroShareImporter";
import { useColorMode } from "@docusaurus/theme-common"; // Hook to detect theme
import DatasetLightIcon from '@site/static/img/datasets_logo_light.png';
import DatasetDarkIcon from '@site/static/img/datasets_logo_dark.png';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { MdFilterList } from "react-icons/md";
import {
  HiOutlineSortDescending,
  HiOutlineSortAscending,
} from 'react-icons/hi';

// Search input debounce
let   debounceTimer    = null;
const DEBOUNCE_MS      = 1_000;

export default function Datasets({ community_id = 4 }) {
  // Search State
  const [searchInput,    setSearchInput]    = useState('');
  const [filterSearch,   setFilterSearch]   = useState('');
  const [sortType,       setSortType]       = useState('last-updated');
  const [sortDirection,  setSortDirection]  = useState('desc');

  const { colorMode } = useColorMode(); // Get the current theme
  const hs_icon = colorMode === 'dark' ? DatasetDarkIcon : DatasetLightIcon;
  const CURATED_PARENT_ID = "302dcbef13614ac486fb260eaa1ca87c";

  const PLACEHOLDER_ITEMS = 10;
  const initialPlaceholders = Array.from({ length: PLACEHOLDER_ITEMS }).map((_, index) => ({
    resource_id: `placeholder-${index}`,
    title: "",
    authors: "",
    resource_type: "",
    resource_url: "",
    description: "",
    thumbnail_url: "",
    page_url: "",
    docs_url: ""
  }));

  const [resources, setResources] = useState(initialPlaceholders);   // all resources
  const [curatedResources, setCuratedResources] = useState([]);     // subset for the curated tab
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("row");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    // Fetch the curated IDs first (from the "parent" resource).
    const fetchCuratedIds = async () => {
      try {
        const curatedIds = await getCuratedIds(CURATED_PARENT_ID);
        return curatedIds;
      } catch (err) {
        console.error("Error fetching curated IDs:", err);
        return [];
      }
    };

    // Fetch all resources by group, then filter them based on curated IDs
    const fetchAll = async () => {
      try {
        const [curatedIds, resourceList] = await Promise.all([
          fetchCuratedIds(),                // get array of curated resource IDs
          getCommunityResources("ciroh_portal_data") // get all resources for the group
        ]);

        // Map the full resource list to your internal format
        const mappedList = resourceList.map((res) => ({
          resource_id: res.resource_id,
          title: res.resource_title,
          authors: res.authors.map(
            (author) => author.split(',').reverse().join(' ')
          ).join(' 🖊️ '),
          resource_type: res.resource_type,
          resource_url: res.resource_url,
          description: res.abstract || "No description available.",
          date_created: res.date_created || "",
          date_last_updated: res.date_last_updated || "",
          thumbnail_url: hs_icon,
          page_url: "",
          docs_url: ""
        }));
        
        setResources(mappedList);
        
        for (let res of mappedList) {
          try {
            // const metadata = await fetchResourceMetadata(res.resource_id);
            const customMetadata = await fetchResourceCustomMetadata(res.resource_id);
            
            const updatedResource = {
              ...res,
              thumbnail_url: customMetadata?.thumbnail_url || hs_icon,
              page_url: customMetadata?.page_url || "",
              docs_url: customMetadata?.docs_url || "",

            };

            setResources((current) =>
              current.map((item) =>
                item.resource_id === updatedResource.resource_id ? updatedResource : item
              )
            );
          } catch (metadataErr) {
            console.error(`Error fetching metadata: ${metadataErr.message}`);
          }
        }

        // Filter to get only curated subset
        const curatedSubset = mappedList.filter(item =>
          curatedIds.includes(item.resource_id)
        );

        // setResources(mappedList);
        setCuratedResources(curatedSubset);
        setLoading(false);
      } catch (err) {
        console.error(`Error fetching resources: ${err.message}`);
        setError(err.message);
        setLoading(false);
      }
    };

    // Kick off fetch
    fetchAll();
  }, [community_id]);

  // Get filtered and sorted resources based on search and sort options
  const filteredResources = useMemo(() => {
    // Filter the resources based on search input
    const filtered = resources.filter(resource => {
      // Skip placeholder items
      if (resource.resource_id.startsWith('placeholder-')) return true;
      
      // If no search, show all
      if (!filterSearch) return true;
      
      // Search in title, authors, and description
      const searchLower = filterSearch.toLowerCase();
      return (
        resource.title.toLowerCase().includes(searchLower) ||
        resource.authors.toLowerCase().includes(searchLower) ||
        resource.description.toLowerCase().includes(searchLower) ||
        resource.date_created.toLowerCase().includes(searchLower) ||
        resource.date_last_updated.toLowerCase().includes(searchLower)
      );
    });

    // Sort the filtered results based on sortType and sortDirection
    return filtered.sort((a, b) => {
      // Keep placeholders at the beginning during loading
      if (a.resource_id.startsWith('placeholder-')) return -1;
      if (b.resource_id.startsWith('placeholder-')) return 1;
      
      let comparison = 0;
      
      switch (sortType)
      {
        case 'last-updated':
          comparison = a.date_last_updated.localeCompare(b.date_last_updated);
          break;
        case 'date-created':
          comparison = a.date_created.localeCompare(b.date_created);
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'authors':
          comparison = a.authors.localeCompare(b.authors);
          break;
        default:
          comparison = 0;
          break;
      }
      
      // Apply sort direction
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [resources, filterSearch, sortType, sortDirection]);

  // Get filtered and sorted curated resources based on search and sort options
  const filteredCuratedResources = useMemo(() => {
    // Filter the resources based on search input
    const filtered = curatedResources.filter(resource => {
      // Skip placeholder items
      if (resource.resource_id.startsWith('placeholder-')) return true;
      
      // If no search, show all
      if (!filterSearch) return true;
      
      // Search in title, authors, and description
      const searchLower = filterSearch.toLowerCase();
      return (
        resource.title.toLowerCase().includes(searchLower) ||
        resource.authors.toLowerCase().includes(searchLower) ||
        resource.description.toLowerCase().includes(searchLower) ||
        resource.date_created.toLowerCase().includes(searchLower) ||
        resource.date_last_updated.toLowerCase().includes(searchLower)
      );
    });

    // Sort the filtered results based on sortType and sortDirection
    return filtered.sort((a, b) => {
      // Keep placeholders at the beginning during loading
      if (a.resource_id.startsWith('placeholder-')) return -1;
      if (b.resource_id.startsWith('placeholder-')) return 1;
      
      let comparison = 0;
      
      switch (sortType)
      {
        case 'last-updated':
          comparison = a.date_last_updated.localeCompare(b.date_last_updated);
          break;
        case 'date-created':
          comparison = a.date_created.localeCompare(b.date_created);
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'authors':
          comparison = a.authors.localeCompare(b.authors);
          break;
        default:
          comparison = 0;
          break;
      }
      
      // Apply sort direction
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [curatedResources, filterSearch, sortType, sortDirection]);

  /* search helpers */
  const commitSearch = q => {
    clearTimeout(debounceTimer);
    setFilterSearch(q.trim());
  };
  const handleKeyUp   = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => commitSearch(searchInput), DEBOUNCE_MS);
  };
  const handleKeyPress = () => clearTimeout(debounceTimer);
  const handleKeyDown  = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitSearch(searchInput);
    }
  };
  const handleBlur = () => commitSearch(searchInput);

  const getFilteredResourceCount = () => {
    if (activeTab === "all") {
      return filteredResources.filter(r => !r.resource_id.startsWith('placeholder-')).length;
    } else {
      return filteredCuratedResources.filter(r => !r.resource_id.startsWith('placeholder-')).length;
    }
  }

  const getTotalResourceCount = () => {
    if (activeTab === "all") {
      return resources.filter(r => !r.resource_id.startsWith('placeholder-')).length;
    } else {
      return curatedResources.filter(r => !r.resource_id.startsWith('placeholder-')).length;
    }
  }

  if (error) {
    return <p style={{ color: "red" }}>Error: {error}</p>;
  }

  /* ---------------- render ---------------- */
  return (
    <div className={clsx(styles.wrapper)}>
      <div className={clsx("container", "margin-bottom--lg")}>
        {/* Counter */}
        <div className={styles.counterRow}>
          Showing&nbsp;
          <strong>{getFilteredResourceCount()}</strong>
          &nbsp;resources
          {!loading && (
            <> of <strong>{getTotalResourceCount()}</strong></>
          )}
        </div>

        {/* Search Form */}
        <form
          className={styles.filterForm}
          onSubmit={e => { e.preventDefault(); commitSearch(searchInput); }}
        >
          <input
            type="text"
            placeholder="Search by Title, Author, Description, Last Updated, Year Created..."
            className={styles.searchInput}
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyUp={handleKeyUp}
            onKeyPress={handleKeyPress}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
          />

          <select
            value={sortType}
            onChange={e => setSortType(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="last-updated">Last Updated</option>
            <option value="date-created">Date Created</option>
            <option value="title">Title</option>
            <option value="authors">Authors</option>
          </select>

          <button
            type="button"
            className={clsx('button', styles.button, styles.buttonPrimary)}
            aria-label={`Sort direction ${sortDirection}`}
            onClick={() =>
              startTransition(() =>
                setSortDirection(d => (d === 'asc' ? 'desc' : 'asc')),
              )
            }
          >
            {sortDirection === 'asc'
              ? <HiOutlineSortAscending size={25} className={styles.sortIcon} />
              : <HiOutlineSortDescending size={25} className={styles.sortIcon} />}
          </button>
        </form>

        {/* Toggle between grid view & list view */}
        <div className={styles.header}>
          <div className={styles.viewToggle}>
            <button
              className={clsx(styles.toggleButton, { [styles.active]: view === "grid" })}
              onClick={() => setView("grid")}
              title="Grid View"
            >
              <FaThLarge size={18} />
            </button>
            <button
              className={clsx(styles.toggleButton, { [styles.active]: view === "row" })}
              onClick={() => setView("row")}
              title="List View"
            >
              <FaBars size={18} />
            </button>
          </div>
        </div>

        {/* Tabs for "All" and "Curated" */}
        <Tabs 
          className={styles.contributeTabs}
          defaultValue="all"
          onTabChange={(value) => setActiveTab(value)}
        >
          <TabItem
            value="all"
            label={
              <span className={styles.tabLabel} onClick={() => setActiveTab('all')}>
                <FaListUl className={styles.tabIcon} /> All
              </span>
            }
            default
          >
            {view === "grid" ? (
              <HydroShareResourcesTiles resources={filteredResources} loading={loading} />
            ) : (
              <HydroShareResourcesRows resources={filteredResources} loading={loading} />
            )}
          </TabItem>

          <TabItem
            value="curated"
            label={
              <span className={styles.tabLabel} onClick={() => setActiveTab('curated')}>
                <MdFilterList className={styles.tabIcon} /> Curated
              </span>
            }
          >
            {view === "grid" ? (
              <HydroShareResourcesTiles resources={filteredCuratedResources} loading={loading} />
            ) : (
              <HydroShareResourcesRows resources={filteredCuratedResources} loading={loading} />
            )}
          </TabItem>
        </Tabs>

        {/* Empty state */}
        {!loading && getFilteredResourceCount() === 0 && (
          <p className={styles.emptyMessage}>No&nbsp;Resources&nbsp;Found</p>
        )}
      </div>
    </div>
  );
}
