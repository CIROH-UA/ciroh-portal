import React, { useState, useEffect, useCallback } from 'react';
import { FaTrash, FaPlus } from 'react-icons/fa';
import styles from './FundingAgenciesInput.module.css';


const DEFAULT_AGENCY = Object.freeze({
  agency_name:
    'National Oceanic and Atmospheric Administration (NOAA), University of Alabama',
  award_title:
    'CIROH: Enabling collaboration through data and model sharing with CUAHSI HydroShare',
  award_number:
    'NA22NWS4320003 to University of Alabama, subaward A23-0266-S001 to Utah State University',
  agency_url:
    'https://ciroh.ua.edu/research-projects/enabling-collaboration-through-data-and-model-sharing-with-cuahsi-hydroshare/',
});

export default function FundingAgenciesInput({ onChange }) {
  /** The array below is ONLY the user-editable agencies */
  const [agencies, setAgencies] = useState([]);

  useEffect(() => {
    onChange([DEFAULT_AGENCY, ...agencies]);
  }, [agencies, onChange]);

  /* Helpers ────────────────────────────────────────────── */
  const addAgency = () =>
    setAgencies((prev) => [
      ...prev,
      { agency_name: '', award_title: '', award_number: '', agency_url: '' },
    ]);

  const updateAgency = (index, field, value) =>
    setAgencies((prev) =>
      prev.map((a, i) => (i === index ? { ...a, [field]: value } : a)),
    );

  const removeAgency = (index) =>
    setAgencies((prev) => prev.filter((_, i) => i !== index));

  /* Render ─────────────────────────────────────────────── */
  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <h3 className={styles.header}>Funding Agencies</h3>
        <div className={styles.buttonGroup}>
          <button
            type="button"
            className={styles.addButton}
            onClick={addAgency}
          >
            <FaPlus className={styles.addIcon} />
          </button>
        </div>
      </div>

      {agencies.map((agency, index) => (
        <div key={index} className={styles.agencyCard}>
          <button
            type="button"
            className={styles.removeButton}
            onClick={() => removeAgency(index)}
          >
            <FaTrash />
          </button>

          <label className={styles.label}>
            Agency Name:
            <input
              className={styles.input}
              value={agency.agency_name}
              onChange={(e) =>
                updateAgency(index, 'agency_name', e.target.value)
              }
              placeholder="e.g. National Science Foundation"
            />
          </label>

          <label className={styles.label}>
            Award Title:
            <input
              className={styles.input}
              value={agency.award_title}
              onChange={(e) =>
                updateAgency(index, 'award_title', e.target.value)
              }
              placeholder="e.g. Model Execution Cyberinfrastructure"
            />
          </label>

          <label className={styles.label}>
            Award Number:
            <input
              className={styles.input}
              value={agency.award_number}
              onChange={(e) =>
                updateAgency(index, 'award_number', e.target.value)
              }
              placeholder="e.g. NSF_9087658_2017"
            />
          </label>

          <label className={styles.label}>
            Agency URL:
            <input
              className={styles.input}
              type="url"
              value={agency.agency_url}
              onChange={(e) =>
                updateAgency(index, 'agency_url', e.target.value)
              }
              placeholder="http://www.nsf.gov"
            />
          </label>
        </div>
      ))}
    </div>
  );
}
