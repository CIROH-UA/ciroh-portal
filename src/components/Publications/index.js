import React, { useState, useEffect, useCallback } from 'react';
import Zotero from 'zotero-api-client';
import PublicationCard from './PublicationCard';
import SkeletonCard from './SkeletonCard';
import styles from './Publications.module.css';

const PAGE_SIZE = 50;

export default function Publications({ apiKey, groupId }) {
  const [publications, setPublications] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const loadPublications = useCallback(async (page = 0) => {
    const isInitialLoad = page === 0;
    try {
      isInitialLoad ? setLoading(true) : setLoadingMore(true);
      setError(null);

      const client = new Zotero(apiKey);
      const itemsResponse = await client
        .library('group', groupId)
        .items()
        .top()
        .get({
          start: page * PAGE_SIZE,
          limit: PAGE_SIZE,
          sort: 'date',
          direction: 'desc'
        });

      const newItems = itemsResponse.getData();
      setPublications(prev => [...prev, ...newItems]);
      setHasMore(newItems.length === PAGE_SIZE);
      
    } catch (err) {
      setError(err.message || 'Error fetching publications');
    } finally {
      isInitialLoad ? setLoading(false) : setLoadingMore(false);
    }
  }, [apiKey, groupId]);

  useEffect(() => {
    loadPublications(1);
  }, [loadPublications]);

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom = window.innerHeight + document.documentElement.scrollTop + 100
        >= document.documentElement.offsetHeight;
      
      if (nearBottom && hasMore && !loadingMore) {
        setCurrentPage(prev => {
          const nextPage = prev + 1;
          loadPublications(nextPage);
          return nextPage;
        });
      }
    };

    const scrollHandler = throttle(handleScroll, 200);
    window.addEventListener('scroll', scrollHandler);
    return () => window.removeEventListener('scroll', scrollHandler);
  }, [hasMore, loadingMore, loadPublications]);

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.error}>Error: {error}</p>
        <button 
          className="button button--primary"
          onClick={() => loadPublications(currentPage)}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.publicationsContainer}>
      {/* Existing publications */}
      {publications.map((pub, index) => (
        <PublicationCard 
          key={pub.key || index} 
          publication={pub} 
          index={index}
        />
      ))}

      {/* Loading skeletons for initial load */}
      {loading && Array.from({ length: PAGE_SIZE }).map((_, i) => (
        <SkeletonCard key={`skeleton-initial-${i}`} />
      ))}

      {/* Loading skeletons for pagination */}
      {loadingMore && Array.from({ length: PAGE_SIZE }).map((_, i) => (
        <SkeletonCard key={`skeleton-more-${i}`} />
      ))}

      {/* End of results */}
      {!hasMore && !loading && (
        <div className={styles.endMessage}>
          No more publications to load
        </div>
      )}
    </div>
  );
}

// Helper function to throttle scroll events
function throttle(fn, wait) {
  let time = Date.now();
  return function() {
    if ((time + wait - Date.now()) < 0) {
      fn();
      time = Date.now();
    }
  };
}