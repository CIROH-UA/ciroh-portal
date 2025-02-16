import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './styles.module.css';
import AppsTabContributeContent from './AppsContribute';
import DatasetsTabContributeContent from './DatasetsContribute';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

export default function Contribute({title, description}) {
  return (
    <div>
      <div className={styles.wrapper}>
      <div className={styles.container}>
          <div className={styles.headerContainer}>
            <h1 className={styles.title}>{title}</h1>
            <h3 className={styles.description}>{description}</h3>
          </div>
      <Tabs className={styles.contributeTabs}>
        <TabItem value="apps" label="Applications" default>
          <AppsTabContributeContent 
              title="Add your Application to the CIROH App Suite"
              description={
                <div>
                  Powered by <a href="https://www.hydroshare.org/">HydroShare</a> create a new App Conector Resource, Add the required metadata, while
                  adding the <code>nwm_portal_app</code> keyword to make it discoverable
                </div>
              }
          />
        </TabItem>
        <TabItem value="datasets" label="Datasets" default>
          <DatasetsTabContributeContent
              title="Add your Datasets to the CIROH App Suite"
              description={
                <div>
                  Powered by <a href="https://www.hydroshare.org/">HydroShare</a> create a new App Conector Resource, Add the required metadata, while
                  adding the <code>nwm_portal_app</code> keyword to make it discoverable
                </div>
              }
          />
        </TabItem>
      </Tabs>
      </div>

      </div>
    </div>

  );
}
