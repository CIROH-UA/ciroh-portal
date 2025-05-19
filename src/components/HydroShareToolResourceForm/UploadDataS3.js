import React, { useState } from 'react';

import styles from './HydroShareResourceCreator.module.css';

export default function UploadDataS3({onChange}) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    onChange(file);
  };
  return (
        <div className= {styles.inputFileDiv}>
          <p className={styles.label}>Thumbnail</p>
          <label className={styles.label}>
            Upload file
            <input
              className={styles.inputFile}
              type="file"
              onChange={
                handleFileChange
              }
            />
          </label>
        </div>  
  );
}