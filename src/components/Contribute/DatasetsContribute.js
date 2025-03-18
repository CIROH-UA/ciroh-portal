import React from 'react';
import styles from './styles.module.css';
import { contributeDatasetsCards } from './utils';
import StepsCards from './StepsCards';
import ActionButtons from './ActionButtons';
import CardsHeader from './CardsHeader';
import HydroShareToolResourceForm from '@site/src/components/HydroShareToolResourceForm';
import Appstyles from './AppsStyles.module.css';

export default function DatasetsTabContributeContent() {

  return (
          
    <div className={styles.currentAppSection}>

      {/* <CardsHeader header="Add your Dataset!" />
       */}
        <div className={Appstyles.headerContainer}>
            <h3 className={Appstyles.description2}>
                <div>
                  🚀 <strong> </strong> Create a HydroShare Resource
                </div>
            </h3>
        </div>

        <HydroShareToolResourceForm resourceType="CompositeResource" makePublic={true} />

        <hr className={Appstyles.sectionDivider} />
        <div className={Appstyles.headerContainer}>
            <h3 className={Appstyles.description2}>
                <div>
                   Next follow These <strong>Steps </strong> 👣
                </div>
            </h3>
        </div>


        <StepsCards
            steps={contributeDatasetsCards}
            containerId="add-apps-steps"
        />
        <ActionButtons
            buttons={[
                { label: "Add your Data", href: "https://docs.ciroh.org/docs/products/Portal/research-portal/#data", primary: true },
                { label: "Quick Start", href: "/hydroshare" },
              ]}
        />

    </div>
  );
}
