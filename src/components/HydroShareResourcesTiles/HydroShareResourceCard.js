import React from "react";
import { FaGithub } from "react-icons/fa";
import { MdInfo, MdDriveFileMove } from "react-icons/md";
import { LiaExternalLinkSquareAltSolid } from "react-icons/lia";
import { LuLayers3 } from "react-icons/lu";

import styles from "./styles.module.css";
import clsx from 'clsx';

export default function HydroShareResourceCard({ resource }) {
  const {
    title = "Untitled",
    app_icon,
    home_page_url,
    source_code_url,
    help_page_url,
    resource_url,
  } = resource;

  return (
    <div className={styles.gridItem}>
      <div className={styles.imageWrapper}>
        {/* If no app_icon yet, you might render a fallback image or a placeholder */}
        {app_icon ? (
          <img src={app_icon} alt={title} className={styles.image} />
        ) : (
          <div className={clsx(styles.imagePlaceholder, styles.placeholder)}>
            <div className={styles.iconPlaceholder}>
              <LuLayers3 size={50}/>
            </div>

          </div>
        )}

        <div className={styles.hoverOverlay}>
          {/* Title */}
          <h5 className={styles.overlayTitle}>{title}</h5>

          {/* Icons */}
          <div className={styles.overlayIcons}>
            {source_code_url && (
              <a
                href={source_code_url}
                target="_blank"
                rel="noreferrer"
                className={styles.iconLink}
                title="Source Code"
              >
                <FaGithub size={30} />
              </a>
            )}
            {help_page_url && (
              <a
                href={help_page_url}
                target="_blank"
                rel="noreferrer"
                className={styles.iconLink}
                title="Help"
              >
                <MdInfo size={30} />
              </a>
            )}
            {home_page_url && (
              <a
                href={home_page_url}
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
