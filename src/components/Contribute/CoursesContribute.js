import React from 'react';
import styles from './styles.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';
import HydroShareToolResourceForm from '@site/src/components/HydroShareToolResourceForm';
import Appstyles from './AppsStyles.module.css';
import ActionButtons from './ActionButtons';

export default function CoursesContribute({ description }) {
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
                    🎓 <strong>Add Your Courses </strong> 
                </div>
            </h3>
        </div>

        <HydroShareToolResourceForm typeContribution = 'course' resourceType="CompositeResource" keywordToAdd = "nwm_portal_module"/>
          <ActionButtons
            buttons={[
                { label: "Add your Course", href: "https://docs.ciroh.org/docs/products/Portal", primary: true },
                
              ]}
        />
      </div>
    
  );
}