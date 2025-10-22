import React, { useEffect, useState, startTransition, useMemo } from "react";
import clsx from "clsx";
import { FaThLarge, FaBars } from "react-icons/fa";
import styles from "./styles.module.css";
import HydroShareResourcesTiles from "@site/src/components/HydroShareResourcesTiles";
import HydroShareResourcesRows from "@site/src/components/HydroShareResourcesRows";
import { fetchResourcesByKeyword, fetchResourcesBySearch, fetchResourceMetadata, fetchResourceCustomMetadata } from "@site/src/components/HydroShareImporter";
import { useColorMode } from "@docusaurus/theme-common"; // Hook to detect theme
import DatasetLightIcon from '@site/static/img/datasets_logo_light.png';
import DatasetDarkIcon from '@site/static/img/datasets_logo_dark.png';
import {
  HiOutlineSortDescending,
  HiOutlineSortAscending,
} from 'react-icons/hi';

let   debounceTimer    = null;
const DEBOUNCE_MS      = 1_000;

export default function HydroShareResourcesSelector({ keyword = "nwm_portal_app", defaultImage }) {
  // Search State
  const [searchInput,    setSearchInput]    = useState('');
  const [filterSearch,   setFilterSearch]   = useState('');
  const [sortType,       setSortType]       = useState('modified');
  const [sortDirection,  setSortDirection]  = useState('desc');
  const [selectedAuthor, setSelectedAuthor] = useState('all-authors');

  const { colorMode } = useColorMode(); // Get the current theme
  const PLACEHOLDER_ITEMS = 10;

  // Initialize with placeholder objects so that the component renders immediately.
  const initialPlaceholders = Array.from({ length: PLACEHOLDER_ITEMS }).map((_, index) => ({
    resource_id: `placeholder-${index}`,
    title: "",
    authors: "",
    resource_type: "",
    resource_url: "",
    description: "",
    thumbnail_url: "",
    page_url: "",
    docs_url: "",
  }));

  const hs_icon = colorMode === 'dark' ? DatasetDarkIcon : DatasetLightIcon;
  
  const [resources, setResources] = useState(initialPlaceholders);
  const [initialAuthors, setInitialAuthors] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("row");
  useEffect(() => {
    (async () => {
      try {
        let resourceList = undefined;

        // Start data fetching (while placeholders are already rendered)
        // Search bar has text
        if (filterSearch.trim() !== '')
        {
          // For search, use the search API with server-side sorting
          const ascending = sortDirection === 'asc' ? true : false;
          const author = selectedAuthor !== 'all-authors' ? selectedAuthor : undefined;
          resourceList = await fetchResourcesBySearch(keyword, filterSearch, ascending, sortType, author);
        } 
        else
        // Search bar does NOT have text
        {
          // For no search, get all resources and apply client-side filtering/sorting
          resourceList = await fetchResourcesByKeyword(keyword);
          
          // Apply author filtering if needed
          if (selectedAuthor !== 'all-authors') {
            resourceList = resourceList.filter(res => 
              res.authors && res.authors.some(author => 
                author.split(',').reverse().join(' ').trim() === selectedAuthor
              )
            );
          }
          
          // Apply client-side sorting
          resourceList = resourceList.sort((a, b) => {
            let comparison = 0;
            
            switch (sortType) {
              case 'modified':
                comparison = a.date_last_updated.localeCompare(b.date_last_updated);
                break;
              case 'created':
                comparison = a.date_created.localeCompare(b.date_created);
                break;
              case 'title':
                comparison = a.resource_title.localeCompare(b.resource_title);
                break;
              case 'author':
                const aAuthors = a.authors.map(author => author.split(',').reverse().join(' ')).join(' 🖊️ ');
                const bAuthors = b.authors.map(author => author.split(',').reverse().join(' ')).join(' 🖊️ ');
                comparison = aAuthors.localeCompare(bAuthors);
                break;
              default:
                comparison = 0;
                break;
            }
            
            // Apply sort direction
            return sortDirection === 'asc' ? comparison : -comparison;
          });
        }

        const mappedList = resourceList.map((res) => ({
          resource_id: res.resource_id,
          title: res.resource_title,
          authors: res.authors.map(
            (author) => author.split(',').reverse().join(' ')
          ).join(' 🖊️ '),
          resource_type: res.resource_type,
          resource_url: res.resource_url,
          description: res.abstract || "No description available.",
          date_created: res.date_created,
          date_last_updated: res.date_last_updated,
          thumbnail_url: "",
          page_url: "",
          docs_url: "",
          embed_url: "",
        }));

        // Replace placeholders with fetched data
        setResources(mappedList);
        setLoading(false);

        // Set initial authors only on the first load (the values used for the author filter dropdown)
        if (filterSearch.trim() === '' && initialAuthors.length === 0) {
          const authorSet = new Set();
          mappedList.forEach(resource => {
            if (resource.authors) {
              // Split authors by 🖊️ and add each one
              resource.authors.split(' 🖊️ ').forEach(author => {
                const trimmedAuthor = author.trim();
                if (trimmedAuthor) {
                  authorSet.add(trimmedAuthor);
                }
              });
            }
          });
          setInitialAuthors(Array.from(authorSet).sort());
        }

        // Fetch metadata for each resource and update them individually
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
      } catch (err) {
        console.error(`Error fetching resources: ${err.message}`);
        setError(err.message);
        setLoading(false);
      }
    })();
  }, [keyword, filterSearch, sortDirection, sortType, selectedAuthor]);

  if (error) {
    return <p style={{ color: "red" }}>Error: {error}</p>;
  }

  // Use the stored initial authors (set only once during first load)
  const uniqueAuthors = initialAuthors;

  // Resources are pre-processed in useEffect, so just return them
  const displayResources = resources;

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

  /* ---------------- render ---------------- */
  return (
    <div className={clsx(styles.wrapper)}>
      <div className={clsx("container", "margin-bottom--lg")}>
        {/* counter */}
      <div className={styles.counterRow}>
        Showing&nbsp;
        <strong>{displayResources.filter(r => !r.resource_id.startsWith('placeholder-')).length}</strong>
        &nbsp; { keyword == 'nwm_portal_app' ? 'Products' : keyword == 'nwm_portal_module' ? 'Courses' : 'Resources' }
        {!loading && <> of <strong>{displayResources.filter(r => !r.resource_id.startsWith('placeholder-')).length}</strong></>}
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
            value={selectedAuthor}
            onChange={e => setSelectedAuthor(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="all-authors">All Authors</option>
            {uniqueAuthors.map(author => (
              <option key={author} value={author}>{author}</option>
            ))}
          </select>

          <select
            value={sortType}
            onChange={e => setSortType(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="modified">Last Updated</option>
            <option value="created">Date Created</option>
            <option value="title">Title</option>
            <option value="author">Authors</option>
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
        
        {/* Header */}
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

        {/* Resources */}
        {view === "grid" ? (
          <HydroShareResourcesTiles resources={displayResources} />
        ) : (
          <HydroShareResourcesRows resources={displayResources} />
        )}

        {/* empty */}
        {!loading &&
          displayResources.filter(r => !r.resource_id.startsWith('placeholder-')).length === 0 && (
            <p className={styles.emptyMessage}>No&nbsp;Resources&nbsp;Found</p>
          )}
      </div>
    </div>
  );
}
