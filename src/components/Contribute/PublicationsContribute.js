import React from 'react';
import clsx from 'clsx';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './styles.module.css';
import { contributePublicationsCards } from './utils';
import { FaSync, FaUnlock  } from "react-icons/fa";

export default function PublicationsTabContributeContent({ description }) {
  const { colorMode } = useColorMode();
  const [card1, card2, card3, card4, card5] = contributePublicationsCards;

  return (
    <>
      <div className={styles.currentAppSection}>
        <div className={styles.headerContainer}>
          <h3 className={styles.description2}>
             {description}
          </h3>
        </div>
        
        <div className={styles.actionButtons}>
              <a href="https://docs.ciroh.org/docs/products/Portal/research-portal/#applications">
                <button className={styles.install}>Add your Publication</button>
              </a>
              <a href="#add-steps">
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

        <div id="add-steps" tabIndex={-1}>
          <div className={styles.headerContainer}>
            <h2 className={styles.title}>Add your Publications on 5 Easy Steps</h2>
          </div>
          <div  className={styles.cardContainer}>
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
                {card4.cardDescription}
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
              {card5.cardDescription}
              </p>
            </div>
          </div>
          
          </div>

        </div>
      </div>
    </>
  );
}
