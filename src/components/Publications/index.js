import React, { useState, useEffect, useCallback, useRef } from 'react';
import Zotero from 'zotero-api-client';
import PublicationCard from './PublicationCard';
import SkeletonCard from './SkeletonCard';
import styles from './Publications.module.css';

const PAGE_SIZE = 50;
const SCROLL_THRESHOLD = 200; // pixels from bottom to trigger load

export default function Publications({ apiKey, groupId }) {
  // State for the list of publications and pagination
  const [displayedItems, setDisplayedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetching = useRef(false);

  // States for filters
  const [filterTitle, setFilterTitle] = useState("");
  const [filterItemType, setFilterItemType] = useState("all");

  // New states for sorting options
  const [sortType, setSortType] = useState("date"); // default sort field
  const [sortDirection, setSortDirection] = useState("desc"); // default sort direction

  // Fetch a page of items with the current filter and sort settings
  const loadPublications = useCallback(async (page) => {
    if (fetching.current) return;
    fetching.current = true;
    try {
      setLoading(true);
      setError(null);

      // Add placeholders for smooth UX
      const placeholderBatch = Array.from({ length: PAGE_SIZE }).map(() => ({
        placeholder: true,
      }));
      setDisplayedItems((prev) => [...prev, ...placeholderBatch]);

      // Build query options using filters and sorting values
      const queryOptions = {
        start: page * PAGE_SIZE,
        limit: PAGE_SIZE,
        sort: sortType,
        direction: sortDirection,
      };

      if (filterTitle) {
        queryOptions.q = filterTitle;
      }
      if (filterItemType && filterItemType !== 'all') {
        queryOptions.itemType = filterItemType;
      }

      const client = new Zotero(apiKey);
      const itemsResponse = await client
        .library('group', groupId)
        .items()
        .top()
        .get(queryOptions);
      const newItems = itemsResponse.getData();

      // If fewer than PAGE_SIZE were returned, no more pages remain
      setHasMore(newItems.length === PAGE_SIZE);

      // Replace placeholders with real items
      setDisplayedItems((prev) => {
        const updated = [...prev];
        const firstPlaceholderIndex = updated.findIndex((item) => item.placeholder);
        newItems.forEach((item, i) => {
          updated[firstPlaceholderIndex + i] = item;
        });
        if (newItems.length < PAGE_SIZE) {
          updated.splice(firstPlaceholderIndex + newItems.length, PAGE_SIZE - newItems.length);
        }
        return updated;
      });
    } catch (err) {
      setError(err.message || 'Error fetching publications');
    } finally {
      fetching.current = false;
      setLoading(false);
    }
  }, [apiKey, groupId, filterTitle, filterItemType, sortType, sortDirection]);

  // Reset and load first page whenever filters or sorting change
  useEffect(() => {
    setDisplayedItems([]);
    setCurrentPage(0);
    setHasMore(true);
    loadPublications(0);
  }, [loadPublications]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (fetching.current || !hasMore) return;
      const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - SCROLL_THRESHOLD) {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        loadPublications(nextPage);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage, hasMore, loadPublications]);

  // Handle filter form submission
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    // Reset state for new filter settings
    setDisplayedItems([]);
    setCurrentPage(0);
    setHasMore(true);
    loadPublications(0);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* Filter and sort form */}
        <form onSubmit={handleFilterSubmit} className={styles.filterForm}>
          <input
            type="text"
            placeholder="Search title..."
            value={filterTitle}
            onChange={(e) => setFilterTitle(e.target.value)}
          />
          <select
            value={filterItemType}
            onChange={(e) => setFilterItemType(e.target.value)}
          >
            <option value="all">All types</option>
            <option value="book">Book</option>
            <option value="journalArticle">Journal Article</option>
            <option value="conferencePaper">Conference Paper</option>
            <option value="prePrint">Pre Print</option>
            <option value="document">Document</option>
            <option value="bookSection">Book Section</option>
          </select>
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
          >
            <option value="dateAdded">dateAdded</option>
            <option value="dateModified">dateModified</option>
            <option value="title">title</option>
            <option value="creator">creator</option>
            <option value="itemType">itemType</option>
            <option value="date">date</option>
            <option value="publisher">publisher</option>
            <option value="publicationTitle">publicationTitle</option>
            <option value="journalAbbreviation">journalAbbreviation</option>
            <option value="language">language</option>
            <option value="accessDate">accessDate</option>
            <option value="libraryCatalog">libraryCatalog</option>
            <option value="callNumber">callNumber</option>
            <option value="rights">rights</option>
            <option value="addedBy">addedBy</option>
            <option value="numItems">numItems</option>
          </select>
          <select
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value)}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
          <button type="submit">Apply Filters</button>
        </form>

        <div className={styles.publicationsContainer}>
          {error && (
            <div className={styles.errorContainer}>
              <div className={styles.error}>{error}</div>
            </div>
          )}
          {displayedItems.map((item, index) =>
            item.placeholder ? (
              <SkeletonCard key={`placeholder-${index}`} />
            ) : (
              <PublicationCard
                key={item.key || `publication-${index}`}
                publication={item}
                index={index}
              />
            )
          )}
          {!hasMore && !loading && (
            <div className={styles.endMessage}>
              All publications loaded (
              {displayedItems.filter((item) => !item.placeholder).length} items)
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
