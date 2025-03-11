import React, { useState, useEffect } from 'react';
import { FaTrash, FaPlus } from 'react-icons/fa';
import styles from './FundingAgenciesInput.module.css';

export default function FundingAgenciesInput({ onChange }) {
  const [agencies, setAgencies] = useState([]);

  // Pass the current agencies to the parent component when they change
  useEffect(() => {
    onChange(agencies);
  }, [agencies, onChange]);

  const addAgency = () => {
    setAgencies([
      ...agencies,
      { agency_name: '', award_title: '', award_number: '', agency_url: '' },
    ]);
  };

  const updateAgency = (index, field, value) => {
    const newAgencies = [...agencies];
    newAgencies[index][field] = value;
    setAgencies(newAgencies);
  };

  const removeAgency = (index) => {
    const newAgencies = agencies.filter((_, i) => i !== index);
    setAgencies(newAgencies);
  };


  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <h3 className={styles.header}>Funding Agencies</h3>
        <div className={styles.buttonGroup}>
          <button type="button" className={styles.addButton} onClick={addAgency}>
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
