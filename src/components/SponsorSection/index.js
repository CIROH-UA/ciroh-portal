import React from 'react';
import { useColorMode } from "@docusaurus/theme-common";
import styles from './styles.module.css';
import TethysLogoDark from '@site/static/img/tethys_logo2_black.png';
import HydroShareLogo from '@site/static/img/hydroshare_white.png';

export default function SponsorSection() {
 const { colorMode } = useColorMode(); // Get the current theme (light or dark)

  return (
    <section className={styles.sponsorSection}>
      <div>
        <p>Sponsored by</p>
        <a
          href="https://www.browserstack.com/automation-webdriverio"
          target="_self"
          rel="noopener noreferrer"
        >
          <img
            src= {TethysLogoDark}
            alt="Tethys"
          />
        </a>
        {/* Use a CSS class to override margin if needed instead of inline styles */}
        <p className={styles.noMarginRight}>&nbsp; and &nbsp;</p>
        <a
          href="https://www.saucelabs.com"
          target="_self"
          rel="noopener noreferrer"
        >
          <img
            src={HydroShareLogo}
            alt="HydroShare"
          />
        </a>
      </div>
    </section>
  );
}
