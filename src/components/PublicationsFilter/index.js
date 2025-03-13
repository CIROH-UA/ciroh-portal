import React, { useState, useEffect } from 'react';
import styles from './PublicationsFilter.module.css';

const itemTypes = [
  { value: '', label: 'All Types' },
  { value: 'journalArticle', label: 'Journal Articles' },
  { value: 'book', label: 'Books' },
  { value: 'conferencePaper', label: 'Conference Papers' },
  { value: 'report', label: 'Reports' },
  { value: 'thesis', label: 'Theses' },
];

export default function PublicationsFilter({ onFilterChange }) {
  const [filters, setFilters] = useState({
    search: '',
    itemType: '',
    startYear: '',
    endYear: ''
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      onFilterChange(filters);
    }, 300);

    return () => clearTimeout(handler);
  }, [filters, onFilterChange]);

  const handleChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className={styles.filterContainer}>
      <input
        type="text"
        placeholder="Search titles..."
        value={filters.search}
        onChange={(e) => handleChange('search', e.target.value)}
        className={styles.searchInput}
      />
      
      <select
        value={filters.itemType}
        onChange={(e) => handleChange('itemType', e.target.value)}
        className={styles.typeSelect}
      >
        {itemTypes.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>

      <div className={styles.yearFilters}>
        <input
          type="number"
          placeholder="Start year"
          value={filters.startYear}
          onChange={(e) => handleChange('startYear', e.target.value)}
          className={styles.yearInput}
          min="1900"
          max={new Date().getFullYear()}
        />
        <span className={styles.yearSeparator}>–</span>
        <input
          type="number"
          placeholder="End year"
          value={filters.endYear}
          onChange={(e) => handleChange('endYear', e.target.value)}
          className={styles.yearInput}
          min="1900"
          max={new Date().getFullYear()}
        />
      </div>
    </div>
  );
}