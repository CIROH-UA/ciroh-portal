import React from 'react';
import styles from './styles.module.css';
import tabStyles from './tabsStyles.module.css';
import AppsTethysInfo from './AppsTethysInfo';
import HydroShareContribute from './HydroShareContribute';
import PublicationsContribute from './PublicationsContribute';
import DocsContribute from './DocsContribute';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { IoLayers,IoAppsSharp,IoBookmarks,IoSchool,IoFileTrayFull,IoTvOutline } from "react-icons/io5";


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
              <HydroShareContribute
                name="Apps"
                type="app"
                keyword="nwm_portal_app"
                icon="🕹️"
              />
              <AppsTethysInfo />
            </TabItem>

            <TabItem 
              value="datasets" 
              label={
                <span className={tabStyles.tabLabel}>
                  <IoLayers className={tabStyles.tabIcon} /> Datasets
                </span>
              }
            >
              <HydroShareContribute
                name="Dataset"
                type="dataset"
                keyword="ciroh_portal_data"
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
              <PublicationsContribute/>
            </TabItem>
            
            <TabItem 
              value="presentations" 
              label={
                <span className={tabStyles.tabLabel}>
                  <IoTvOutline className={tabStyles.tabIcon} /> Presentations
                </span>
              }
            >
              <HydroShareContribute
                name="Presentation"
                type="presentation"
                keyword="ciroh_portal_presentation"
                icon="📊"
              />
            </TabItem>
            
            <TabItem 
                value="courses" 
                label={
                  <span className={tabStyles.tabLabel}>
                    <IoSchool className={tabStyles.tabIcon} /> Courses
                  </span>
                }
              >
                <HydroShareContribute
                  name="Course"
                  type="course"
                  keyword="nwm_portal_module"
                  icon="🎓"
                />
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

          </Tabs>
        </div>
      </div>
    </div>
  );
}
