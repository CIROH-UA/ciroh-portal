import React from 'react';
import styles from './styles.module.css';
import { contributeLearningModulesCards } from './utils';
import StepsCards from './StepsCards';
import ActionButtons from './ActionButtons';
import CardsHeader from './CardsHeader';
import useBaseUrl from '@docusaurus/useBaseUrl';
import HydroShareToolResourceForm from '@site/src/components/HydroShareToolResourceForm';
import Appstyles from './AppsStyles.module.css';


export default function LearningModulesContribute({ description }) {
  const hydroshareUrl = useBaseUrl('/hydroshare');

  return (
      <div className={styles.currentAppSection}>
        <div className={styles.headerContainer}>
          <h3 className={styles.description2}>
             {description}
          </h3>
        </div>

        <div className={Appstyles.headerContainer}>
            <h3 className={Appstyles.description2}>
                <div>
                    📚 <strong>Add Your Coruses </strong> 
                </div>
            </h3>
        </div>

        <HydroShareToolResourceForm resourceType="CompositeResource" makePublic={true} keywordToAdd = "nwm_portal_module"/>
{/* 
        <hr className={Appstyles.sectionDivider} />
        <div className={Appstyles.headerContainer}>
            <h3 className={Appstyles.description2}>
                <div>
                   Next follow These <strong>Steps </strong> 👣
                </div>
            </h3>
        </div>

        <StepsCards
            steps={contributeLearningModulesCards}
            containerId="add-learning-steps"
            customCardContainerClass={styles.cardContainerLearningModules}
        /> */}
      </div>
    
  );
}