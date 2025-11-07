import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MdArrowOutward, MdWaterDrop } from 'react-icons/md';
import { FaGithub } from "react-icons/fa";
import clsx from 'clsx';
import styles from './styles.module.css';

// Generate elegant SVG placeholder based on product type
function ElegantPlaceholder({ title, type }) {
  // Generate a color based on product type
  const getColorByType = (productType) => {
    const colors = {
      'Application': { primary: '#3b82f6', secondary: '#60a5fa' },
      'Analytics': { primary: '#8b5cf6', secondary: '#a78bfa' },
      'Distribution': { primary: '#06b6d4', secondary: '#22d3ee' },
      'Tool': { primary: '#10b981', secondary: '#34d399' },
      'Service': { primary: '#f59e0b', secondary: '#fbbf24' },
      'Visualization': { primary: '#ec4899', secondary: '#f472b6' },
      'Dashboard': { primary: '#6366f1', secondary: '#818cf8' },
      'Dataset': { primary: '#14b8a6', secondary: '#2dd4bf' },
      'Notebook': { primary: '#f97316', secondary: '#fb923c' },
    };
    return colors[productType] || { primary: '#6366f1', secondary: '#818cf8' };
  };

  const colors = getColorByType(type);
  const initials = title
    .split(' ')
    .map(word => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.productCardMediaSVG}
    >
      <defs>
        <linearGradient id={`grad-${title}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: colors.primary, stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: colors.secondary, stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Background circle */}
      <circle cx="100" cy="100" r="80" fill={`url(#grad-${title})`} opacity="0.15" />

      {/* Decorative shapes */}
      <circle cx="100" cy="100" r="60" fill="none" stroke={colors.primary} strokeWidth="2" opacity="0.2" />
      <circle cx="100" cy="100" r="45" fill="none" stroke={colors.secondary} strokeWidth="1.5" opacity="0.3" />

      {/* Center text */}
      <text
        x="100"
        y="110"
        textAnchor="middle"
        fontSize="48"
        fontWeight="700"
        fill={colors.primary}
        opacity="0.9"
      >
        {initials}
      </text>
    </svg>
  );
}

const INITIAL_BATCH_SIZE = 12;
const BATCH_INCREMENT = 8;

export default function ProductTilesGrid({
  products,
  showDocsAction = false,
  fallbackDocsLink,
  groupId,
  onDocsNavigate,
}) {
  if (!products || products.length === 0) {
    return (
      <div className={styles.placeholderPanel}>
        <h3>Products coming soon</h3>
        <p>We are still cataloging items for this product group. Check back shortly.</p>
      </div>
    );
  }

  const [visibleCount, setVisibleCount] = useState(
    Math.min(INITIAL_BATCH_SIZE, products.length),
  );
  const sentinelRef = useRef(null);

  useEffect(() => {
    setVisibleCount(Math.min(INITIAL_BATCH_SIZE, products.length));
  }, [products.length]);

  useEffect(() => {
    if (visibleCount >= products.length) {
      return undefined;
    }

    const sentinel = sentinelRef.current;
    if (!sentinel) {
      return undefined;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleCount(current =>
            Math.min(products.length, current + BATCH_INCREMENT),
          );
        }
      });
    });

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [products.length, visibleCount]);

  const visibleProducts = useMemo(
    () => products.slice(0, visibleCount),
    [products, visibleCount],
  );

  const gridClassName = clsx(
    styles.productGrid,
    products.length === 1 && styles.productGridSingle,
  );

  return (
    <div className={gridClassName}>
      {visibleProducts.map(product => {
        const docsPath = product.docsLink || fallbackDocsLink;
        const owningGroupId = product.groupId || groupId;
        const hasDocsLink = Boolean(showDocsAction && docsPath && onDocsNavigate);
        const hasCodeLink = Boolean(showDocsAction && product.codeLink);
        const hasHydroLink = Boolean(showDocsAction && product.resourceUrl);
        const subjects = Array.isArray(product.subjects) ? product.subjects : [];
        const filteredSubjects = subjects
          .filter(subject => {
            const normalized = subject?.toLowerCase();
            return normalized && !['nwm_portal_product', 'nwm_portal_app', 'nextgen_noaa'].includes(normalized);
          })
          .map(subject => subject.replace(/_/g, ' '));

        const handleDocsClick = () => {
          if (onDocsNavigate && docsPath) {
            onDocsNavigate({
              product,
              docsPath,
              groupId: owningGroupId,
            });
          }
        };

        const handleCardClick = () => {
          if (product.pageUrl) {
            window.open(product.pageUrl, '_blank', 'noopener,noreferrer');
          }
        };

        const stopPropagation = event => {
          event.stopPropagation();
        };

        return (
          <article
            key={product.id}
            className={clsx(
              styles.productCard,
              product.pageUrl && styles.productCardInteractive,
            )}
            onClick={handleCardClick}
          >
            <div className={styles.productCardMedia}>
              <ElegantPlaceholder title={product.title} type={product.type} />
            </div>
            <div className={styles.productCardBody}>
              {filteredSubjects.length > 0 ? (
                <div className={styles.productSubjects}>
                  {filteredSubjects.slice(0, 4).map(subject => (
                    <span key={subject} className={styles.productSubjectChip}>
                      {subject}
                    </span>
                  ))}
                </div>
              ) : null}
              <h4 className={styles.productTitle}>{product.title}</h4>
              {product.summary && (
                <p className={styles.productSummary}>{product.summary}</p>
              )}
            </div>
            {showDocsAction && (hasDocsLink || hasCodeLink) && (
              <div className={styles.productCardCTA}>
                {hasDocsLink ? (
                  <button
                    type="button"
                    className={styles.productCardCTAButton}
                    onClick={event => {
                      stopPropagation(event);
                      handleDocsClick();
                    }}
                    aria-label={`Open docs for ${product.title}`}
                  >
                    <span>Docs</span>
                    <MdArrowOutward aria-hidden="true" />
                  </button>
                ) : null}
                {hasHydroLink ? (
                  <button
                    type="button"
                    className={styles.productCardCTAButton}
                    onClick={event => {
                      stopPropagation(event);
                      window.open(product.resourceUrl, '_blank', 'noopener,noreferrer');
                    }}
                    aria-label={`Open HydroShare resource for ${product.title}`}
                  >
                    <span>HydroShare</span>
                    <MdWaterDrop aria-hidden="true" />
                  </button>
                ) : null}
                {hasCodeLink ? (
                  <button
                    type="button"
                    className={styles.productCardCTAButton}
                    onClick={event => {
                      stopPropagation(event);
                      window.open(product.codeLink, '_blank', 'noopener,noreferrer');
                    }}
                    aria-label={`Open code for ${product.title}`}
                  >
                    <span>Code</span>
                    <FaGithub aria-hidden ="true" />
                  </button>
                ) : null}
              </div>
            )}
          </article>
        );
      })}
      {visibleCount < products.length ? (
        <div ref={sentinelRef} className={styles.loadMoreSentinel} aria-hidden="true" />
      ) : null}
    </div>
  );
}
