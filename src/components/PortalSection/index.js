import React from 'react';
import clsx from 'clsx';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './styles.module.css';

import PortalAppExampleLight from '@site/static/img/portal_apps_light.png';
import PortalAppExampleDark from '@site/static/img/portal_apps_dark.png';

export default function PortalSection({ title, description }) {
  const { colorMode } = useColorMode();
  return (
          <div className={styles.wrapper}>

            <div className={styles.container}>
            <div className={styles.currentAppSection}>
                <div className={styles.headerContainer}>
                    <h1 className={styles.title}>{title}</h1>
                    <h3 className={styles.description}>{description}</h3>

                    <img
                        src={colorMode === 'dark' ? PortalAppExampleDark : PortalAppExampleLight}
                        className={styles.appImage}
                        alt="CIROH application example interface"
                    />
                </div>
            </div>
            </div>
          </div>  

  );
}
