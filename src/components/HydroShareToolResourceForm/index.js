import React, { useState, useCallback } from 'react';
import { FaSpinner } from 'react-icons/fa';
import CoveragesInput from './CoveragesInput';
import FundingAgenciesInput from './FundingAgenciesInput';
import UploadDataS3 from './UploadDataS3';
import styles from './HydroShareResourceCreator.module.css';
import clsx from 'clsx';

import { uploadFileToS3Cucket } from './utils';   // ⬅ corrected import
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const getTypeString = (type) => {
  switch (type) {
    case 'app':
      return 'Application';
    case 'dataset':
      return 'Dataset';
    case 'course':
      return 'Course';
  }
}


export default function HydroShareResourceCreator({
  resourceType = 'ToolResource',
  makePublic   = false,
  keywordToAdd = 'nwm_portal_app',
  typeContribution = 'app',
}) {
  /* ───────────── state ───────────── */
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [title,    setTitle]    = useState('');
  const [abstract, setAbstract] = useState('');
  const [keywords, setKeywords] = useState('');
  const [inputUrl, setInputUrl] = useState('');      // optional related URL

  const [fundingAgencies, setFundingAgencies] = useState([]);
  const [coverages,       setCoverages]       = useState([]);

  const [files,     setFiles]     = useState([]);    // HydroShare-bound files
  const [iconFile,  setIconFile]  = useState(null); // single file from UploadDataS3

  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState('');
  const [progressMessage, setProgressMessage] = useState('');
  const [resourceUrl,     setResourceUrl]     = useState('');

  /* S3 credentials from docusaurus.config.js */
  const {
    siteConfig: { customFields },
  } = useDocusaurusContext();
  const S3_BUCKET     = customFields.s3_bucket;
  const REGION        = customFields.s3_region;
  const S3_ACCESS_KEY = customFields.s3_access_key;
  const S3_SECRET_KEY = customFields.s3_secret_key;
  
  const urlBase = 'https://www.hydroshare.org/hsapi';

  /* ─────────── helpers ─────────── */
  const countWords = (str) => str.trim().split(/\s+/).filter(Boolean).length;

  const handleCoveragesChange       = useCallback((covs)    => setCoverages(covs || []), []);
  const handleFundingAgenciesChange = useCallback((agencies)=> setFundingAgencies(agencies), []);

  
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setProgressMessage('');
    setResourceUrl('');

    /* ⚠ validation */
    if (!username || !password)     { setError('Username and password are required.'); return; }
    if (!title.trim())              { setError('Title is required.');               return; }
    if (countWords(abstract) < 150) { setError('Abstract must be at least 150 words.'); return; }
    if (!keywords.trim())           { setError('At least one keyword is required.');  return; }

    const validAgencies = fundingAgencies.filter(
      (fa) =>
        fa.agency_name.trim() &&
        fa.award_title.trim() &&
        fa.award_number.trim() &&
        fa.agency_url.trim(),
    );
    if (!validAgencies.length) {
      setError('At least one complete funding agency entry is required.');
      return;
    }

    /* 0️⃣ — if an icon file was supplied, upload to S3 first */
    let imageUrl = null;
    if (iconFile) {
      try {
        const ext      = iconFile.name.split('.').pop();        // crude extension
        const uuidName = `${crypto.randomUUID()}.${ext}`;       // e.g. f81d4fae-7dec-11d0-a765-00a0c91e6bf6.png
        const renamed  = new File([iconFile], uuidName, { type: iconFile.type });

        await uploadFileToS3Cucket(
          S3_BUCKET,
          REGION,
          S3_ACCESS_KEY,
          S3_SECRET_KEY,
          renamed,
        );

        imageUrl = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${uuidName}`;
      } catch (err) {
        setError(`S3 upload failed: ${err.message}`);
        return;
      }
    }

    /* 1️⃣  keywords array */
    const keywordArr = keywords
      .split(/[,\s]+/)
      .map((k) => k.trim())
      .filter(Boolean);
    if (!keywordArr.includes(keywordToAdd)) keywordArr.push(keywordToAdd);

    /* 2️⃣  coverages & extra_metadata */
    const metadataJson = JSON.stringify([...coverages]);

    const extraMetaObj = {};
    if (inputUrl.trim()) extraMetaObj.resource_url = inputUrl.trim();
    if (imageUrl)        extraMetaObj.image_url    = imageUrl;

    const extraMetaJson = Object.keys(extraMetaObj).length
      ? JSON.stringify(extraMetaObj)
      : '{}';

    /* 3️⃣  build multipart form */
    const formData = new FormData();
    formData.append('resource_type', resourceType);
    formData.append('title',         title.trim());
    formData.append('abstract',      abstract.trim());
    keywordArr.forEach((kw, i) => formData.append(`keywords[${i}]`, kw));
    formData.append('metadata',       metadataJson);
    formData.append('extra_metadata', extraMetaJson);

    const authString = btoa(`${username}:${password}`);

    /* ─── HydroShare request chain ─── */
    setLoading(true);
    try {
      /* 4️⃣  create resource */
      const postResp = await fetch(`${urlBase}/resource/`, {
        method:  'POST',
        headers: { Authorization: `Basic ${authString}` },
        body:    formData,
      });
      if (!postResp.ok)
        throw new Error(await postResp.text() || `Server error ${postResp.status}`);

      const { resource_id: resourceId } = await postResp.json();
      if (!resourceId) throw new Error('No resource ID returned');
      setProgressMessage(`Resource created (ID: ${resourceId})`);

      /* 5️⃣  funding agencies */
      const sciResp = await fetch(
        `${urlBase}/resource/${resourceId}/scimeta/elements/`,
        {
          method:  'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization:  `Basic ${authString}`,
          },
          body: JSON.stringify({ funding_agencies: validAgencies }),
        },
      );
      if (sciResp.status !== 202)
        throw new Error(`Updating science metadata failed (HTTP ${sciResp.status})`);
      setProgressMessage('Funding agencies updated');

      /* 6️⃣  files (always metadata.json + optional user files) */
      const metadataBlob = new Blob(
        [JSON.stringify({ name: title.trim() })],
        { type: 'application/json' },
      );
      const allFiles = [
        ...files,
        new File([metadataBlob], 'metadata.json', { type: 'application/json' }),
      ];

      for (const f of allFiles) {
        const fd = new FormData(); fd.append('file', f);
        const fResp = await fetch(
          `${urlBase}/resource/${resourceId}/files/`,
          { method: 'POST', headers: { Authorization: `Basic ${authString}` }, body: fd },
        );
        if (!fResp.ok)
          throw new Error(`Uploading file ${f.name} failed (HTTP ${fResp.status})`);
        setProgressMessage(`Uploaded file: ${f.name}`);
      }

      /* 7️⃣  make public (optional) */
      if (makePublic) {
        const pubResp = await fetch(
          `${urlBase}/resource/accessRules/${resourceId}/`,
          {
            method:  'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization:  `Basic ${authString}`,
            },
            body: JSON.stringify({ public: true }),
          },
        );
        if (pubResp.status !== 200)
          throw new Error(`Setting access rules failed (HTTP ${pubResp.status})`);
        setProgressMessage('Resource made public');
      }

      /* 8️⃣  custom scimeta only if no related URL was supplied */
      const hsUrl = `https://www.hydroshare.org/resource/${resourceId}`;
      setResourceUrl(hsUrl);

      if (!inputUrl.trim()) {
        const customResp = await fetch(
          `${urlBase}/resource/${resourceId}/scimeta/custom/`,
          {
            method:  'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization:  `Basic ${authString}`,
            },
            body: JSON.stringify({ url: hsUrl }),
          },
        );
        if (!customResp.ok)
          throw new Error(`Custom metadata failed (HTTP ${customResp.status})`);
      }

      setProgressMessage('Resource created successfully! Visit your resource ');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      {error && <div className={styles.errorMessage}>{error}</div>}

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Credentials */}
        <label className={styles.label}>
          HydroShare Username:
          <input
            className={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label className={styles.label}>
          HydroShare Password:
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            
          />
        </label>

        
        <label className={styles.label}>
          {getTypeString(typeContribution)} Title (required):
          <input
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            
          />
        </label>

        <label className={styles.label}>
          {getTypeString(typeContribution)} URL (optional):
          <input
            className={styles.input}
            type="url"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
          />
        </label>

        <UploadDataS3 
          onChange={setIconFile} 
        />

        <label className={styles.label}>
          {getTypeString(typeContribution)} Description (≥150 words):
          <textarea
            className={styles.textarea}
            rows={5}
            value={abstract}
            onChange={(e) => setAbstract(e.target.value)}
          />
        </label>

        <label className={styles.label}>
          Keywords (comma or space separated):
          <input
            className={styles.input}
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="e.g. model HPC weather"
          />
        </label>

        {/* File upload for HydroShare */}
        {resourceType !== 'ToolResource' && (
          <label className={styles.label}>
            Attach Files:
            <input
              className={styles.input}
              type="file"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files))}
            />
          </label>
        )}

        {/* Nested metadata & icon uploader */}
        {/* <CoveragesInput       onChange={handleCoveragesChange} /> */}
        {/* <FundingAgenciesInput onChange={handleFundingAgenciesChange} /> */}

        <button
          type="submit"
          className={clsx(styles.button, styles.buttonPrimary)}
          disabled={loading}
        >
          {loading ? 'Processing…' : 'Create Resource'}
        </button>
      </form>

      {progressMessage && (
        <div className={styles.progressMessage}>
          {loading && <FaSpinner className={styles.spinner} />}
          <span>
            {progressMessage}
            {!loading && resourceUrl && (
              <>
                <a href={resourceUrl} target="_blank" rel="noopener noreferrer">
                  here
                </a>
              </>
            )}
          </span>
        </div>
      )}
    </div>
  );
}
