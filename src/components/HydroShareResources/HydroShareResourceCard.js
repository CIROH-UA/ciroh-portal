import React from "react";
import { FaGithub, FaExternalLinkSquareAlt } from "react-icons/fa";
import { MdInfo, MdDriveFileMove } from "react-icons/md";
import { useColorMode } from "@docusaurus/theme-common"; // Hook to detect theme
import styles from "./styles.module.css";
import { LiaExternalLinkSquareAltSolid } from "react-icons/lia";

export default function HydroShareResourceCard({ resource }) {
  const { colorMode } = useColorMode(); // Get the current theme

  const {
    title,
    app_icon,
    home_page_url,
    source_code_url,
    help_page_url,
    resource_url,
  } = resource;

  return (
    <div className={styles.gridItem}>
      <div className={styles.imageWrapper}>
        <img src={app_icon} alt={title} className={styles.image} />

        {/* Hover overlay */}
        <div className={styles.hoverOverlay}>
          {/* Title */}
          <h5
            className={styles.overlayTitle}
            // style={{ color: colorMode === "dark" ? "#fff" : "#fff" }} // Adjust title color
          >
            {title}
          </h5>

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
                <LiaExternalLinkSquareAltSolid  size={30} />
              </a>
            )}
            {resource_url && (
              <a
                href={resource_url}
                target="_blank"
                rel="noreferrer"
                className={styles.iconLink}
                title="HydroShare"
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
