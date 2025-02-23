import React, { useState, useEffect, useCallback, useRef } from 'react';
import Zotero from 'zotero-api-client';
import PublicationCard from './PublicationCard';
import SkeletonCard from './SkeletonCard';
import styles from './Publications.module.css';

const PAGE_SIZE = 50;
const SCROLL_THRESHOLD = 200; // pixels from bottom to trigger load

export default function Publications({ apiKey, groupId }) {
  const [publications, setPublications] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);
  const fetching = useRef(false);

  const loadPublications = useCallback(async (page = 0) => {
    if (fetching.current) return;
    fetching.current = true;
    
    try {
      page === 0 ? setLoading(true) : setLoadingMore(true);
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
      console.log('newItems', newItems);
      
      // Record the scroll height before new items are appended.
      const prevScrollHeight = document.documentElement.scrollHeight;
      
      // Merge and sort the publications: latest dates first, no date goes to the end.
      setPublications(prev => {
        const combined = [...prev, ...newItems];
        return combined;
      });
      setHasMore(newItems.length === PAGE_SIZE);
  
      // After new items are rendered, if the user was near the bottom,
      // scroll down by the exact increase in height.
      requestAnimationFrame(() => {
        const { scrollTop, clientHeight } = document.documentElement;
        if (scrollTop + clientHeight >= prevScrollHeight - 10) {
          const newScrollHeight = document.documentElement.scrollHeight;
          window.scrollTo({
            top: scrollTop + (newScrollHeight - prevScrollHeight),
            behavior: 'auto'
          });
        }
      });
      
    } catch (err) {
      setError(err.message || 'Error fetching publications');
    } finally {
      fetching.current = false;
      page === 0 ? setLoading(false) : setLoadingMore(false);
    }
  }, [apiKey, groupId]);
  
  useEffect(() => {
    const handleScroll = () => {
      if (fetching.current || !hasMore) return;
      
      const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
      const nearBottom = scrollTop + clientHeight >= scrollHeight - SCROLL_THRESHOLD;

      if (nearBottom) {
        setCurrentPage(prev => {
          const nextPage = prev + 1;
          loadPublications(nextPage);
          return nextPage;
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loadPublications]);

  useEffect(() => {
    loadPublications(0);
  }, [loadPublications]);

  // Determine the total slots to render (publications plus placeholders if loading)
  const totalSlots = publications.length + (loading || loadingMore ? PAGE_SIZE : 0);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.publicationsContainer} ref={containerRef}>
      {Array.from({ length: totalSlots }).map((_, index) => {
        const pub = publications[index];
        return pub ? (
          <PublicationCard 
            key={pub.key || index} 
            publication={pub} 
            index={index}
          />
        ) : (
          <SkeletonCard key={`skeleton-${index}`} />
        );
      })}

      {/* {!hasMore && !loading && (
        <div className={styles.endMessage}>
          All publications loaded ({publications.length} items)
        </div>
      )} */}
    </div>

      </div>
    </div>

  );
}
