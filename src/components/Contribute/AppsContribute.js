import React from 'react';
import clsx from 'clsx';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './styles.module.css';
import { contributeAppCards } from './utils';
import AppIconUrl from '@site/static/img/tethysdash_icon.png';
// This is your "example app" resource card
import HydroShareMock from './HydroShareMock';

export default function AppsTabContributeContent({ description }) {
  const { colorMode } = useColorMode();
  // Destructure your card data
  const [card1, card2, card3, card4, card5] = contributeAppCards;

  return (
    <>
      {/* Section: Existing Example App */}
      <div className={styles.currentAppSection}>
        <div className={styles.headerContainer}>
          <h3 className={styles.description2}>
             {description}
          </h3>
        </div>
        
        <div className={styles.actionButtons}>
              <a href="https://docs.ciroh.org/docs/products/Portal/research-portal/#applications">
                <button className={styles.install}>Add your App</button>
              </a>
              <a href="https://help.hydroshare.org/introduction-to-hydroshare/getting-started/">
                <button className={styles.quick}>
                {/* <button className={styles.quick}> */}
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

        <HydroShareMock
            isAppResource={true}
            title="TethysDash"
            home_url="https://github.com/FIRO-Tethys/aquainsight"
            iconUrl={AppIconUrl}
            keywords="nwm_portal_app"
        />
      <div className={styles.headerContainer}>
        <h2 className={styles.title}>Create an App Resource on 5 Easy Steps</h2>
      </div>
        <div className={styles.cardContainer}>
        {/* Step Card 1 */}
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

        {/* Step Card 2 */}
        <div className={styles.card}>
          <img
            src={colorMode === 'dark' ? card2.imgSrcDark : card2.imgSrcLight}
            alt={card2.imgAlt}
            className={styles.cardImage}
          />
          <div className={styles.cardContent}>
            <h4 className={styles.cardTitle}>{card2.cardTitle}</h4>
            <p className={styles.cardDescription}>
              Add <code>nwm_portal_app</code> keyword to your App Connector Resource to make it discoverable.
            </p>
          </div>
        </div>

        {/* Step Card 3 */}
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

        {/* Step Card 4 */}
        <div className={styles.card}>
          <img
            src={colorMode === 'dark' ? card4.imgSrcDark : card4.imgSrcLight}
            alt={card4.imgAlt}
            className={styles.cardImage}
          />
          <div className={styles.cardContent}>
            <h4 className={styles.cardTitle}>{card4.cardTitle}</h4>
            <p className={styles.cardDescription}>
              Add <code>nwm_portal_app</code> keyword to your App Connector Resource to make it discoverable.
            </p>
          </div>
        </div>

        {/* Step Card 5 */}
        <div className={styles.card}>
          <img
            src={colorMode === 'dark' ? card5.imgSrcDark : card5.imgSrcLight}
            alt={card5.imgAlt}
            className={styles.cardImage}
          />
          <div className={styles.cardContent}>
            <h4 className={styles.cardTitle}>{card5.cardTitle}</h4>
            <p className={styles.cardDescription}>
              Add <code>nwm_portal_app</code> keyword to your App Connector Resource to make it discoverable.
            </p>
          </div>
        </div>
        
        </div>


      </div>

      <hr className={styles.sectionDivider} />

      <div className={styles.headerContainer}>
          <h3 className={styles.description2}>
              <div>
                💧 <strong>Thinking about an App? </strong> Develop applications using our <a href="https://www.tethysplatform.org/" target="_blank" rel="noopener">Tethys Platform</a> toolkit
              </div>
          </h3>
        </div>

      <div className={styles.actionButtons}>
            <a href="/develop">
                <button className={styles.install}>
                  Develop an App
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
              <a href="https://docs.tethysplatform.org/en/stable/index.html">
                <button className={styles.quick}>
                {/* <button className={styles.quick}> */}
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
