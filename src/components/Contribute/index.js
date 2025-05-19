import React from 'react';
import styles from './styles.module.css';
import tabStyles from './tabsStyles.module.css';
import AppsTabContributeContent from './AppsContribute';
import DatasetsTabContributeContent from './DatasetsContribute';
import PublicationsTabContributeContent from './PublicationsContribute';
import DocsContribute from './DocsContribute';
import LearningModulesContribute from './LearningModulesContribute';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { IoLayers, IoAppsSharp,IoBookmarks,IoSchool,IoFileTrayFull   } from "react-icons/io5";


export default function Contribute({ title }) {
  return (
    <div>
      <div className={styles.wrapper}>
        
        <div className={styles.container}>
          <div className={styles.headerContainer}>
            <h2 className={styles.title}>
              {title}
            </h2>
          </div>
          
          <Tabs queryString="current-contribution" className={tabStyles.contributeTabs}>
            <TabItem 
              value="apps" 
              label={
                <span className={tabStyles.tabLabel}>
                  <IoAppsSharp  className={tabStyles.tabIcon} /> Apps
                </span>
              }
              default
            >

              <AppsTabContributeContent />
            </TabItem>
              <TabItem 
                value="datasets" 
                label={
                  <span className={tabStyles.tabLabel}>
                    <IoLayers className={tabStyles.tabIcon} /> Datasets
                  </span>
                }
              >
                <DatasetsTabContributeContent
                  description={
                    <div>
                      Create a new <a href="https://www.hydroshare.org/" target="_blank" rel="noopener">HydroShare</a> resource, add the required metadata, while adding the <code>ciroh_portal_data</code> keyword to make it discoverable
                    </div>
                  }
                />
            </TabItem>

            <TabItem 
                value="publications" 
                label={
                  <span className={tabStyles.tabLabel}>
                    <IoBookmarks className={tabStyles.tabIcon} /> Publications
                  </span>
                }
              >
              <PublicationsTabContributeContent/>
            </TabItem>
            <TabItem 
                value="docs" 
                label={
                  <span className={tabStyles.tabLabel}>
                    <IoFileTrayFull className={tabStyles.tabIcon} /> Docs
                  </span>
                }
              >
              <DocsContribute/>
            </TabItem>

            <TabItem 
                value="courses" 
                label={
                  <span className={tabStyles.tabLabel}>
                    <IoSchool className={tabStyles.tabIcon} /> Courses
                  </span>
                }
              >
                <LearningModulesContribute/>
            </TabItem>
          </Tabs>
          </div>

        </div>
      </div>
    
  );
}
