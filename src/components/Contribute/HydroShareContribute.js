import React from 'react';
import styles from './styles.module.css';
import { contributeDatasetsCards } from './utils';
import StepsCards from './StepsCards';
import ActionButtons from './ActionButtons';
import CardsHeader from './CardsHeader';
import HydroShareToolResourceForm from '@site/src/components/HydroShareToolResourceForm';
import Appstyles from './AppsStyles.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function HydroShareContribute({ name="Dataset", icon="💾", type='dataset', keyword="ciroh_portal_data" }) {
  const hydroshareUrl = useBaseUrl('/hydroshare');
  return (
          
    <div className={styles.currentAppSection}>
      <div className={Appstyles.headerContainer}>
          <h3 className={Appstyles.description2}>
              <div>
              {icon} <strong> Add your {name} </strong>
              </div>
          </h3>
      </div>

      <HydroShareToolResourceForm 
        resourceType="CompositeResource"
        typeContribution={type}
        keywordToAdd={keyword}
      />

      <hr className={Appstyles.sectionDivider} />
      <div className={Appstyles.headerContainer}>
          <h3 className={Appstyles.description2}>
              <div>
                  Share your <strong>{name}</strong> 👣
              </div>
          </h3>
      </div>

      <StepsCards
          steps={contributeDatasetsCards}
          containerId="add-apps-steps"
      />
      <ActionButtons
        buttons={[
            { label: `Learn more about contributing`, href: "https://docs.ciroh.org/docs/products/Portal/#contribute-", primary: true }
          ]}
      />

    </div>
  );
}
