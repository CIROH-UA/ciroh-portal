
import clsx from 'clsx';
import styles from './styles.module.css';

function SkeletonPlaceholderMedia() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="skeleton-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--ifm-color-primary-lightest)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="var(--ifm-color-primary-lighter)" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" rx="32" fill="url(#skeleton-grad)" opacity="0.5" />
      <circle cx="100" cy="100" r="75" stroke="var(--ifm-color-primary-light)" strokeWidth="4" fill="none" opacity="0.4" />
      <circle cx="100" cy="100" r="55" stroke="var(--ifm-color-primary-lightest)" strokeWidth="3" fill="none" opacity="0.3" />
      <circle cx="100" cy="100" r="38" stroke="var(--ifm-color-primary)" strokeWidth="2" fill="none" opacity="0.25" />
    </svg>
  );
}

export function SkeletonPlaceholders({count = 6}) {
  return (

    <div className={styles.productSkeletonGrid}>
        {Array.from({ length: count }).map((_, index) => (
        <div key={`skeleton-${index}`} className={styles.productSkeletonCard}>
            <div className={styles.productSkeletonMedia}>
            <SkeletonPlaceholderMedia />
            </div>
            <div className={clsx(styles.productSkeletonLine, styles.productSkeletonLineWide)} />
            <div className={clsx(styles.productSkeletonLine, styles.productSkeletonLineNarrow)} />
            <div className={clsx(styles.productSkeletonLine, styles.productSkeletonLineWide)} />
        </div>
        ))}
    </div>
    );
}
