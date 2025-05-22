import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  startTransition,
} from 'react';
import Zotero from 'zotero-api-client';
import PublicationCard from './PublicationCard';
import SkeletonCard from './SkeletonCard';
import styles from './Publications.module.css';
import clsx from 'clsx';
import {
  HiOutlineSortDescending,
  HiOutlineSortAscending,
} from 'react-icons/hi';

const PAGE_SIZE        = 50;
const SCROLL_THRESHOLD = 200;
let   debounceTimer    = null;
const DEBOUNCE_MS      = 1_000;

/* ------------------------------------------------------------------ */
/* utility: one-off HEAD/GET to obtain the Total-Results header        */
/* ------------------------------------------------------------------ */
async function fetchTotal(groupId, apiKey, params) {
  const url = new URL(
    `https://api.zotero.org/groups/${groupId}/items/top`
  );
  Object.entries({
    ...params,
    limit: 1,          // only need the header
  }).forEach(([k, v]) => url.searchParams.append(k, v));

  const resp = await fetch(url.href, {
    headers: { 'Zotero-API-Key': apiKey },
  });
  if (!resp.ok) return null;
  const hdr = resp.headers.get('Total-Results');
  return hdr ? Number(hdr) : null;
}

export default function Publications({ apiKey, groupId }) {
  /* ------------------------- state -------------------------------- */
  const [displayedItems, setDisplayedItems] = useState([]);
  const [currentPage,    setCurrentPage]    = useState(0);
  const [hasMore,        setHasMore]        = useState(true);
  const [loading,        setLoading]        = useState(false);
  const [error,          setError]          = useState(null);
  const fetching = useRef(false);

  const [totalItems, setTotalItems] = useState(null);

  const [filterSearch,   setFilterSearch]   = useState('');
  const [filterItemType, setFilterItemType] = useState('all');
  const [sortType,       setSortType]       = useState('date');
  const [sortDirection,  setSortDirection]  = useState('desc');

  /* ------------------- fetch total results ------------------------ */
  const refreshTotalResults = useCallback(async () => {
    const params = {
      sort:      sortType,
      direction: sortDirection,
      ...(filterSearch   ? { q: filterSearch }      : {}),
      ...(filterItemType !== 'all'
          ? { itemType: filterItemType }
          : {}),
    };
    try {
      const total = await fetchTotal(groupId, apiKey, params);
      setTotalItems(total);
    } catch (e) {
      console.error('Could not read Total-Results header:', e);
      setTotalItems(null);
    }
  }, [groupId, apiKey, filterSearch, filterItemType, sortType, sortDirection]);

  /* ------------------- main paginator loader ---------------------- */
  const loadPublications = useCallback(
    async (page) => {
      if (fetching.current) return;
      fetching.current = true;

      try {
        setLoading(true);
        setError(null);

        setDisplayedItems((prev) => [
          ...prev,
          ...Array.from({ length: PAGE_SIZE }, () => ({ placeholder: true })),
        ]);

        const query = {
          start: page * PAGE_SIZE,
          limit: PAGE_SIZE,
          sort:  sortType,
          direction: sortDirection,
          include: 'data',
          ...(filterSearch   ? { q: filterSearch }      : {}),
          ...(filterItemType !== 'all'
              ? { itemType: filterItemType }
              : {}),
        };

        const client        = new Zotero(apiKey);
        const itemsResponse = await client
          .library('group', groupId)
          .items()
          .top()
          .get(query);

        const newItems = itemsResponse.getData();

        setHasMore(newItems.length === PAGE_SIZE);

        setDisplayedItems((prev) => {
          const updated = [...prev];
          const firstPh = updated.findIndex((i) => i.placeholder);
          newItems.forEach((item, i) => {
            updated[firstPh + i] = item;
          });
          if (newItems.length < PAGE_SIZE) {
            updated.splice(
              firstPh + newItems.length,
              PAGE_SIZE - newItems.length
            );
          }
          return updated;
        });
      } catch {
        setError('Error retrieving the publications.');
      } finally {
        fetching.current = false;
        setLoading(false);
      }
    },
    [
      apiKey,
      groupId,
      filterSearch,
      filterItemType,
      sortType,
      sortDirection,
    ]
  );

  /* ------------- refetch list + header on filter change ----------- */
  useEffect(() => {
    setDisplayedItems([]);
    setCurrentPage(0);
    setHasMore(true);
    loadPublications(0);
    refreshTotalResults();
  }, [loadPublications, refreshTotalResults]);

  /* --------------------- infinite scroll -------------------------- */
  useEffect(() => {
    const onScroll = () => {
      if (fetching.current || !hasMore) return;
      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - SCROLL_THRESHOLD) {
        const nxt = currentPage + 1;
        setCurrentPage(nxt);
        loadPublications(nxt);
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [currentPage, hasMore, loadPublications]);

  /* ------------------- search-box debounce ------------------------ */
  const handleSearchKeyUp   = (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(
      () => setFilterSearch(e.target.value),
      DEBOUNCE_MS
    );
  };
  const handleSearchKeyPress = () => clearTimeout(debounceTimer);
  const handleSearchBlur     = (e) => setFilterSearch(e.target.value);

  /* -------------------------- render ------------------------------ */
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.counterRow}>
          Loaded &nbsp;
          <strong>{displayedItems.filter((i) => !i.placeholder).length}</strong><span>{" "}Publications</span>
          {totalItems !== null && (
            <>
              &nbsp;from&nbsp;<strong>{totalItems}</strong>
            </>
          )}
        </div>

        <form
          className={styles.filterForm}
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            placeholder="Search title, author, …"
            onBlur={handleSearchBlur}
            onKeyUp={handleSearchKeyUp}
            onKeyPress={handleSearchKeyPress}
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
            <option value="prePrint">Pre-print</option>
            <option value="document">Document</option>
            <option value="bookSection">Book Section</option>
          </select>
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="date">Published Date</option>
            <option value="dateAdded">Date Added</option>
            <option value="title">Title</option>
            <option value="creator">Creator</option>
            <option value="itemType">Item Type</option>
            <option value="publisher">Publisher</option>
          </select>
          <button
            type="button"
            onClick={() =>
              startTransition(() =>
                setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))
              )
            }
            className={clsx('button', styles.button, styles.buttonPrimary)}
            aria-label={`Sort direction ${sortDirection}`}
          >
            {sortDirection === 'asc' ? (
              <HiOutlineSortAscending size={25} className={styles.sortIcon} />
            ) : (
              <HiOutlineSortDescending size={25} className={styles.sortIcon} />
            )}
          </button>
        </form>

        {error && (
          <div className={styles.errorContainer}>
            <div className={styles.error}>{error}</div>
          </div>
        )}

        <div className={styles.publicationsContainer}>
          {!error &&
            displayedItems.map((item, idx) =>
              item.placeholder ? (
                <SkeletonCard key={`ph-${idx}`} />
              ) : (
                <PublicationCard
                  key={item.key || `pub-${idx}`}
                  publication={item}
                />
              )
            )}
        </div>

        {!loading &&
          displayedItems.filter((i) => !i.placeholder).length === 0 && (
            <p className={styles.emptyMessage}>No&nbsp;Publications&nbsp;Found</p>
          )}
      </div>
    </div>
  );
}
