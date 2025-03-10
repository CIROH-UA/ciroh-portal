import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { FaTrash, FaPlus } from 'react-icons/fa';
import styles from './CoveragesInput.module.css';
import 'react-datepicker/dist/react-datepicker.css';

export default function CoveragesInput({ onChange }) {
  // Each coverage entry is an object with:
  // { type: "spatial" or "geospatial", startDate: Date|null, endDate: Date|null }
  const [coverages, setCoverages] = useState([]);

  // When coverages change, call onChange prop with the array in metadata format.
  useEffect(() => {
    // For each coverage entry with type "spatial" and both dates set,
    // we create an object in the form:
    // { coverage: { type: 'period', value: { start: "MM/DD/YYYY", end: "MM/DD/YYYY" } } }
    const metadataCoverages = coverages
      .filter(cov => cov.type === 'spatial' && cov.startDate && cov.endDate)
      .map(cov => ({
        coverage: {
          type: 'period',
          value: { start: formatDate(cov.startDate), end: formatDate(cov.endDate) },
        },
      }));
    onChange(metadataCoverages);
  }, [coverages, onChange]);

  // Helper: Format date as MM/DD/YYYY
  const formatDate = (date) => {
    const d = new Date(date);
    const month = '' + (d.getMonth() + 1);
    const day = '' + d.getDate();
    const year = d.getFullYear();
    return [month.padStart(2, '0'), day.padStart(2, '0'), year].join('/');
  };

  const addCoverage = () => {
    setCoverages([...coverages, { type: 'spatial', startDate: null, endDate: null }]);
  };

  const updateCoverage = (index, field, value) => {
    const newCoverages = [...coverages];
    newCoverages[index][field] = value;
    setCoverages(newCoverages);
  };

  const removeCoverage = (index) => {
    const newCoverages = coverages.filter((_, i) => i !== index);
    setCoverages(newCoverages);
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <h3 className={styles.header}>Coverages</h3>
        <button type="button" className={styles.addButton} onClick={addCoverage}>
          <FaPlus className={styles.addIcon} />
        </button>
      </div>
      {coverages.map((cov, index) => (
        <div key={index} className={styles.coverageCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}></span>
            <button
              type="button"
              className={styles.removeButton}
              onClick={() => removeCoverage(index)}
            >
              <FaTrash />
            </button>
          </div>
          <label className={styles.label}>
            Type:
            <select
              className={styles.select}
              value={cov.type}
              onChange={(e) => updateCoverage(index, 'type', e.target.value)}
            >
              <option value="spatial">Spatial</option>
              <option value="geospatial">Geospatial</option>
            </select>
          </label>
          {cov.type === 'spatial' && (
            <div className={styles.datePickers}>
              <label className={styles.label}>
                Start Date:
                <DatePicker
                  selected={cov.startDate}
                  onChange={(date) => updateCoverage(index, 'startDate', date)}
                  dateFormat="MM/dd/yyyy"
                  placeholderText="MM/DD/YYYY"
                  className={styles.input}
                />
              </label>
              <label className={styles.label}>
                End Date:
                <DatePicker
                  selected={cov.endDate}
                  onChange={(date) => updateCoverage(index, 'endDate', date)}
                  dateFormat="MM/dd/yyyy"
                  placeholderText="MM/DD/YYYY"
                  className={styles.input}
                />
              </label>
            </div>
          )}
          {cov.type === 'geospatial' && (
            <p className={styles.note}>No additional input required for geospatial coverage.</p>
          )}
        </div>
      ))}
    </div>
  );
}
