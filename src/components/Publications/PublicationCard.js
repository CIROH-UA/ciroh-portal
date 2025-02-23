import React from 'react';
import clsx from 'clsx';
import styles from './PublicationCard.module.css';
import { useColorMode } from '@docusaurus/theme-common';

// Helper function to handle "MM/YYYY" dates
function parseDateForDisplay(dateStr) {
  if (!dateStr) return null;
  // Check for "M/YYYY" or "MM/YYYY"
  const match = dateStr.match(/^(\d{1,2})\/(\d{4})$/);
  if (match) {
    const month = parseInt(match[1], 10);
    const year = parseInt(match[2], 10);
    return new Date(year, month - 1, 1);
  }
  return new Date(dateStr);
}


function addSpacesOnCaseTransition(str) {
    return str
      // Add space between lowercase and uppercase
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      // Add space between uppercase and lowercase (for consecutive capitals)
      .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
  }
  


export default function PublicationCard({ publication, index }) {
  const { colorMode } = useColorMode();

  if (!publication) return null;

  const {
    title = 'Untitled Publication',
    creators = [],
    date,
    url,
    itemType,
    publicationTitle,
    DOI,
  } = publication;

  // Handle creators
  const authorList = creators.length > 0
    ? creators.map((creator, i) => (
        <span key={i}>
          {creator.lastName || creator.name || 'Anonymous'}
          {i < creators.length - 1 ? ' • ' : ''}
        </span>
      ))
    : 'No authors listed';

  // Format the date
  const pubDate = date
    ? parseDateForDisplay(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  // Card content component
  const CardContent = () => (
    <div
      className={clsx(
        styles.publicationCard,
        'card',
        colorMode === 'dark' && styles.cardDark
      )}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* 1. Item Type */}
      {itemType && <div className={styles.itemType}>{addSpacesOnCaseTransition(itemType)}</div>}

      {/* 2. Published on Date (below item type) */}
      {pubDate && <div className={styles.publishDate}>Published on {pubDate}</div>}

      {/* 3. Title */}
      <h3 className={styles.cardTitle}>{title}</h3>

      {/* 4. Authors */}
      <div className={styles.authors}>{authorList}</div>

      {/* 5. Journal */}
      {publicationTitle && <div className={styles.journal}>{publicationTitle}</div>}

      {/* 6. DOI */}
      {DOI && (
        <div className={styles.doi}>
          doi{' '}
          <a
            href={`https://doi.org/${DOI}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {DOI}
          </a>
        </div>
      )}
    </div>
  );

  // If there's a URL, wrap the card in a link
  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.cardLink}
      >
        <CardContent />
      </a>
    );
  }

  return <CardContent />;
}
