import React from 'react';
import styles from './styles.module.css';
import { contributeLearningModulesCards } from './utils';
import StepsCards from './StepsCards';
import ActionButtons from './ActionButtons';
import CardsHeader from './CardsHeader';


export default function LearningModulesContribute({ description }) {

  return (
      <div className={styles.currentAppSection}>
        <div className={styles.headerContainer}>
          <h3 className={styles.description2}>
             {description}
          </h3>
        </div>


        <CardsHeader header="Add your Learning Module on 3 Easy Steps" />
        <ActionButtons
            buttons={[
                { label: "Add your Module", href: "https://docs.ciroh.org/docs/products/Portal/research-portal/#learning-modules", primary: true },
                { label: "Quick Start", href: "/hydroshare" }
              ]}
        />

        <StepsCards
            steps={contributeLearningModulesCards}
            containerId="add-learning-steps"
        />
      </div>
    
  );
}
