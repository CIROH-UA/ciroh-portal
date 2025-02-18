import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import clsx from 'clsx';
import styles from './styles.module.css';


export default function GeneralHomeSection({
  title,
  description,
  lightImage,
  darkImage,
  background = 'primary', // default to primary background
}) {
  const { colorMode } = useColorMode();
  const Image = colorMode === 'dark' ? darkImage : lightImage;

  // Choose the CSS class based on the background prop
  const backgroundClass =
    background === 'secondary'
      ? styles.secondaryBackground
      : styles.primaryBackground;

  return (
    <div className={clsx(styles.wrapper, backgroundClass)}>
      <div className={styles.container}>
        <div className={styles.currentAppSection}>
          <div className={styles.headerContainer}>
            <h1 className={styles.title}>{title}</h1>
            <h3 className={styles.description}>{description}</h3>
            <img
              src={Image}
              className={styles.sectionImage}
              alt="CIROH Interface"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
