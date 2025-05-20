import React from 'react';
import Link from '@docusaurus/Link';
import { MdDriveFileMove } from 'react-icons/md';
import { LiaExternalLinkSquareAltSolid } from 'react-icons/lia';

import clsx from 'clsx';
import styles from './styles.module.css';

/**
 * A single HydroShare resource “card”.
 *  • Wrapper <div> gets id={resource_id}  →  target for “#hash” links
 *  • Title rendered as <Link to={`#id`}>   →  updates the URL & scrolls
 */
export default function HydroShareResourceRow({ resource, defaultImage }) {
  const {
    resource_id,
    title        = 'Untitled',
    description,
    thumbnail_url,
    page_url,
    resource_url,
  } = resource;

  return (
    <div id={resource_id} className={clsx(styles.rowItem, 'card')}>
      {/* ───── thumbnail & overlay ───── */}
      <div className={styles.imageWrapper}>
        {thumbnail_url ? (
          <img src={thumbnail_url} alt={title} className={styles.image} />
        ) : defaultImage ? (
          <img src={defaultImage} alt={title} className={styles.image} />
        ) : (
          <div className={clsx(styles.imagePlaceholder, styles.placeholder)} />
        )}

        <div className={styles.hoverOverlay}>
          <h5 className={styles.overlayTitle}>{title}</h5>
          <div className={styles.overlayIcons}>
            {page_url && (
              <a
                href={page_url}
                target="_blank"
                rel="noreferrer"
                className={styles.iconLink}
                title="Website"
              >
                <LiaExternalLinkSquareAltSolid size={24} />
              </a>
            )}
            {resource_url && (
              <a
                href={resource_url}
                target="_blank"
                rel="noreferrer"
                className={styles.iconLink}
                title="Resource Page"
              >
                <MdDriveFileMove size={24} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ───── text block ───── */}
      <div className={styles.textWrapper}>
        {title ? (
          <h1 className={styles.title}>
            {/* router-aware hash link */}
            <Link to={`#${resource_id}`} className={styles.titleLink}>
              {title}
            </Link>
          </h1>
        ) : (
          <h1 className={styles.titlePlaceholder} />
        )}

        {description ? (
          <p className={styles.description}>{description}</p>
        ) : (
          <p className={styles.descriptionPlaceholder} />
        )}
      </div>
    </div>
  );
}
