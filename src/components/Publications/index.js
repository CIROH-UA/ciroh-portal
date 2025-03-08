import React, { useState, useEffect, useCallback, useRef } from 'react';
import Zotero from 'zotero-api-client';
import PublicationCard from './PublicationCard';
import SkeletonCard from './SkeletonCard';
import styles from './Publications.module.css';

const PAGE_SIZE = 50;
const SCROLL_THRESHOLD = 200; // pixels from bottom to trigger load

export default function Publications({ apiKey, groupId }) {
  // Single array that holds both placeholders and real items
  const [displayedItems, setDisplayedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetching = useRef(false);

  /**
   * Fetches a page of items, appending placeholders first, then
   * replacing them with real items.
   */
  const loadPublications = useCallback(async (page) => {
    if (fetching.current) return;
    fetching.current = true;

    try {
      setLoading(true);
      setError(null);

      // 1) Immediately add 50 placeholders
      const placeholderBatch = Array.from({ length: PAGE_SIZE }).map(() => ({
        placeholder: true,
      }));
      setDisplayedItems((prev) => [...prev, ...placeholderBatch]);

      // 2) Fetch real items
      const client = new Zotero(apiKey);
      const itemsResponse = await client
        .library('group', groupId)
        .items()
        .top()
        .get({
          start: page * PAGE_SIZE,
          limit: PAGE_SIZE,
          sort: 'date',
          direction: 'desc',
        });
      const newItems = itemsResponse.getData();

      // If we got fewer than PAGE_SIZE items, no more pages remain
      setHasMore(newItems.length === PAGE_SIZE);

      // 3) Replace placeholders with real items (in place)
      setDisplayedItems((prev) => {
        const updated = [...prev];
        // Find the first placeholder in updated
        const firstPlaceholderIndex = updated.findIndex((item) => item.placeholder);

        newItems.forEach((item, i) => {
          updated[firstPlaceholderIndex + i] = item;
        });

        // If there were fewer than PAGE_SIZE real items,
        // remove the leftover placeholders at the end
        if (newItems.length < PAGE_SIZE) {
          updated.splice(
            firstPlaceholderIndex + newItems.length,
            PAGE_SIZE - newItems.length
          );
        }
        return updated;
      });
    } catch (err) {
      setError(err.message || 'Error fetching publications');
    } finally {
      fetching.current = false;
      setLoading(false);
    }
  }, [apiKey, groupId]);

  /**
   * Load the first page on mount.
   */
  useEffect(() => {
    loadPublications(0);
  }, [loadPublications]);

  /**
   * Scroll listener - if the user is near bottom, load next page.
   * Note: We do NOT scroll the user anywhere in code;
   * we just let them stay where they are.
   */
  useEffect(() => {
    const handleScroll = () => {
      if (fetching.current || !hasMore) return;

      const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
      const nearBottom = scrollTop + clientHeight >= scrollHeight - SCROLL_THRESHOLD;
      if (nearBottom) {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        loadPublications(nextPage);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage, hasMore, loadPublications]);

  /**
   * Render
   */
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.publicationsContainer}>

          {/* Show error if any */}
          {error && (
            <div className={styles.errorContainer}>
              <div className={styles.error}>{error}</div>
            </div>
          )}

          {/* Render real items or placeholder skeletons in the same array */}
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

          {/* If no more items, show a final message */}
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
