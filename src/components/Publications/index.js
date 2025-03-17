import React, { useState, useEffect, useCallback, useRef } from 'react';
import Zotero from 'zotero-api-client';
import PublicationCard from './PublicationCard';
import SkeletonCard from './SkeletonCard';
import styles from './Publications.module.css';
import clsx from 'clsx';

import { HiOutlineSortDescending, HiOutlineSortAscending } from "react-icons/hi";


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
  const [filterSearch, setFilterSearch] = useState("");
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
        include: 'data',
      };

      if (filterSearch) {
        console.log("filterSearch", filterSearch);
        queryOptions.q = filterSearch;
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
      setError('Error retrieving the publications');
    } finally {
      fetching.current = false;
      setLoading(false);
    }
  }, [apiKey, groupId, filterSearch, filterItemType, sortType, sortDirection]);



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
  // const handleFilterSubmit = (e) => {
  //   e.preventDefault();
  //   // Reset state for new filter settings
  //   setDisplayedItems([]);
  //   setCurrentPage(0);
  //   setHasMore(true);
  //   loadPublications(0);
  // };

  const onBlurHandler = (e) => {
    // https://www.peterbe.com/plog/onchange-in-reactjs
    setFilterSearch(e.target.value);
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* Filter and sort form */}
        {/* <form onSubmit={handleFilterSubmit} className={styles.filterForm}> */}
        


          <form className={styles.filterForm}>
          <input
            type="text"
            placeholder="Search title, author, etc."
            // value={filterSearch}
            onBlur={onBlurHandler}
            className={styles.searchInput}

          />
          <select
            value={filterItemType}
            onChange={(e) => setFilterItemType(e.target.value)}
            className={styles.typeSelect}
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
            className={styles.sortSelect}
          >
            <option value="date">Published Date</option>
            <option value="dateAdded">Date added to the library</option>
            <option value="title">Title</option>
            <option value="creator">Creator</option>
            <option value="itemType">Item Type</option>
            <option value="publisher">Publisher</option>
          </select>
          <button
            type="button"
            onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
              className={clsx(
                'button',
                styles.button,
                styles.buttonPrimary
              )}
            aria-label={`Sort direction ${sortDirection}`}
          >
            {sortDirection === 'asc' ? (
              <HiOutlineSortAscending size={25} className={styles.sortIcon} />
            ) : (
              <HiOutlineSortDescending  size={25} className={styles.sortIcon} />
            )}
          </button>


          {/* <button type="submit">Apply Filters</button> */}
        </form>
        {error && (
            <div className={styles.errorContainer}>
              <div className={styles.error}>{error}</div>
            </div>
          )}

        <div className={styles.publicationsContainer}>

          {!error && 
          
          displayedItems.map((item, index) =>
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
          {/* {!hasMore && !loading && (
            <div className={styles.endMessage}>
              All publications loaded (
              {displayedItems.filter((item) => !item.placeholder).length} items)
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}
