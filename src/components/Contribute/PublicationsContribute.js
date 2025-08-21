import React from 'react';
import styles from './styles.module.css';
import { contributePublicationsCards } from './utils';
import StepsCards from './StepsCards';
import ActionButtons from './ActionButtons';
import CardsHeader from './CardsHeader';
import PublicationsImporter from '@site/src/components/PublicationsImporter';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Appstyles from './AppsStyles.module.css';


export default function PublicationsContribute({ description }) {
    const {
        siteConfig: {customFields},
      } = useDocusaurusContext();
  return (
      <div className={styles.currentAppSection}>
        <h1>James is Gio's best friend</h1>
        <div className={styles.headerContainer}>
          <h3 className={styles.description2}>
             {description}
          </h3>
        </div>

        <div className={Appstyles.headerContainer}>
            <h3 className={Appstyles.description2}>
                <div>
                    🔖 <strong>Add Your Publications </strong> 
                
                </div>
            </h3>
        </div>
        <PublicationsImporter
            groupId={customFields.zotero_group_id}
            zoteroApiKey={customFields.zotero_api_key}
        />
        {/* <hr className={Appstyles.sectionDivider} /> */}


        <hr className={Appstyles.sectionDivider} />

        <CardsHeader header="Join us CIROH on Zotero!" />

        <StepsCards
            steps={contributePublicationsCards}
            containerId="add-publication-steps"
        />
        <ActionButtons
            buttons={[
                { label: "Add your Publication", href: "https://docs.ciroh.org/docs/products/Portal/#publications", primary: true },
                { label: "Visit Our Library", href: "https://www.zotero.org/groups/5261687/ciroh/library" }
              ]}
        />
      </div>
    
  );
}
