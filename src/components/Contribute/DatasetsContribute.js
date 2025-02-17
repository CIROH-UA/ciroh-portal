import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './styles.module.css';
import { contributeDatasetsCards } from './utils';

import HydroShareMock from './HydroShareMock';

export default function DatasetsTabContributeContent({ description }) {
  const { colorMode } = useColorMode();
  const [card1, card2, card3] = contributeDatasetsCards;

  return (
        <>
          
          <div className={styles.currentAppSection}>
            <div className={styles.headerContainer}>
                <h3 className={styles.description2}>
                  {description}
                </h3>
            </div>
            <div className={styles.actionButtons}>
              <a href="https://docs.ciroh.org/docs/products/Portal/research-portal/#data">
                <button className={styles.install}>Add your Data</button>
              </a>
              <a href="#add-data-steps">
                <button className={styles.quick}>
                {/* <button className={styles.quick}> */}
                 Quick Start
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={styles.quickIcon}
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </a>
            </div>

            <HydroShareMock
                isAppResource={false}
                title="NWM Next Generation Forecast Data"
                keywords="ciroh_portal_data"
            />
          </div>

          <hr className={styles.sectionDivider} />


        <div id="add-data-steps" tabIndex={-1}>
          <div className={styles.headerContainer}>
            <h2 className={styles.title}>Create a Resource on 3 Easy Steps</h2>
          </div>

          <div className={styles.cardContainer}>
              <div className={styles.card}>
                <img
                  src={colorMode === 'dark' ? card1.imgSrcDark : card1.imgSrcLight}
                  alt={card1.imgAlt}
                  className={styles.cardImage}
                />
                <div className={styles.cardContent}>
                  <h4 className={styles.cardTitle}>{card1.cardTitle}</h4>
                  <p className={styles.cardDescription}>{card1.cardDescription}</p>
                </div>
              </div>
              <div className={styles.card}>
                <img
                  src={colorMode === 'dark' ? card2.imgSrcDark : card2.imgSrcLight}
                  alt={card2.imgAlt}
                  className={styles.cardImage}
                />
                <div className={styles.cardContent}>
                  <h4 className={styles.cardTitle}>{card2.cardTitle}</h4>
                  <p className={styles.cardDescription}>Add <code>nwm_portal_app</code> keyword to your App Connector Resource to make it discoverable.</p>
                </div>
              </div>
              <div className={styles.card}>
                <img
                  src={colorMode === 'dark' ? card3.imgSrcDark : card3.imgSrcLight}
                  alt={card3.imgAlt}
                  className={styles.cardImage}
                />
                <div className={styles.cardContent}>
                  <h4 className={styles.cardTitle}>{card3.cardTitle}</h4>
                  <p className={styles.cardDescription}>{card3.cardDescription}</p>
                </div>
              </div>
          </div>
        </div>

      <div className={styles.actionButtons}>
          <a href="https://help.hydroshare.org/introduction-to-hydroshare/getting-started/">
                <button className={styles.quick}>
                  Getting Started
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={styles.quickIcon}
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </a>
        </div>

        </>

  );
}
