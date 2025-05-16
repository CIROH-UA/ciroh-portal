import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { FaTrash, FaPlus } from 'react-icons/fa';
import styles from './CoveragesInput.module.css';
import 'react-datepicker/dist/react-datepicker.css';


const TODAY = new Date();
const DEFAULT_TEMPORAL_COVERAGE = Object.freeze({
  type: 'temporal',
  startDate: TODAY,
  endDate: TODAY,
});

export default function CoveragesInput({ onChange }) {
  /* User-editable coverages only — start with an empty form. */
  const [coverages, setCoverages] = useState([]);


  useEffect(() => {
    const toMetadata = (cov) => ({
      coverage: {
        type: 'period',
        value: {
          start: formatDate(cov.startDate),
          end: formatDate(cov.endDate),
        },
      },
    });

    const all = [DEFAULT_TEMPORAL_COVERAGE, ...coverages]
      .filter(
        (c) => c.type === 'temporal' && c.startDate && c.endDate,
      )
      .map(toMetadata);

    onChange(all);
  }, [coverages, onChange]);

  /* Helpers ─────────────────────────────────────────────── */
  const formatDate = (date) => {
    const d = new Date(date);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${mm}/${dd}/${yyyy}`; // MM/DD/YYYY
  };

  const addCoverage = () =>
    setCoverages((prev) => [
      ...prev,
      { type: 'temporal', startDate: null, endDate: null },
    ]);

  const updateCoverage = (index, field, value) =>
    setCoverages((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)),
    );

  const removeCoverage = (index) =>
    setCoverages((prev) => prev.filter((_, i) => i !== index));

  /* Render ──────────────────────────────────────────────── */
  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <h3 className={styles.header}>Coverages</h3>
        <button
          type="button"
          className={styles.addButton}
          onClick={addCoverage}
        >
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
              <option value="temporal">temporal</option>
              {/* <option value="spatial">spatial</option> */}
            </select>
          </label>

          {cov.type === 'temporal' && (
            <div className={styles.datePickers}>
              <label className={styles.label}>
                Start Date:
                <DatePicker
                  selected={cov.startDate}
                  onChange={(date) =>
                    updateCoverage(index, 'startDate', date)
                  }
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

          {cov.type === 'spatial' && (
            <p className={styles.note}>
              No additional input required for spatial coverage.
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
