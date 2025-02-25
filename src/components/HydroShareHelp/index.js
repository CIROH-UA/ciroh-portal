import React from 'react';
import styles from './styles.module.css';

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { IoLayers, IoAppsSharp} from "react-icons/io5";
import HydroShareMock from './HydroShareMock';
import AppIconUrl from '@site/static/img/tethysdash_icon.png';
import ActionButtons from './ActionButtons';

export default function HydroShareHelp({ title, description }) {
  return (
    <div>
      <div className={styles.wrapper}>
        
        <div className={styles.container}>
          <div className={styles.headerContainer}>
            <h2 className={styles.title}>
              {title}
            </h2>
          </div>
            <h3 className={styles.description}>
                    Elevate Your Impact: Share Data & Tools with HydroShare
                    <br/>
                    Build Resources or Seamlessly Integrate Apps via Connectors
            </h3>

            <ActionButtons
                buttons={[
                    { label: "Getting Started", href: "https://help.hydroshare.org/introduction-to-hydroshare/getting-started/", primary: true },
                    { label: "HydroShare Help", href: "https://help.hydroshare.org/"}
                ]}
            />

          <Tabs className={styles.contributeTabs}>
            <TabItem 
              value="app" 
              label={
                <span className={styles.tabLabel}>
                  <IoAppsSharp  className={styles.tabIcon} /> App Connector
                </span>
              }
              default
            >


                <HydroShareMock
                    isAppResource={true}
                    title="TethysDash"
                    home_url="https://github.com/FIRO-Tethys/aquainsight"
                    iconUrl={AppIconUrl}
                    keywords="nwm_portal_app"
                />
            </TabItem>
            <TabItem 
                value="single" 
                label={
                    <span className={styles.tabLabel}>
                    <IoLayers className={styles.tabIcon} /> Single Resource
                    </span>
                }
            >
                <HydroShareMock
                    isAppResource={false}
                    title="NWM Next Generation Forecast Data"
                    keywords="ciroh_portal_data"
                />
            </TabItem>

          </Tabs>
          </div>

        </div>
      </div>
    
  );
}
