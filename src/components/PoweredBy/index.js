import React from "react";
import clsx from "clsx";
import { useColorMode } from "@docusaurus/theme-common";
import GitHubStars from "./GithubStars";
import styles from "./styles.module.css";

export default function PoweredBy({ poweredByItems }) {
  const { colorMode } = useColorMode();

  return (
    <section className={clsx(styles.poweredBySection, "container", "margin-bottom--lg")}>
      <h1 className={styles.heading}>Powered By</h1>
      <div className={styles.cardContainer}>
        {poweredByItems.map((item, index) => (
          <a
            key={index}
            href={item.link}
            target="_blank"
            rel="noreferrer"
            className={styles.card}
          >
            <div className={styles.iconWrapper}>
              <img
                src={colorMode === "dark" ? item.darkIcon : item.lightIcon}
                alt={item.title}
                className={styles.icon}
              />
            </div>
            {item.repoUrl && <GitHubStars repoUrl={item.repoUrl} />}
            <p className={styles.cardDescription}>{item.description}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
