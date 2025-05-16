import React from 'react';
import styles from './styles.module.css';
import Appstyles from './AppsStyles.module.css';
import { contributeAppCards } from './utils';
import StepsCards from './StepsCards';
import HydroShareToolResourceForm from '@site/src/components/HydroShareToolResourceForm';
import ActionButtons from './ActionButtons';
import useBaseUrl from '@docusaurus/useBaseUrl';

import CardsHeader from './CardsHeader';

export default function AppsTabContributeContent() {
  const developUrl = useBaseUrl('/develop');
  const hydroshareUrl = useBaseUrl('/hydroshare');
  return (
    <>
      
      <div className={styles.currentAppSection}>
        {/* <CardsHeader header="Add your App!" /> */}
        
        <div className={Appstyles.headerContainer}>
            <h3 className={Appstyles.description2}>
                <div>
                🚀  <strong> </strong> Create a HydroShare App Resource
                </div>
            </h3>
        </div>

        <HydroShareToolResourceForm 
          resourceType="CompositeResource" 
          makePublic={true} 
          keywordToAdd = "nwm_portal_app"
        />

        <hr className={Appstyles.sectionDivider} />
        <div className={Appstyles.headerContainer}>
            <h3 className={Appstyles.description2}>
                <div>
                   Next follow These <strong>Steps </strong> 👣
                </div>
            </h3>
        </div>

        <StepsCards
            steps={contributeAppCards}
            containerId="add-apps-steps"
        />
      </div>
      <ActionButtons
            buttons={[
                { label: "Add your App", href: "https://docs.ciroh.org/docs/products/Portal/research-portal/#applications", primary: true },
                { label: "Quick Start", href: hydroshareUrl }
              ]}
        />

        <hr className={Appstyles.sectionDivider} />

        <div className={Appstyles.headerContainer}>
          <h3 className={Appstyles.description2}>
              <div>
                💧 <strong>Thinking about an App? </strong> Develop applications using our <a href="https://www.tethysplatform.org/" target="_blank" rel="noopener">Tethys Platform</a> toolkit
              </div>
          </h3>
        </div>

        <ActionButtons
            buttons={[
                { label: "Develop an App", href: developUrl, primary: true },
                { label: "Getting Started", href: "https://docs.tethysplatform.org/en/stable/index.html" }
              ]}
        />
    </>
  );
}
