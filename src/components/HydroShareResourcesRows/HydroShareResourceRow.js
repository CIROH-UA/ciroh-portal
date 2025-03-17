import React from "react";
import { FaGithub } from "react-icons/fa";
import { MdInfo, MdDriveFileMove  } from "react-icons/md";
import { LiaExternalLinkSquareAltSolid } from "react-icons/lia";

import styles from "./styles.module.css";
import clsx from "clsx";

export default function HydroShareResourceRow({ resource, defaultImage }) {
  const {
    title = "Untitled",
    description,
    app_icon,
    home_page_url,
    source_code_url,
    help_page_url,
    resource_url,

  } = resource;

  return (
    <div className={clsx(styles.rowItem, "card")}>
      <div className={styles.imageWrapper}>
        {app_icon ? (
          <img src={app_icon} alt={title} className={styles.image} />
        ) : defaultImage ? (
          <img src={defaultImage} alt={title} className={styles.image} />
        ) :(
        <div className={clsx(styles.imagePlaceholder, styles.placeholder)}>
          </div>
        )
        }

        <div className={styles.hoverOverlay}>
          <h5 className={styles.overlayTitle}>{title}</h5>
          <div className={styles.overlayIcons}>
            {source_code_url && (
              <a href={source_code_url} target="_blank" rel="noreferrer" className={styles.iconLink} title="Source Code">
                <FaGithub size={24} />
              </a>
            )}
            {help_page_url && (
              <a href={help_page_url} target="_blank" rel="noreferrer" className={styles.iconLink} title="Help">
                <MdInfo size={24} />
              </a>
            )}
            {home_page_url && (
              <a href={home_page_url} target="_blank" rel="noreferrer" className={styles.iconLink} title="Website">
                <LiaExternalLinkSquareAltSolid size={24} />
              </a>
            )}
            {resource_url && (
              <a href={resource_url} target="_blank" rel="noreferrer" className={styles.iconLink} title="Resource Page">
                <MdDriveFileMove size={24} />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className={styles.textWrapper}>
        {title ? (
          <h1 className={styles.title}>{title}</h1>
        ) : (
          <h1 className={styles.titlePlaceholder}></h1>
        )}

        {description ? (
          <p className={styles.description}>{description}</p>
        ) : (
          <p className={styles.descriptionPlaceholder}></p>
        )}

        {/* <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p> */}
      </div>
    </div>
  );
}
