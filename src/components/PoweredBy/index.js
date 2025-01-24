import React from "react";
import clsx from "clsx";
import { useColorMode } from "@docusaurus/theme-common"; // Use this instead of useThemeContext
import styles from "./styles.module.css";

export default function PoweredBy({ poweredByItems }) {
  const { colorMode } = useColorMode(); // Get the current theme (light or dark)

  return (
    <section className={clsx(styles.poweredBySection)}>
      <h1 className={styles.heading}>Powered By</h1>
      <div className={styles.cardContainer}>
        {poweredByItems.map((item, index) => (
          <a
            href={item.link} // Add link to make the card clickable
            target="_blank"
            rel="noreferrer"
            className={styles.card} // Use card styles for the link
            key={index}
          >
            <div className={styles.iconWrapper}>
              <img
                src={colorMode === "dark" ? item.darkIcon : item.lightIcon}
                alt={item.title}
                className={styles.icon}
              />
            </div>
            <p className={styles.cardDescription}>{item.description}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
