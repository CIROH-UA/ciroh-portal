import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  startTransition,
} from 'react';
import Zotero from 'zotero-api-client';
import PublicationCard   from './PublicationCard';
import SkeletonCard      from './SkeletonCard';
import styles            from './Publications.module.css';
import clsx              from 'clsx';
import {
  HiOutlineSortDescending,
  HiOutlineSortAscending,
} from 'react-icons/hi';

const PAGE_SIZE        = 50;
const SCROLL_THRESHOLD = 200;
let   debounceTimer    = null;
const DEBOUNCE_MS      = 1_000;

/* ───────────────── helper: read “Total-Results” header ───────────────── */
async function fetchTotal(groupId, apiKey, params) {
  const url = new URL(`https://api.zotero.org/groups/${groupId}/items/top`);
  Object.entries({ ...params, limit: 1 }).forEach(([k, v]) =>
    url.searchParams.append(k, v),
  );
  const resp = await fetch(url.href, { headers: { 'Zotero-API-Key': apiKey } });
  if (!resp.ok) return null;
  const hdr = resp.headers.get('Total-Results');
  return hdr ? Number(hdr) : null;
}

/* ──────────────────────────────────────────────────────────────────────── */
export default function Publications({ apiKey, groupId }) {
  /* ---------------- state ---------------- */
  const [displayedItems, setDisplayedItems] = useState([]);
  const [currentPage,    setCurrentPage]    = useState(0);
  const [hasMore,        setHasMore]        = useState(true);
  const [loading,        setLoading]        = useState(false);
  const [error,          setError]          = useState(null);
  const fetching = useRef(false);

  const [totalItems, setTotalItems] = useState(null);

  const [searchInput,   setSearchInput]   = useState(''); // text in box
  const [filterSearch,  setFilterSearch]  = useState(''); // committed query
  const [filterItemType, setFilterItemType] = useState('all');
  const [sortType,       setSortType]       = useState('date');
  const [sortDirection,  setSortDirection]  = useState('desc');

  /* ------------- read header once per filter change ------------- */
  const refreshTotal = useCallback(async () => {
    const params = {
      sort: sortType,
      direction: sortDirection,
      ...(filterSearch     ? { q: filterSearch }      : {}),
      ...(filterItemType !== 'all' ? { itemType: filterItemType } : {}),
    };
    try {
      setTotalItems(await fetchTotal(groupId, apiKey, params));
    } catch (e) {
      console.error('Total-Results header error:', e);
      setTotalItems(null);
    }
  }, [groupId, apiKey, filterSearch, filterItemType, sortType, sortDirection]);

  /* ---------------- paginator loader ---------------- */
  const loadPublications = useCallback(
    async (page) => {
      if (fetching.current) return;
      fetching.current = true;

      try {
        setLoading(true);
        setError(null);

        // skeletons
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
          qmode: 'titleCreatorYear',
          ...(filterSearch     ? { q: filterSearch }      : {}),
          ...(filterItemType !== 'all' ? { itemType: filterItemType } : {}),
        };

        const client  = new Zotero(apiKey);
        const result  = await client
          .library('group', groupId)
          .items()
          .top()
          .get(query);

        const newItems = result.getData();
        console.log('Fetched items:', newItems);
        setHasMore(newItems.length === PAGE_SIZE);

        setDisplayedItems((prev) => {
          const upd   = [...prev];
          const first = upd.findIndex((i) => i.placeholder);
          newItems.forEach((item, i) => (upd[first + i] = item));
          if (newItems.length < PAGE_SIZE) {
            upd.splice(first + newItems.length, PAGE_SIZE - newItems.length);
          }
          return upd;
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
    ],
  );

  /* ------------- (re)fetch when filters change ------------- */
  const resetAndLoad = useCallback(() => {
    setDisplayedItems([]);
    setCurrentPage(0);
    setHasMore(true);
    loadPublications(0);
    refreshTotal();
  }, [loadPublications, refreshTotal]);

  useEffect(resetAndLoad, [resetAndLoad]);

  /* ---------------- infinite scroll ---------------- */
  useEffect(() => {
    const onScroll = () => {
      if (fetching.current || !hasMore) return;
      const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - SCROLL_THRESHOLD) {
        const next = currentPage + 1;
        setCurrentPage(next);
        loadPublications(next);
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [currentPage, hasMore, loadPublications]);

  /* ---------------- search helpers ---------------- */
  const commitSearch = (query) => {
    clearTimeout(debounceTimer);
    setFilterSearch(query.trim());
  };

  /* key-by-key debounce */
  const handleKeyUp   = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => commitSearch(searchInput), DEBOUNCE_MS);
  };

  /* clear timer while key is held */
  const handleKeyPress = () => clearTimeout(debounceTimer);

  /* run search immediately on Enter */
  const handleKeyDown  = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();          // stop form submission scroll jump
      commitSearch(searchInput);
    }
  };

  /* lose focus → commit */
  const handleBlur = () => commitSearch(searchInput);

  /* -------------------- render -------------------- */
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* counter row ------------------------------------------------ */}
        <div className={styles.counterRow}>
          Loaded&nbsp;
          <strong>{displayedItems.filter((i) => !i.placeholder).length}</strong>
          &nbsp;publications
          {totalItems !== null && (
            <> of <strong>{totalItems}</strong></>
          )}
        </div>

        {/* filter + sort toolbar ------------------------------------- */}
        <form
          className={styles.filterForm}
          onSubmit={(e) => {
            e.preventDefault();
            commitSearch(searchInput);
          }}
        >
          <input
            name="search"
            type="text"
            placeholder="Search by Title, Author, and Year"
            className={styles.searchInput}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyUp={handleKeyUp}
            onKeyPress={handleKeyPress}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
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
                setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc')),
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

        {/* error banner ---------------------------------------------- */}
        {error && (
          <div className={styles.errorContainer}>
            <div className={styles.error}>{error}</div>
          </div>
        )}

        {/* grid ------------------------------------------------------- */}
        <div className={styles.publicationsContainer}>
          {!error &&
            displayedItems.map((item, i) =>
              item.placeholder ? (
                <SkeletonCard key={`ph-${i}`} />
              ) : (
                <PublicationCard key={item.key || `pub-${i}`} publication={item} />
              ),
            )}
        </div>

        {/* empty state ----------------------------------------------- */}
        {!loading &&
          displayedItems.filter((i) => !i.placeholder).length === 0 && (
            <p className={styles.emptyMessage}>
              No&nbsp;Publications&nbsp;Found
            </p>
          )}
      </div>
    </div>
  );
}
