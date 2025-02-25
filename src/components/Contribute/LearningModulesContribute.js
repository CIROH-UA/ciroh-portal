import React from 'react';
import styles from './styles.module.css';
import { contributeLearningModulesCards } from './utils';
import StepsCards from './StepsCards';
import ActionButtons from './ActionButtons';
import CardsHeader from './CardsHeader';
import HydroShareMock from './HydroShareMock';


export default function LearningModulesContribute({ description }) {

  return (
      <div className={styles.currentAppSection}>
        <div className={styles.headerContainer}>
          <h3 className={styles.description2}>
             {description}
          </h3>
        </div>

        <HydroShareMock
            isAppResource={false}
            title="Quantifying Runoff Generation"
            keywords="nwm_portal_module"
        />
        <CardsHeader header="Add your Learning Module on 3 Easy Steps" />

        <ActionButtons
            buttons={[
                { label: "Add your Module", href: "https://docs.ciroh.org/docs/products/Portal/research-portal/#learning-modules", primary: true },
                { label: "Visit the Courses", href: "https://edx.hydrolearn.org/courses" }
              ]}
        />
        <StepsCards
            steps={contributeLearningModulesCards}
            containerId="add-publication-steps"
        />
      </div>
    
  );
}
