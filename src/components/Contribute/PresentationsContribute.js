import React from 'react';
import styles from './styles.module.css';
import { contributeDatasetsCards } from './utils';
import StepsCards from './StepsCards';
import ActionButtons from './ActionButtons';
import CardsHeader from './CardsHeader';
import HydroShareToolResourceForm from '@site/src/components/HydroShareToolResourceForm';
import Appstyles from './AppsStyles.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function PresentationsTabContributeContent() {
  const hydroshareUrl = useBaseUrl('/hydroshare');
  return (
          
    <div className={styles.currentAppSection}>
        <div className={Appstyles.headerContainer}>
            <h3 className={Appstyles.description2}>
                <div>
                💾 <strong>  Add your Presentation </strong>
                </div>
            </h3>
        </div>

        <HydroShareToolResourceForm 
          resourceType="CompositeResource"
          typeContribution='presentations'
          keywordToAdd = "nwm_portal_presentation"
        />

        <hr className={Appstyles.sectionDivider} />
        <div className={Appstyles.headerContainer}>
            <h3 className={Appstyles.description2}>
                <div>
                   Share your <strong>Presentation</strong> 👣
                </div>
            </h3>
        </div>


        <StepsCards
            steps={contributeDatasetsCards}
            containerId="add-apps-steps"
        />
        <ActionButtons
            buttons={[
                { label: "Add your Presentation", href: "https://docs.ciroh.org/docs/products/Portal/#data", primary: true }
              ]}
        />

    </div>
  );
}
