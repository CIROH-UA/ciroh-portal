import React from 'react';
import clsx from 'clsx';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './styles.module.css';
import { contributeAppCards } from './utils';
import AppIconUrl from '@site/static/img/tethysdash_icon.png';
// This is your "example app" resource card
import HydroShareMock from './HydroShareMock';

export default function AppsTabContributeContent({ title, description }) {
  const { colorMode } = useColorMode();
  // Destructure your card data
  const [card1, card2, card3, card4, card5] = contributeAppCards;

  return (
    <>
      {/* Section: Existing Example App */}
      <div className={styles.currentAppSection}>
      <div className={styles.headerContainer}>
            <h1 className={styles.title}>{title}</h1>
            <h3 className={styles.description}>{description}</h3>
          </div>
        <HydroShareMock 
            home_url="https://github.com/FIRO-Tethys/aquainsight"
            iconUrl={AppIconUrl}
            keywords="nwm_portal_app"
        />
      </div>

      <hr className={styles.sectionDivider} />

      {/* Section: Steps to Create Your Own App */}
      <div className={styles.headerContainer}>
        <h2 className={styles.title}>Add Your Own App in 5 Easy Steps</h2>
        <h3 className={styles.description}>
        Create a new App Connector Resource,
        add the required metadata, while adding the <code>nwm_portal_app</code> keyword to make it discoverable
        </h3>
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

      {/* Optional final CTA */}
      <div className={styles.ctaContainer}>
        <a href="/docs/create-app" className="button button--primary button--lg">
          Create App Now
        </a>
      </div>
    </>
  );
}
