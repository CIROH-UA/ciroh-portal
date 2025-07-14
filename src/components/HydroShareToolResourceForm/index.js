/* HydroShareResourceCreator.jsx */
import React, { useState, useCallback } from 'react';
import { FaSpinner } from 'react-icons/fa';
import CoveragesInput        from './CoveragesInput';
import FundingAgenciesInput  from './FundingAgenciesInput';
import UploadDataS3          from './UploadDataS3';
import styles                from './HydroShareResourceCreator.module.css';
import clsx                  from 'clsx';

import { uploadFileToS3Bucket } from './utils';
import useDocusaurusContext     from '@docusaurus/useDocusaurusContext';

const getTypeString = (type) => {
  switch (type) {
    case 'app':     return 'Application';
    case 'dataset': return 'Dataset';
    case 'presentation': return 'Presentation';
    case 'course':  return 'Course';
    default:        return 'Contribution';
  }
};

export default function HydroShareResourceCreator({
  resourceType      = 'ToolResource',
  makePublic        = false,
  keywordToAdd      = 'nwm_portal_app',
  typeContribution  = 'app',
}) {
  /* ───────────────────────── state ───────────────────────── */
  const [username, setUsername]     = useState('');
  const [password, setPassword]     = useState('');

  const [title,    setTitle]        = useState('');
  const [abstract, setAbstract]     = useState('');
  const [keywords, setKeywords]     = useState('');
  const [inputUrl, setInputUrl]     = useState('');   // page / landing-page URL
  const [docsUrl,  setDocsUrl]      = useState('');   // documentation URL (apps/datasets only)

  const [fundingAgencies, setFundingAgencies] = useState([]);
  const [coverages,       setCoverages]       = useState([]);

  const [files,     setFiles]     = useState([]);     // HydroShare files
  const [iconFile,  setIconFile]  = useState(null);   // icon uploaded to S3
  const [presPath,  setPresPath]  = useState('');     // Path for presentation embed on HydroShare
  const [visibility, setVisibility] = useState('public'); // HydroShare visibility setting

  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState('');
  const [progressMessage, setProgressMessage] = useState('');
  const [resourceUrl,     setResourceUrl]     = useState('');

  /* S3 credentials from docusaurus.config.js ----------------------- */
  const {
    siteConfig: { customFields },
  } = useDocusaurusContext();
  const S3_BUCKET     = customFields.s3_bucket;
  const REGION        = customFields.s3_region;
  const S3_ACCESS_KEY = customFields.s3_access_key;
  const S3_SECRET_KEY = customFields.s3_secret_key;

  const urlBase = 'https://www.hydroshare.org/hsapi';

  /* ───────────────────────── helpers ───────────────────────── */
  const countWords = (str) => str.trim().split(/\s+/).filter(Boolean).length;

  const handleCoveragesChange       = useCallback((covs)     => setCoverages(covs || []), []);
  const handleFundingAgenciesChange = useCallback((agencies) => setFundingAgencies(agencies), []);

  const FileNamesList = () => {
    const list = files.map((file, index) => (
      <p className={styles.label} key={index}>⬆️ {file.name}</p>
    ));
    return <div>{list}</div>;
  }

  /* ──────────────────────── submit handler ─────────────────────── */
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setProgressMessage('');
    setResourceUrl('');

    /* validation --------------------------------------------------- */

    if (!username || !password)     { setError('Username and password are required.'); return; }
    if (!title.trim())              { setError('Title is required.');                 return; }
    if (abstract.trim().length < 150) { setError('Abstract must be at least 150 characters.'); return; }

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

    if (presPath.trim()) { // If presentation path is present...
      let trimmedPath = presPath.trim();
      let pathLen = trimmedPath.length;

      // Ensure path corresponds to a PDF
      if (pathLen < 4 || trimmedPath.substring(pathLen-4) != ".pdf") {
        setError("Presentation filename must be a PDF file for embedding.");
        return;
      }

      // Ensure path corresponds to a real file
      let presPathValid = false;
      files.forEach(f => {
        if (f.name === presPath.trim()) presPathValid = true;
      })
      if (!presPathValid) {
        setError("Presentation filename must exist within the uploaded files.");
        return;
      }
    }

    /* 0️⃣ — upload icon to S3 (if any) ---------------------------- */
    let imageUrl = null;
    if (iconFile) {
      try {
        const ext      = iconFile.name.split('.').pop();
        const uuidName = `${crypto.randomUUID()}.${ext}`;
        const renamed  = new File([iconFile], uuidName, { type: iconFile.type });

        await uploadFileToS3Bucket(
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

    /* 1️⃣ — keywords --------------------------------------------- */
    const keywordArr = keywords
      .split(/[,\s]+/)
      .map((k) => k.trim())
      .filter(Boolean);
    if (!keywordArr.includes(keywordToAdd)) keywordArr.push(keywordToAdd);

    /* 2️⃣ — coverages & extra_metadata ---------------------------- */
    const metadataJson = JSON.stringify([...coverages]);

    const extraMetaObj = {};
    if (inputUrl.trim()) extraMetaObj.page_url = inputUrl.trim();
    if (imageUrl)        extraMetaObj.thumbnail_url = imageUrl;
    if (docsUrl.trim())  extraMetaObj.docs_url      = docsUrl.trim();
    if (presPath.trim()) extraMetaObj.pres_path     = presPath.trim();

    const extraMetaJson = Object.keys(extraMetaObj).length
      ? JSON.stringify(extraMetaObj)
      : '{}';

    /* 3️⃣ — multipart form ---------------------------------------- */
    const formData = new FormData();
    formData.append('resource_type',  resourceType);
    formData.append('title',          title.trim());
    formData.append('abstract',       abstract.trim());
    keywordArr.forEach((kw, i) => formData.append(`keywords[${i}]`, kw));
    formData.append('metadata',       metadataJson);
    formData.append('extra_metadata', extraMetaJson);

    const authString = btoa(`${username}:${password}`);

    /* ─── HydroShare request chain ─── */
    setLoading(true);
    try {
      /* create resource */
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

      /* funding agencies */
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

      /* files ------------------------------------------------------ */
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

      /* Set access rules */
      if (visibility === "public" || visibility === "private") {
        const makePublic = (visibility === "public");
        const pubResp = await fetch(
          `${urlBase}/resource/accessRules/${resourceId}/`,
          {
            method:  'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization:  `Basic ${authString}`,
            },
            body: JSON.stringify({ "public": makePublic }),
          },
        );
        if (pubResp.status !== 200)
          throw new Error(`Setting access rules failed (HTTP ${pubResp.status})`);
        setProgressMessage(`Resource made ${visibility}`);
      }
      else if (visibility === "discoverable") { // TODO: not yet working
        setProgressMessage(`Resource made discoverable with private link sharing enabled`);
        const pubResp = await fetch(
          `${urlBase}/resource/accessRules/${resourceId}/`,
          {
            method:  'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization:  `Basic ${authString}`,
            },
            body: JSON.stringify({"discoverable": true, "sharable": true, "allow_private_sharing": true }),
          },
        );
        if (pubResp.status !== 200)
          throw new Error(`Setting access rules failed (HTTP ${pubResp.status})`);
      }
      else {
        setProgressMessage(`Invalid visibility setting, skipping...`)
      }

      /* final link */
      const hsUrl = `https://www.hydroshare.org/resource/${resourceId}`;
      setResourceUrl(hsUrl);

      /* add self URL as custom scimeta if user didn’t supply a link */
      if (!inputUrl.trim()) {
        extraMetaObj.url = hsUrl;
        await fetch(
          `${urlBase}/resource/${resourceId}/scimeta/custom/`,
          {
            method:  'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization:  `Basic ${authString}`,
            },
            body: JSON.stringify(extraMetaObj),
          },
        );
      }

      setProgressMessage(`Resource created successfully! Visit your ${typeContribution} `);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  /* ──────────────────────── UI  ─────────────────────── */
  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Credentials ------------------------------------------------ */}
        <label className={`${styles.label} required`}>
          HydroShare Username
          <input
            className={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label className={`${styles.label} required`}>
          HydroShare Password
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {/* Title & URLs ---------------------------------------------- */}
        <label className={`${styles.label} required`}>
          {getTypeString(typeContribution)} Title
          <input
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <label className={styles.label}>
          {getTypeString(typeContribution)} URL
          <input
            className={styles.input}
            type="url"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="https://example.org/landing-page"
          />
        </label>

        {/* Documentation URL – only for app / dataset ----------------- */}
        {(typeContribution === 'app' || typeContribution === 'dataset') && (
          <label className={styles.label}>
            Documentation URL
            <input
              className={styles.input}
              type="url"
              value={docsUrl}
              onChange={(e) => setDocsUrl(e.target.value)}
              placeholder="https://example.org/docs"
            />
          </label>
        )}

        {/* Icon (S3) -------------------------------------------------- */}
        <UploadDataS3 title="Thumbnail" acceptType="image/*" onChange={setIconFile} />

        {/* Abstract --------------------------------------------------- */}
        <label className={`${styles.label} required`}>
          {getTypeString(typeContribution)} Description (≥150 characters)
          <textarea
            className={styles.textarea}
            rows={5}
            value={abstract}
            onChange={(e) => setAbstract(e.target.value)}
          />
        </label>

        {/* Keywords --------------------------------------------------- */}
        <label className={styles.label}>
          Keywords (comma or space separated)
          <input
            className={styles.input}
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="e.g. model HPC weather"
          />
        </label>

        {/* File upload ------------------------------------------------ */}
        {typeContribution !== 'app' && (
          <div className={styles.inputFileDiv}>
            <p className={styles.label}>Attach Files</p>
            <label className={styles.label}>
              🗃️ Upload files
              <input
                className={styles.inputFile}
                type="file"
                multiple
                onChange={(e) => setFiles(Array.from(e.target.files))}
              />
            </label>
            <FileNamesList />
          </div>
        )}

        {/* Embedded presentation ----------------- */}
        {(typeContribution === 'presentation') && (
          <label className={styles.label}>
            Presentation Filename <i>(PDF only; used for embedding on Portal. Optional.)</i>
            <input
              className={styles.input}
              value={presPath}
              onChange={(e) => setPresPath(e.target.value)}
              placeholder="presentation.pdf"
            />
          </label>
        )}

        {/* Visibility settings----------------- */}
        
        <label className={styles.label}>
          Visibility
          <select
            className={styles.input}
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          >
            <option value="public">Public</option>
            {/*<option value="discoverable">Discoverable</option>*/}
            <option value="private">Private</option>
          </select>
          {(visibility === "private") && (
            <i>Note: Private resources will not appear on CIROH Portal until they are made public or discoverable.</i>
          )}
        </label>

        {/* hidden advanced editors ----------------------------------- */}
        <div style={{display: 'none'}}>
          <CoveragesInput       onChange={handleCoveragesChange} />
          <FundingAgenciesInput onChange={handleFundingAgenciesChange} />
        </div>

        {/* Submit ----------------------------------------------------- */}
        <br className={styles.sectionDivider} />
        <button
          type="submit"
          className={clsx(styles.button, styles.buttonPrimary)}
          disabled={loading}
        >
          {loading ? 'Processing…' : `Create ${getTypeString(typeContribution)}`}
        </button>
      </form>

      {/* Feedback ---------------------------------------------------- */}
      <br className={styles.sectionDivider} />

      {progressMessage && (
        <div className={styles.progressMessage}>
          {loading && <FaSpinner className={styles.spinner} />}
          <span>
            {progressMessage}
            {!loading && resourceUrl && (
              <>
                <a
                  href={
                    (visibility === "private") 
                    ? resourceUrl
                    : `/${typeContribution}s#${resourceUrl.split('/')[4]}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  here
                </a>
              </>
            )}
          </span>
        </div>
      )}

      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
}
