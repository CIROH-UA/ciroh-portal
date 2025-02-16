import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './styles.module.css';
import { contributeAppCards } from './utils';


export default function AppsTabContributeContent() {
  const { colorMode } = useColorMode();
  const [card1, card2, card3, card4,card5] = contributeAppCards;

  return (
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
        <div className={styles.card}>
            <img
            src={colorMode === 'dark' ? card4.imgSrcDark : card4.imgSrcLight}
            alt={card4.imgAlt}
            className={styles.cardImage}
            />
            <div className={styles.cardContent}>
            <h4 className={styles.cardTitle}>{card4.cardTitle}</h4>
            <p className={styles.cardDescription}>Add <code>nwm_portal_app</code> keyword to your App Connector Resource to make it discoverable.</p>
            </div>
        </div>
        <div className={styles.card}>
            <img
            src={colorMode === 'dark' ? card5.imgSrcDark : card5.imgSrcLight}
            alt={card5.imgAlt}
            className={styles.cardImage}
            />
            <div className={styles.cardContent}>
            <h4 className={styles.cardTitle}>{card5.cardTitle}</h4>
            <p className={styles.cardDescription}>Add <code>nwm_portal_app</code> keyword to your App Connector Resource to make it discoverable.</p>
            </div>
        </div>
        </div>
  );
}
