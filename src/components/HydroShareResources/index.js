import React from 'react';
import HydroShareResourceCard from './HydroShareResourceCard';
import styles from './styles.module.css';

export default function HydroShareResources({ resources = [] }) {
  return (
      <div className={styles.gridContainer}>
              {resources.map((res, idx) => (
                <HydroShareResourceCard resource={res} key={idx} />
              ))}
      </div>
  );
}
