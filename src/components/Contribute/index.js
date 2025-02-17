import React from 'react';
import styles from './styles.module.css';
import AppsTabContributeContent from './AppsContribute';
import DatasetsTabContributeContent from './DatasetsContribute';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { IoLayers, IoAppsSharp   } from "react-icons/io5";


export default function Contribute({ title, description }) {
  return (
    <div>
      <div className={styles.wrapper}>
        
        <div className={styles.container}>
          <div className={styles.headerContainer}>
            <h2 className={styles.title}>
              {title}
            </h2>
            {/* <h3 className={styles.description}>
              {description}
            </h3> */}
          </div>
          
          <Tabs className={styles.contributeTabs}>
            <TabItem 
              value="apps" 
              label={
                <span className={styles.tabLabel}>
                  <IoAppsSharp  className={styles.tabIcon} /> Apps
                </span>
              }
              default
            >

              <AppsTabContributeContent 
                description={
                  <div>
                    🚀 <strong>Have an existing App? </strong> Create a public <a href="https://www.hydroshare.org/" target="_blank" rel="noopener">HydroShare</a> App Resource
                    <br />
                    💧 <strong>Thinking about an App? </strong> Develop applications using our <a href="https://www.tethysplatform.org/" target="_blank" rel="noopener">Tethys Platform</a> toolkit
                  </div>
                }
              />
            </TabItem>
            <TabItem 
              value="datasets" 
              label={
                <span className={styles.tabLabel}>
                  <IoLayers className={styles.tabIcon} /> Datasets
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
          </Tabs>
          </div>

        </div>
      </div>
    
  );
}
