import React from 'react';
import Link from '@docusaurus/Link';
import { MdDriveFileMove } from 'react-icons/md';
import { LiaExternalLinkSquareAltSolid } from 'react-icons/lia';
import { LuLayers3 } from 'react-icons/lu';

import clsx from 'clsx';
import styles from './styles.module.css';

/**
 * Small square/rectangular “tile” card.
 *  • Outer div gets id={resource_id}        → target for #hash
 *  • Overlay title is a <Link to={`#id`}>   → clicking updates URL & scrolls
 */
export default function HydroShareResourceCard({ resource, defaultImage }) {
  const {
    resource_id,
    title        = 'Untitled',
    thumbnail_url,
    page_url,
    resource_url,
  } = resource;

  return (
    <div id={resource_id} className={styles.gridItem}>
      <div className={styles.imageWrapper}>
        {thumbnail_url ? (
          <img src={thumbnail_url} alt={title} className={styles.image} />
        ) : defaultImage ? (
          <img src={defaultImage} alt={title} className={styles.image} />
        ) : (
          <div className={styles.imagePlaceholder}>
            <div className={styles.iconPlaceholder}>
              <LuLayers3 size={50} />
            </div>
          </div>
        )}

        {/* ───── hover overlay ───── */}
        <div className={styles.hoverOverlay}>
          <h5 className={styles.overlayTitle}>
            <Link to={`#${resource_id}`} className={styles.titleLink}>
              {title}
            </Link>
          </h5>

          <div className={styles.overlayIcons}>
            {page_url && (
              <a
                href={page_url}
                target="_blank"
                rel="noreferrer"
                className={styles.iconLink}
                title="Website"
              >
                <LiaExternalLinkSquareAltSolid size={30} />
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
                <MdDriveFileMove size={30} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
