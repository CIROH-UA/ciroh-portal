import React, {useState} from 'react';
import styles from './HydroShareResourceCreator.module.css';

export default function UploadDataS3({onChange}) {
  const [fileName, setFileName] = useState('');

  const handleFileChange = e => {
    const file = e.target.files[0] || null;
    setFileName(file ? file.name : '');
    onChange(file);                
  };

  return (
    <div className={styles.inputFileDiv}>
      <p className={styles.label}>Thumbnail</p>

      {/* clickable “button” */}
      <label className={styles.label}>
        🗃️ Upload file
        <input
          className={styles.inputFile}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </label>

      {fileName && <span className={styles.fileName}>🗄️ {fileName}</span>}
    </div>
  );
}