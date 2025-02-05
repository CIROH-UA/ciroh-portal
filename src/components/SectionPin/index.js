import React from 'react';
import styles from './SectionPin.module.css';

import HSApp1Dark from '@site/static/img/hs_app_1_dark.png';
import HSApp2Dark from '@site/static/img/hs_app_2_dark.png';
import HSApp3Dark from '@site/static/img/hs_app_3_dark.png';
import HSApp4Dark from '@site/static/img/hs_app_4_dark.png';
import HSApp5Dark from '@site/static/img/hs_app_5_dark.png';

export default function SectionPin() {
  return (
    <div className={styles.wrapper}>
      <section id="sectionPin" className={styles.sectionPin}>
        <div className={styles.pinWrapSticky}>
          <div className={styles.pinWrap}>
            <img src={HSApp1Dark} alt="Image 1" className={styles.pinImage} />
            <img src={HSApp2Dark} alt="Image 2" className={styles.pinImage} />
            <img src={HSApp3Dark} alt="Image 3" className={styles.pinImage} />
            <img src={HSApp4Dark} alt="Image 4" className={styles.pinImage} />
            <img src={HSApp5Dark} alt="Image 5" className={styles.pinImage} />
          </div>
        </div>
      </section>
    </div>
  );
}
