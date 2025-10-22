import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import clsx from 'clsx';
import styles from './styles.module.css';


export default function FundingSection({
  description,
  images, // an array of objects: { lightImage, darkImage }
  background = 'primary', // default to primary background
}) {
  const { colorMode } = useColorMode();

  // Choose the background class based on the background prop.
  const backgroundClass =
    background === 'secondary'
      ? styles.secondaryBackground
      : styles.primaryBackground;

  return (
    <div className={clsx(styles.wrapper, backgroundClass)}>
      <div className={styles.container}>
        <div className={styles.currentAppSection}>
          <div className={styles.headerContainer}>
            <h1 className={styles.title}>Our Partnership</h1>
            <h3 className={styles.description}>{description}</h3>

            {images && images.length > 0 && (
              <div className={styles.imagesContainer}>
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={colorMode === 'dark' ? img.darkImage : img.lightImage}
                    alt={`Funding image ${index + 1}`}
                    className={styles.sectionImage}
                  />
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
