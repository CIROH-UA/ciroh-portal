import React, { useState, useEffect } from 'react';
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
  // Function to programmatically change tab using event
  const changeTab = (tabValue) => {
    const currentUrl = new URL(window.location);
    currentUrl.searchParams.set('current-contribution', tabValue);
    window.history.replaceState({}, '', currentUrl.toString());
    
    // Dispatch a custom event that Docusaurus might listen to
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  // Make changeTab available globally for debugging/external use
  useEffect(() => {
    window.changeContributeTab = changeTab;
    return () => {
      delete window.changeContributeTab;
    };
  }, []);

  // Check for tab restoration after authentication
  useEffect(() => {
    const savedTab = localStorage.getItem('hydroshare-last-tab');
    if (savedTab) {
      // Check if we're returning from auth by looking for auth pending flags
      const authPendingKeys = Object.keys(localStorage).filter(key => 
        key.startsWith('hydroshare-auth-pending-')
      );
      
      if (authPendingKeys.length > 0) {
        console.log('Restoring tab after authentication:', savedTab);
        // Small delay to ensure component is fully mounted
        setTimeout(() => {
          changeTab(savedTab);
          // Clean up after successful restoration
          localStorage.removeItem('hydroshare-last-tab');
        }, 500);
      } else {
        // No auth pending, clean up old saved tab
        localStorage.removeItem('hydroshare-last-tab');
      }
    }
  }, []);

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
                    <IoAppsSharp  className={tabStyles.tabIcon} /> Products
                  </span>
                }
                default
              >
              <HydroShareContribute
                name="Products"
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
