import React, { useState } from 'react';

import styles from './FundingAgenciesInput.module.css';




export default function UploadDataS3({onChange}) {
  // Function to handle file and store it to file state
  const handleFileChange = (e) => {
    // Uploaded file
    const file = e.target.files[0];
    // Changing file state
    onChange(file);
  };
  return (
   <div className={styles.container}>
        <div className={styles.Card}>
          <label className={styles.label}>
            Image/Icon:
            <input
              className={styles.input}
              type="file"
              onChange={
                handleFileChange
              }
              placeholder="Upload a Image file"
            />
          </label>
        </div>
    </div>
  );
}