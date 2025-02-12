import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import styles from "./styles.module.css";

export default function TechBox({ items }) {
  const { colorMode } = useColorMode();

  return (
    <div className={styles.wrapper}>
        <div className={styles.devBox}>
        <h4 className={styles.heading}>
            CIROH Applications are powered by the&nbsp;
            <a href="https://www.tethysplatform.org/" className={styles.link}>
                Tethys Platform
            </a>
            &nbsp;
            and
            &nbsp;
            <a href="https://hydroshare.org/" className={styles.link}>
                HydroShare
            </a>
            &nbsp;
        </h4>
        <div className={styles.imagesContainer}>
            {items.map((item, index) => (
            <img
                key={index}
                src={colorMode === 'dark' ? item.darkIcon : item.lightIcon}
                alt={item.alt}
                className={styles.image}
            />
            ))}
        </div>
        </div>

    </div>

  );
}
