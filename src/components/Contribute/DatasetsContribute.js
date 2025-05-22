import React from 'react';
import styles from './styles.module.css';
import { contributeDatasetsCards } from './utils';
import StepsCards from './StepsCards';
import ActionButtons from './ActionButtons';
import CardsHeader from './CardsHeader';
import HydroShareToolResourceForm from '@site/src/components/HydroShareToolResourceForm';
import Appstyles from './AppsStyles.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function DatasetsTabContributeContent() {
  const hydroshareUrl = useBaseUrl('/hydroshare');
  return (
          
    <div className={styles.currentAppSection}>

      {/* <CardsHeader header="Add your Dataset!" />
       */}
        <div className={Appstyles.headerContainer}>
            <h3 className={Appstyles.description2}>
                <div>
                💾 <strong>  Add your Dataset </strong>
                </div>
            </h3>
        </div>

        <HydroShareToolResourceForm 
          resourceType="CompositeResource"
          typeContribution='dataset'
          keywordToAdd = "nwm_portal_dataset"
          makePublic={true} 
        />

        <hr className={Appstyles.sectionDivider} />
        <div className={Appstyles.headerContainer}>
            <h3 className={Appstyles.description2}>
                <div>
                   Share your <strong>Dataset</strong> 👣
                </div>
            </h3>
        </div>


        <StepsCards
            steps={contributeDatasetsCards}
            containerId="add-apps-steps"
        />
        <ActionButtons
            buttons={[
                { label: "Add your Data", href: "https://docs.ciroh.org/docs/products/Portal/#data", primary: true }
              ]}
        />

    </div>
  );
}
