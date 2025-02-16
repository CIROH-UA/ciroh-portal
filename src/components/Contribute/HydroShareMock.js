import React from 'react';
import clsx from 'clsx';
import {
  FaUserPlus,
  FaInbox,
  FaTh,
  FaRegCopy,
  FaCodeBranch,
  FaPencilAlt,
  FaTrashAlt,
} from 'react-icons/fa';

import styles from './HydroShareMock.module.css';


export default function HydroShareAppMock({home_url, keywords,iconUrl}) {
  return (
    <div className={clsx(styles.resourceCard, 'padding--md', 'margin-bottom--lg')}>
      {/* Top row: Title + Open Web App button */}
      <div className={styles.topRow}>
        <h2 className={styles.resourceTitle}>TethysDash</h2>
        <button className={clsx('button', 'button--primary', styles.webAppButton)}>
          Open Web App
        </button>
      </div>
      <hr className={styles.divider} />

      {/* Row of 7 icons */}
      <div className={styles.iconRow}>
        <FaUserPlus className={clsx(styles.iconRed, styles.icon)} title="Add user" />
        <FaInbox className={clsx(styles.iconRed, styles.icon)} title="Box" />
        <FaTh className={clsx(styles.iconRed, styles.icon)} title="Grid" />
        <FaRegCopy className={clsx(styles.iconBlue, styles.icon)} title="File" />
        <FaCodeBranch className={clsx(styles.iconBlue, styles.icon)} title="Branch" />
        <FaPencilAlt className={clsx(styles.iconBlue, styles.icon)} title="Edit" />
        <FaTrashAlt className={clsx(styles.iconRed, styles.icon)} title="Delete" />
      </div>

      {/* Resource metadata table-like layout */}
      <div className={styles.resourceBody}>
        <div className={styles.resourceRow}>
          <div className={styles.resourceLabel}>Authors:</div>
          <div className={styles.resourceValue}>Joe Good</div>
        </div>
        <div className={styles.resourceRow}>
          <div className={styles.resourceLabel}>Owners:</div>
          <div className={styles.resourceValue}>Joe Doe</div>
        </div>
        <div className={styles.resourceRow}>
          <div className={styles.resourceLabel}>Type:</div>
          <div className={styles.resourceValue}>App Connector</div>
        </div>
        <div className={styles.resourceRow}>
          <div className={styles.resourceLabel}>Storage:</div>
          <div className={styles.resourceValue}>
            The size of this app connector is 0 bytes
          </div>
        </div>
        <div className={styles.resourceRow}>
          <div className={styles.resourceLabel}>Created:</div>
          <div className={styles.resourceValue}>Oct 14, 2024 at 4:56 p.m.</div>
        </div>
        <div className={styles.resourceRow}>
          <div className={styles.resourceLabel}>Last updated:</div>
          <div className={styles.resourceValue}>Jan 28, 2025 at 1:02 a.m.</div>
        </div>
        <div className={styles.resourceRow}>
          <div className={styles.resourceLabel}>Citation:</div>
          <div className={styles.resourceValue}>
            <a href="#">See how to cite this resource</a>
          </div>
        </div>
        <div className={styles.resourceRow}>
          <div className={styles.resourceLabel}>Sharing Status:</div>
          <div className={styles.resourceValue}>Public</div>
        </div>
        <div className={styles.resourceRow}>
          <div className={styles.resourceLabel}>Views:</div>
          <div className={styles.resourceValue}>368</div>
        </div>
        <div className={styles.resourceRow}>
          <div className={styles.resourceLabel}>Downloads:</div>
          <div className={styles.resourceValue}>9</div>
        </div>
        <div className={styles.resourceRow}>
          <div className={styles.resourceLabel}>+1 Votes:</div>
          <div className={styles.resourceValue}>
            You +1 this{' '}
            <button className={clsx(styles.withdrawButton, 'button', 'button--sm')}>
              Withdraw +1
            </button>
          </div>
        </div>
        <div className={styles.resourceRow}>
          <div className={styles.resourceLabel}>Comments:</div>
          <div className={styles.resourceValue}>No comments (yet)</div>
        </div>
      </div>

      {/* Additional sections: Abstract, Subject Keywords, Configuration, Credits, etc. */}
      <hr className={styles.sectionDivider} />

      {/* Abstract */}
      <div className={styles.abstractSection}>
        <h3 className={styles.sectionHeading}>Abstract</h3>
        <p className={styles.abstractText}>
          A powerful dashboard designed to visualize and analyze hydrologic data using the National
          Water Model (NWM) services. It can integrate interactive maps, time series plots, and
          statistical summaries of predictive watershed models for real-time or archived data.
        </p>
      </div>

      {/* Subject Keywords */}
      <div className={styles.resourceRow}>
        <div className={styles.resourceLabel}>Subject Keywords:</div>
        <div className={styles.resourceValue}>
          <code>{keywords}</code>
        </div>
      </div>

      {/* Configuration */}
      <div className={styles.configSection}>
        <h3 className={styles.sectionHeading}>Configuration</h3>
        <div className={styles.resourceRow}>
          <div className={styles.resourceLabel}>Home Page URL:</div>
          <div className={styles.resourceValue}>
            <a href="https://example.com/TethysDash" target="_blank" rel="noreferrer">
              {home_url}
            </a>
          </div>
        </div>
        {
          iconUrl && (
            <div className={styles.resourceRow}>
              <div className={styles.resourceLabel}>App Icon URL:</div>
              <div className={styles.resourceValue}>
                
                <div className={styles.iconPreview}>
                  <img
                    src={iconUrl}
                    alt="App Icon"
                    width="50"
                    height="50"
                    className={styles.smallIcon}
                  />
                </div>
              </div>
          </div>
          )

        }

        <div className={styles.resourceRow}>
          <div className={styles.resourceLabel}>Sharing Status:</div>
          <div className={styles.resourceValue}>Published, PeerReview, Private</div>
        </div>
      </div>

      {/* Credits */}
      <hr className={styles.sectionDivider} />
      <div className={styles.creditsSection}>
        <h3 className={styles.sectionHeading}>Credits</h3>
        <p>Funding Agencies:</p>
        <table className={styles.fundingTable}>
          <thead>
            <tr>
              <th>Agency Name</th>
              <th>Award Title</th>
              <th>Award Number</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>NSF</td>
              <td>Hydro Innovations</td>
              <td>123456</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* How to Cite */}
      <div className={styles.citationSection}>
        <h3 className={styles.sectionHeading}>How to Cite</h3>
        <p>
          (Doe, 2025) TethysDash, retrieved from{' '}
          <a href="https://www.hydroshare.org/resource/12345/" target="_blank" rel="noreferrer">
            https://www.hydroshare.org/resource/12345/
          </a>
        </p>
        <p>
          This resource is shared under the{' '}
          <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">
            Creative Commons Attribution CC-BY 4.0
          </a>
        </p>
      </div>
    </div>
  );
}
