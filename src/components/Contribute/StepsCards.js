import React from 'react';
import clsx from 'clsx';
import styles from './stepsCardsStyles.module.css';
import { useColorMode } from '@docusaurus/theme-common';

const StepsCards = ({ header, steps, containerId }) => {
  const { colorMode } = useColorMode();

  return (
    <div id={containerId} tabIndex={-1}>
      <div className={styles.headerContainer}>
        <h2 className={styles.title}>{header}</h2>
      </div>
      <div className={styles.cardContainer}>
        {steps.map((step, index) => {
          const cardContent = (
            <div className={styles.card} key={index}>
              <div className={styles.cardImageContainer}>
                <img
                  src={colorMode === 'dark' ? step.imgSrcDark : step.imgSrcLight}
                  alt={step.imgAlt}
                  className={styles.cardImage}
                />
              </div>

              <div className={styles.cardContent}>
                <h4 className={styles.cardTitle}>{step.cardTitle}</h4>
                <p className={styles.cardDescription}>{step.cardDescription}</p>
              </div>
            </div>
          );

          if (step.link) {
            return (
              <a
                key={index}
                href={step.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.cardLink}
              >
                {cardContent}
              </a>
            );
          }
          return cardContent;
        })}
      </div>
    </div>
  );
};

export default StepsCards;