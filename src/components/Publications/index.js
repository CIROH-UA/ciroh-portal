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
      // Determine if there's more content based on received items count
      setHasMore(newItems.length === PAGE_SIZE);
      
    } catch (err) {
      setError(err.message || 'Error fetching publications');
    } finally {
      isInitialLoad ? setLoading(false) : setLoadingMore(false);
    }
  }, [apiKey, groupId]);

  useEffect(() => {
    const handleScroll = throttle(() => {
      const nearBottom = window.innerHeight + document.documentElement.scrollTop + 100
        >= document.documentElement.offsetHeight;
      
      if (nearBottom && hasMore && !loadingMore) {
        setCurrentPage(prev => {
          const nextPage = prev + 1;
          loadPublications(nextPage);
          return nextPage;
        });
      }
    }, 200);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loadingMore, loadPublications]);

  useEffect(() => {
    loadPublications(0);
  }, [loadPublications]);

  return (
    <div className={styles.publicationsContainer}>
      {publications.map((pub, index) => (
        <PublicationCard 
          key={pub.key || index} 
          publication={pub} 
          index={index}
        />
      ))}

      {/* Show skeletons only when loading and there's more data */}
      {(loading || loadingMore) && hasMore && (
        Array.from({ length: PAGE_SIZE }).map((_, i) => (
          <SkeletonCard key={`skeleton-${currentPage}-${i}`} />
        ))
      )}

      {/* Show end message only when not loading and no more data */}
      {!hasMore && !loading && !loadingMore && (
        <div className={styles.endMessage}>
          All publications loaded
        </div>
      )}
    </div>
  );
}

// Throttle function remains the same
function throttle(fn, wait) {
  let time = Date.now();
  return function() {
    if ((time + wait - Date.now()) < 0) {
      fn();
      time = Date.now();
    }
  };
}