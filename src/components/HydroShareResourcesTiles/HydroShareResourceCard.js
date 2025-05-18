import React from "react";
import { FaGithub } from "react-icons/fa";
import { MdInfo, MdDriveFileMove } from "react-icons/md";
import { LiaExternalLinkSquareAltSolid } from "react-icons/lia";
import { LuLayers3 } from "react-icons/lu";

import styles from "./styles.module.css";
import clsx from 'clsx';

export default function HydroShareResourceCard({ resource, defaultImage }) {
  const {
    title = "Untitled",
    thumbnail_url,
    page_url,
    resource_url,
  } = resource;

  return (
    <div className={styles.gridItem}>
      <div className={styles.imageWrapper}>
        {/* If no app_icon yet, you might render a fallback image or a placeholder */}
        {/* {thumbnail_url ? (
          <img src={thumbnail_url} alt={title} className={styles.image} />
        ) : (
          // <div className={clsx(styles.imagePlaceholder, styles.placeholder)}>
          <div className={clsx(styles.imagePlaceholder)}>
            <div className={styles.iconPlaceholder}>
              <LuLayers3 size={50}/>
            </div>
          </div>
        )} */}


        {thumbnail_url ? (
          <img src={thumbnail_url} alt={title} className={styles.image} />
        ) : defaultImage ? (
          <img src={defaultImage} alt={title} className={styles.image} />
        ) :(
          <div className={clsx(styles.imagePlaceholder)}>
            <div className={styles.iconPlaceholder}>
              <LuLayers3 size={50}/>
            </div>
          </div>

        // <div className={clsx(styles.imagePlaceholder, styles.placeholder)}>
        //   </div>
        )
        }

        <div className={styles.hoverOverlay}>
          {/* Title */}
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
