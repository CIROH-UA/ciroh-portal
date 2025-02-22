import React from 'react';
import clsx from 'clsx';
import styles from './PublicationCard.module.css';
import { useColorMode } from '@docusaurus/theme-common';

export default function PublicationCard({ publication }) {
  const { colorMode } = useColorMode();

  if (!publication) return null;

  const {
    title = 'Untitled Publication',
    creators = [],
    date,
    url,
    itemType,
  } = publication;

  // Safely handle creator data
  const authorList = creators.length > 0
    ? creators.map((creator, index) => (
        <span key={index}>
          {creator.lastName || creator.name || 'Anonymous'}
          {index < creators.length - 1 ? ', ' : ''}
        </span>
      ))
    : 'No authors listed';

  // Format date
  const pubDate = date
    ? new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className={clsx(
      styles.publicationCard,
      'card',
      colorMode === 'dark' && styles.cardDark
    )}>
      <div className={clsx(styles.cardHeader, 'card__header')}>
        <div className={styles.itemType}>{itemType}</div>
        <h3 className={styles.cardTitle}>{title}</h3>
      </div>
      
      <div className={clsx(styles.cardBody, 'card__body')}>
        <div className={styles.authors}>{authorList}</div>
        {pubDate && <div className={styles.date}>{pubDate}</div>}
      </div>

      {url && (
        <div className={clsx(styles.cardFooter, 'card__footer')}>
          <a
            href={url}
            className="button button--sm button--secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read Paper
          </a>
        </div>
      )}
    </div>
  );
}