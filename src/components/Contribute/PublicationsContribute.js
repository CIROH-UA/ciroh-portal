import React from 'react';
import styles from './styles.module.css';
import { contributePublicationsCards } from './utils';
import StepsCards from './StepsCards';
import ActionButtons from './ActionButtons';
import CardsHeader from './CardsHeader';
import PublicationsImporter from '@site/src/components/PublicationsImporter';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Appstyles from './AppsStyles.module.css';


export default function CitationImporter({ description }) {
    const {
        siteConfig: {customFields},
      } = useDocusaurusContext();
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
                    📝 <strong>Add Your Publications </strong> 
                
                </div>
            </h3>
        </div>
        <PublicationsImporter
            groupId={customFields.zotero_group_id}
            zoteroApiKey={customFields.zotero_api_key}
        />
        {/* <hr className={Appstyles.sectionDivider} /> */}

        <ActionButtons
            buttons={[
                { label: "Add your Publication", href: "https://docs.ciroh.org/docs/products/Portal/research-portal/#publications", primary: true },
                { label: "Visit Our Library", href: "https://www.zotero.org/groups/5261687/ciroh/library" }
              ]}
        />
        {/* <hr className={Appstyles.sectionDivider} /> */}

        {/* <CardsHeader header="Add your Publications on 5 Easy Steps" /> */}

        {/* <StepsCards
            steps={contributePublicationsCards}
            containerId="add-publication-steps"
        /> */}

      </div>
    
  );
}
