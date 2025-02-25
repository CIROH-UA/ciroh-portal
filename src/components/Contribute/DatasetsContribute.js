import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './styles.module.css';
import { contributeDatasetsCards } from './utils';
import StepsCards from './StepsCards';
import ActionButtons from './ActionButtons';
import CardsHeader from './CardsHeader';


export default function DatasetsTabContributeContent({ description }) {
  // const { colorMode } = useColorMode();
  // const [card1, card2, card3] = contributeDatasetsCards;

  return (
          
    <div className={styles.currentAppSection}>

      <CardsHeader header="Create a HydroShare Resource on 3 Easy Steps" />
        <ActionButtons
            buttons={[
                { label: "Add your Data", href: "https://docs.ciroh.org/docs/products/Portal/research-portal/#data", primary: true },
                { label: "Getting Started", href: "https://help.hydroshare.org/introduction-to-hydroshare/getting-started/" }
              ]}
        />

        <StepsCards
            steps={contributeDatasetsCards}
            containerId="add-apps-steps"
        />

    </div>
  );
}
