import React from 'react';
import styles from './styles.module.css';
import { contributePublicationsCards } from './utils';
import StepsCards from './StepsCards';
import ActionButtons from './ActionButtons';
import CardsHeader from './CardsHeader';
export default function PublicationsTabContributeContent({ description }) {

  return (
      <div className={styles.currentAppSection}>
        <div className={styles.headerContainer}>
          <h3 className={styles.description2}>
             {description}
          </h3>
        </div>

        <CardsHeader header="Add your Publications on 5 Easy Steps" />
        <ActionButtons
            buttons={[
                { label: "Add your Publication", href: "https://docs.ciroh.org/docs/products/Portal/research-portal/#publications", primary: true },
                { label: "Visit Our Library", href: "https://www.zotero.org/groups/5261687/ciroh/library" }
              ]}
        />
        <StepsCards
            steps={contributePublicationsCards}
            containerId="add-publication-steps"
        />

      </div>
    
  );
}
