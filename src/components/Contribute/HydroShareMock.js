import React, { useEffect } from 'react';
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
import { useColorMode } from '@docusaurus/theme-common';
import styles from './HydroShareMock.module.css';

/**
 * Custom hook: observes all elements matching the given selector (".highlightable")
 * and toggles the highlight class when they are at least 50% visible.
 */
function useScrollHighlight(selector, options = { threshold: 0.5 }) {
  useEffect(() => {
    const elements = document.querySelectorAll(selector);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.highlight);
        } else {
          entry.target.classList.remove(styles.highlight);
        }
      });
    }, options);
    elements.forEach((el) => observer.observe(el));
    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [selector, options]);
}

export default function HydroShareAppMock({ isAppResource,title,home_url, keywords, iconUrl }) {
  const { colorMode } = useColorMode();
  // Apply scroll highlighting to elements with the class "highlightable"
  useScrollHighlight('.highlightable');

  return (
    <div className={clsx(styles.resourceCard, 'padding--md', 'margin-bottom--lg')}>
      {/* Top row: Title and Open Web App button */}
      <div className={styles.topRow}>
        <h2 className={clsx(styles.resourceTitle)}>
          {title}
        </h2>
        {
          isAppResource && (
            <button
            className={clsx(
              'button',
              'button--primary',
              styles.webAppButton,
              styles.highlightContent,
              'highlightable'
            )}
            >
              <span className={styles.stepLabel}>Create an App Connector</span>
              Open Web App
            </button>
          )
        }

      </div>
      <hr className={styles.divider} />

      {/* Row of 7 icons */}
      <div className={styles.iconRow}>
        <span className={clsx(styles.highlightContent, 'highlightable')}>
          <span className={styles.stepLabel}>Add Keyword</span>
          <FaUserPlus className={clsx(styles.iconRed, styles.icon)} title="Add user" />
        </span>
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
          <div className={styles.resourceValue}>The size of this app connector is 0 bytes</div>
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

      <hr className={styles.sectionDivider} />

      {/* Additional sections */}
      {/* Subject Keywords */}
      <div className={styles.resourceRow}>
        <div className={styles.resourceLabel}>Subject Keywords:</div>
        <div className={styles.resourceValue}>
          <span className={clsx(styles.highlightContent, 'highlightable')}>
            <span className={styles.stepLabel}>Add Keyword</span>
            <code>{keywords}</code>
          </span>
        </div>
      </div>

      {/* Configuration */}
      <div className={styles.configSection}>
        <h3 className={styles.sectionHeading}>Configuration</h3>
        {
          home_url && (
            <div className={clsx(styles.resourceRow)}>
            <div className={styles.resourceLabel}>Home Page URL:</div>
            <div className={styles.resourceValue}>
              <span className={clsx(styles.highlightContent, 'highlightable')}>
                <span className={styles.stepLabel}>Set Home Page URL</span>
                <a href={home_url} target="_blank" rel="noreferrer">
                  {home_url}
                </a>
              </span>
            </div>
          </div>
          )

        }

        {iconUrl && (
          <div className={styles.resourceRow}>
            <div className={styles.resourceLabel}>App Icon URL:</div>
            <div className={styles.resourceValue}>
              <span className={clsx(styles.highlightContent, 'highlightable')}>
                <span className={styles.stepLabel}>Add Your Icon</span>
                <div className={styles.iconPreview}>
                  <img
                    src={iconUrl}
                    alt="App Icon"
                    width="50"
                    height="50"
                    className={styles.smallIcon}
                  />
                </div>
              </span>
            </div>
          </div>
        )}
        <div className={styles.resourceRow}>
          <div className={styles.resourceLabel}>Sharing Status:</div>
          <div className={styles.resourceValue}>Published, PeerReview, Private</div>
        </div>
      </div>

      <hr className={styles.sectionDivider} />

      {/* Credits */}
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
