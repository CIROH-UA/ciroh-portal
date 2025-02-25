import React from 'react';
import styles from './styles.module.css';
import { contributeAppCards } from './utils';
import StepsCards from './StepsCards';
import ActionButtons from './ActionButtons';
import CardsHeader from './CardsHeader';

export default function AppsTabContributeContent({ description }) {
  return (
    <>
      
      <div className={styles.currentAppSection}>
        <CardsHeader header="Create an App Resource on 5 Easy Steps" />
        <ActionButtons
            buttons={[
                { label: "Add your App", href: "https://docs.ciroh.org/docs/products/Portal/research-portal/#applications", primary: true },
                { label: "Quick Start", href: "#add-steps" }
              ]}
        />

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
