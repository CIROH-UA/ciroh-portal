import React from 'react';
import clsx from 'clsx';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './styles.module.css';
import { contributeAppCards } from './utils';
import AppIconUrl from '@site/static/img/tethysdash_icon.png';
// This is your "example app" resource card
import HydroShareMock from './HydroShareMock';
import StepsCards from './StepsCards';
import ActionButtons from './ActionButtons';
import CardsHeader from './CardsHeader';

export default function AppsTabContributeContent({ description }) {
  const { colorMode } = useColorMode();
  // Destructure your card data
  const [card1, card2, card3, card4, card5] = contributeAppCards;

  return (
    <>
      
      <div className={styles.currentAppSection}>
        <div className={styles.headerContainer}>
          <h3 className={styles.description2}>
             {description}
          </h3>
        </div>
        

        <ActionButtons
            buttons={[
                { label: "Add your App", href: "https://docs.ciroh.org/docs/products/Portal/research-portal/#applications", primary: true },
                { label: "Quick Start", href: "#add-steps" }
              ]}
        />


        <HydroShareMock
            isAppResource={true}
            title="TethysDash"
            home_url="https://github.com/FIRO-Tethys/aquainsight"
            iconUrl={AppIconUrl}
            keywords="nwm_portal_app"
        />
        <CardsHeader header="Create an App Resource on 5 Easy Steps" />


        <StepsCards
            steps={contributeAppCards}
            containerId="add-apps-steps"
        />

      </div>

      <hr className={styles.sectionDivider} />

        <div className={styles.headerContainer}>
          <h3 className={styles.description2}>
              <div>
                💧 <strong>Thinking about an App? </strong> Develop applications using our <a href="https://www.tethysplatform.org/" target="_blank" rel="noopener">Tethys Platform</a> toolkit
              </div>
          </h3>
        </div>

        <ActionButtons
            buttons={[
                { label: "Develop an App", href: "/develop", primary: true },
                { label: "Getting Started", href: "https://docs.tethysplatform.org/en/stable/index.html" }
              ]}
        />
    </>
  );
}
