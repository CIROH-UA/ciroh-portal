import React from "react";
import clsx from "clsx";
import { useColorMode } from "@docusaurus/theme-common";
import GitHubStars from "./GitHubStars";
import styles from "./styles.module.css";

export default function PoweredBy({ poweredByItems }) {
  const { colorMode } = useColorMode();

  return (
    <section className={clsx(styles.fullWidthBg)}>
      <div className={clsx("container", "margin-bottom--lg")}>
        <h1 className={styles.heading}>Powered By</h1>
        <div className={styles.cardContainer}>
          {poweredByItems.map((item, index) => (
            <div
              key={index}

              className={styles.card}
            >
              <div className={styles.iconWrapper}>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={colorMode === "dark" ? item.darkIcon : item.lightIcon}
                    alt={item.title}
                    className={styles.icon}
                  />
                </a>

              </div>
              {item.repoUrl && <GitHubStars repoUrl={item.repoUrl} />}
              <p className={styles.cardDescription}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
