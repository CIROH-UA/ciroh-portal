import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';


export default function HeroSection({
  title,
  description,
  background = 'primary',
  children,
}) {
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
            <h1 className={styles.title}>{title}</h1>
            <h3 className={styles.description}>{description}</h3>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
