/* HydroShareResourceCreator.jsx */
import React, { useState, useCallback, useContext, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { AuthContext } from 'react-oauth2-code-pkce';

import CoveragesInput       from './CoveragesInput';
import FundingAgenciesInput from './FundingAgenciesInput';
import UploadDataS3         from './UploadDataS3';
import HydroShareAuthButton from '@site/src/components/HydroShareAuth';
import { uploadFileToS3Bucket } from './utils';
import styles from './HydroShareResourceCreator.module.css';

const getTypeString = (type) => {
  switch (type) {
    case 'app':          return 'Application';
    case 'dataset':      return 'Dataset';
    case 'presentation': return 'Presentation';
    case 'course':       return 'Course';
    default:             return 'Contribution';
  }
};

export default function HydroShareResourceCreator({
  resourceType     = 'ToolResource',
  keywordToAdd     = 'nwm_portal_app',
  typeContribution = 'app',
}) {
  /* ─────────── OAuth2 (HydroShare) ─────────── */
  // Provided by react-oauth2-code-pkce <AuthProvider />
  const { token, logIn, loginInProgress } = useContext(AuthContext);

  /* ─────────── state (NO username/password) ─────────── */
  const [title,    setTitle]    = useState('');
  const [abstract, setAbstract] = useState('');
  const [keywords, setKeywords] = useState('');
  const [inputUrl, setInputUrl] = useState('');  // page / landing-page URL
  const [docsUrl,  setDocsUrl]  = useState('');  // documentation URL (apps/datasets only)

  const [fundingAgencies, setFundingAgencies] = useState([]);
  const [coverages,       setCoverages]       = useState([]);

  const [files,     setFiles]     = useState([]);   // HydroShare files
  const [iconFile,  setIconFile]  = useState(null); // icon uploaded to S3
  const [presPath,  setPresPath]  = useState('');   // presentation file path (must be in files[])
  const [visibility, setVisibility] = useState('public');

  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState('');
  const [progressMessage, setProgressMessage] = useState('');
  const [resourceUrl,     setResourceUrl]     = useState('');

  /* S3 credentials from docusaurus.config.js */
  const { siteConfig: { customFields } } = useDocusaurusContext();
  const S3_BUCKET     = customFields.s3_bucket;
  const REGION        = customFields.s3_region;
  const S3_ACCESS_KEY = customFields.s3_access_key;
  const S3_SECRET_KEY = customFields.s3_secret_key;

  const urlBase = 'https://www.hydroshare.org/hsapi';

  /* ─────────── button text logic ─────────── */
  const getSubmitButtonText = () => {
    if (loading) return 'Processing…';
    if (!token) return 'Authenticate with HydroShare';
    return `Create ${getTypeString(typeContribution)}`;
  };

  /* ─────────── form state persistence ─────────── */
  const FORM_STATE_KEY = `hydroshare-form-${typeContribution}`;
  const AUTH_PENDING_KEY = `hydroshare-auth-pending-${typeContribution}`;

  const saveFormState = () => {
    const formState = {
      title,
      abstract,
      keywords,
      inputUrl,
      docsUrl,
      presPath,
      visibility,
      timestamp: Date.now()
    };
    localStorage.setItem(FORM_STATE_KEY, JSON.stringify(formState));
  };

  const saveCurrentTab = () => {
    // Save the current tab from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const currentTab = urlParams.get('current-contribution') || typeContribution;
    console.log(`Saving current tab for restoration: ${currentTab}`);
    localStorage.setItem('hydroshare-last-tab', currentTab);
  };

  const markAuthenticationPending = () => {
    localStorage.setItem(AUTH_PENDING_KEY, Date.now().toString());
  };

  const isReturningFromAuth = () => {
    const authPendingTime = localStorage.getItem(AUTH_PENDING_KEY);
    if (authPendingTime) {
      const timeDiff = Date.now() - parseInt(authPendingTime);
      // Consider it a return from auth if less than 10 minutes and we now have a token
      return timeDiff < 10 * 60 * 1000 && token;
    }
    return false;
  };

  const clearAuthPending = () => {
    localStorage.removeItem(AUTH_PENDING_KEY);
  };

  const loadFormState = () => {
    try {
      const saved = localStorage.getItem(FORM_STATE_KEY);
      if (saved) {
        const formState = JSON.parse(saved);
        // Only restore if saved within last 30 minutes
        if (Date.now() - formState.timestamp < 30 * 60 * 1000) {
          setTitle(formState.title || '');
          setAbstract(formState.abstract || '');
          setKeywords(formState.keywords || '');
          setInputUrl(formState.inputUrl || '');
          setDocsUrl(formState.docsUrl || '');
          setPresPath(formState.presPath || '');
          setVisibility(formState.visibility || 'public');
          return true; // Indicates state was restored
        }
      }
    } catch (error) {
      console.warn('Failed to restore form state:', error);
    }
    return false;
  };

  const clearFormState = () => {
    localStorage.removeItem(FORM_STATE_KEY);
  };

  const setFilesArray = (e) => {
    // Sanitize file names before storing
    const sanitizedFiles = Array.from(e.target.files).map(file => {
      const sanitizedName = sanitizeFileName(file.name);
      return new File([file], sanitizedName, { type: file.type });
    });
    
    setFiles(sanitizedFiles);

    if (typeContribution === 'presentation' && e.target.files.length > 0) {
      if (e.target.files[0].name.toLowerCase().endsWith('.pdf')) {
        const sanitizedFileName = sanitizeFileName(e.target.files[0].name);
        setPresPath(sanitizedFileName);
      }
    }
  };

  const sanitizeFileName = (fileName) => {
    const [name, ...extensions] = fileName.split('.');
    const extension = extensions.join('.');

    const sanitizedName = name
      .toLowerCase()                          // Convert to lowercase
      .replace(/\s+/g, '_')                  // Replace spaces with underscores
      .replace(/[^a-z0-9._-]/g, '_')         // Keep only alphanumeric, dots, underscores, hyphens
      .replace(/_{2,}/g, '_')                // Replace multiple underscores with single
      .replace(/^_+|_+$/g, '');              // Remove leading/trailing underscores

    return extension ? `${sanitizedName}.${extension}` : sanitizedName;
  };

  /* ─────────── form state management ─────────── */
  useEffect(() => {
    // Only restore form state if returning from authentication
    if (isReturningFromAuth()) {
      const restored = loadFormState();

      // Clear the auth pending flag since we've handled it
      clearAuthPending();
    }
  }, [token]); // Run when token changes

  const handleAuthenticateWithFormSave = () => {
    saveFormState();
    saveCurrentTab();
    markAuthenticationPending();
    logIn();
  };

  /* ─────────── helpers ─────────── */
  const handleCoveragesChange       = useCallback((covs)     => setCoverages(covs || []), []);
  const handleFundingAgenciesChange = useCallback((agencies) => setFundingAgencies(agencies), []);

  const FileNamesList = () => (
    <div>
      {files.map((file, i) => (
        <p className={styles.label} key={i}>⬆️ {file.name}</p>
      ))}
    </div>
  );

  /* ─────────── submit handler ─────────── */
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setProgressMessage('');
    setResourceUrl('');

    // Require OAuth token instead of username/password
    if (!token) {
      setError('Please authenticate with HydroShare first.');
      return;
    }

    // Basic validation
    if (!title.trim())               { setError('Title is required.'); return; }
    if (abstract.trim().length < 150){ setError('Abstract must be at least 150 characters.'); return; }

    const validAgencies = fundingAgencies.filter(
      (fa) =>
        fa.agency_name?.trim() &&
        fa.award_title?.trim() &&
        fa.award_number?.trim() &&
        fa.agency_url?.trim(),
    );
    if (!validAgencies.length) {
      setError('At least one complete funding agency entry is required.');
      return;
    }

    if (presPath.trim()) {
      const trimmedPath = presPath.trim();
      if (!trimmedPath.toLowerCase().endsWith('.pdf')) {
        setError('Presentation filename must be a PDF file for embedding.');
        return;
      }
      const exists = files.some(f => f.name === trimmedPath);
      if (!exists) {
        setError('Presentation filename must exist within the uploaded files.');
        return;
      }
    }

    /* 0) upload icon to S3 (if any) */
    let imageUrl = null;
    if (iconFile) {
      try {
        const ext      = iconFile.name.split('.').pop();
        const uuidName = `${crypto.randomUUID()}.${ext}`;
        const renamed  = new File([iconFile], uuidName, { type: iconFile.type });

        await uploadFileToS3Bucket(
          S3_BUCKET, REGION, S3_ACCESS_KEY, S3_SECRET_KEY, renamed
        );
        imageUrl = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${uuidName}`;
      } catch (err) {
        setError(`S3 upload failed: ${err.message}`);
        return;
      }
    }

    /* 1) keywords */
    let keywordArr = keywords
      .split(/[,\s]+/)
      .map((k) => k.trim())
      .filter(Boolean);
    if (!keywordArr.includes(keywordToAdd)) keywordArr.push(keywordToAdd);

    // remove duplicates
    keywordArr = new Set(keywordArr);
    keywordArr = Array.from(keywordArr);

    /* 2) coverages & extra_metadata */
    const metadataJson = JSON.stringify([...coverages]);

    const extraMetaObj = {};
    if (inputUrl.trim()) extraMetaObj.page_url = inputUrl.trim();
    if (imageUrl)        extraMetaObj.thumbnail_url = imageUrl;
    if (docsUrl.trim())  extraMetaObj.docs_url = docsUrl.trim();
    if (presPath.trim()) extraMetaObj.pres_path = presPath.trim();

    const extraMetaJson = Object.keys(extraMetaObj).length
      ? JSON.stringify(extraMetaObj)
      : '{}';

    /* 3) form data for create resource */
    const formData = new FormData();
    formData.append('resource_type',  resourceType);
    formData.append('title',          title.trim());
    formData.append('abstract',       abstract.trim());
    keywordArr.forEach((kw, i) => formData.append(`keywords[${i}]`, kw));
    formData.append('metadata',       metadataJson);
    formData.append('extra_metadata', extraMetaJson);

    const authHeader = { Authorization: `Bearer ${token}` }; // OAuth2 bearer (standard) :contentReference[oaicite:2]{index=2}

    setLoading(true);
    try {
      /* create resource */
      const postResp = await fetch(`${urlBase}/resource/`, {
        method:  'POST',
        headers: authHeader,
        body:    formData,
      });
      if (!postResp.ok) {
        throw new Error((await postResp.text()) || `Server error ${postResp.status}`);
      }
      const { resource_id: resourceId } = await postResp.json();
      if (!resourceId) throw new Error('No resource ID returned');
      setProgressMessage(`Resource created (ID: ${resourceId})`);

      /* funding agencies */
      const sciResp = await fetch(
        `${urlBase}/resource/${resourceId}/scimeta/elements/`,
        {
          method:  'PUT',
          headers: { ...authHeader, 'Content-Type': 'application/json' },
          body: JSON.stringify({ funding_agencies: validAgencies }),
        },
      );
      if (sciResp.status !== 202) {
        throw new Error(`Updating science metadata failed (HTTP ${sciResp.status})`);
      }
      setProgressMessage('Funding agencies updated');

      /* files */
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
          { method: 'POST', headers: authHeader, body: fd },
        );
        if (!fResp.ok) {
          throw new Error(`Uploading file ${f.name} failed (HTTP ${fResp.status})`);
        }
        setProgressMessage(`Uploaded file: ${f.name}`);
      }

      /* visibility */
      if (visibility === 'public' || visibility === 'private') {
        const makePublic = (visibility === 'public');
        const pubResp = await fetch(
          `${urlBase}/resource/accessRules/${resourceId}/`,
          {
            method:  'PUT',
            headers: { ...authHeader, 'Content-Type': 'application/json' },
            body: JSON.stringify({ public: makePublic }),
          },
        );
        if (pubResp.status !== 200) {
          throw new Error(`Setting access rules failed (HTTP ${pubResp.status})`);
        }
        setProgressMessage(`Resource made ${visibility}`);
      } else if (visibility === 'discoverable') {
        const discResp = await fetch(
          `${urlBase}/resource/${resourceId}/flag/`,
          {
            method: 'POST',
            headers: { ...authHeader, 'Content-Type': 'application/json' },
            body: JSON.stringify({ flag: 'make_discoverable' }),
          },
        );
        if (discResp.status !== 202) {
          throw new Error(`Setting access rules failed (HTTP ${discResp.status})`);
        }
        const privLinkResp = await fetch(
          `${urlBase}/resource/${resourceId}/flag/`,
          {
            method: 'POST',
            headers: { ...authHeader, 'Content-Type': 'application/json' },
            body: JSON.stringify({ flag: 'enable_private_sharing_link' }),
          },
        );
        if (privLinkResp.status !== 202) {
          throw new Error(`Setting access rules failed (HTTP ${privLinkResp.status})`);
        }
        setProgressMessage('Resource made discoverable with private link sharing enabled');
      } else {
        setProgressMessage('Invalid visibility setting, skipping…');
      }

      /* final link */
      const hsUrl = `https://www.hydroshare.org/resource/${resourceId}`;
      setResourceUrl(hsUrl);

      /* add self URL to custom scimeta if no link was supplied */
      if (!inputUrl.trim()) {
        const obj = { ...extraMetaObj, url: hsUrl };
        await fetch(`${urlBase}/resource/${resourceId}/scimeta/custom/`, {
          method:  'POST',
          headers: { ...authHeader, 'Content-Type': 'application/json' },
          body: JSON.stringify(obj),
        });
      }

      setProgressMessage(`Resource created successfully! Visit your ${typeContribution} `);
      
      // Clear saved form state on successful submission
      clearFormState();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  /* ─────────── UI ─────────── */
  // User is authenticated with HydroShare
  if (token)
  {
  return (
    <div className={styles.container}>
      {/* 0) HydroShare login button (shows “Authenticated” when already logged in) */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'none' }}>
          <HydroShareAuthButton />
        </div>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Title & URLs */}
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

        {/* Icon (S3) */}
        <UploadDataS3 title="Thumbnail" acceptType="image/*" onChange={setIconFile} />

        {/* Abstract */}
        <label className={`${styles.label} required`}>
          {getTypeString(typeContribution)} Description (≥150 characters)
          <textarea
            className={styles.textarea}
            rows={5}
            value={abstract}
            onChange={(e) => setAbstract(e.target.value)}
          />
        </label>

        {/* Keywords */}
        <label className={styles.label}>
          Keywords (comma or space separated)
          <input
            className={styles.input}
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="e.g. model HPC weather"
          />
        </label>

        {/* File upload (all but app) */}
        {typeContribution !== 'app' && (
          <div className={styles.inputFileDiv}>
            <p className={styles.label}>Attach Files</p>
            <label className={styles.label}>
              🗃️ Upload files
              <input
                className={styles.inputFile}
                type="file"
                multiple={typeContribution !== 'presentation'}
                onChange={(e) => setFilesArray(e)}
              />
            </label>
            <FileNamesList />
          </div>
        )}

        {/* Visibility */}
        <label className={styles.label}>
          Visibility
          <select
            className={styles.input}
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          >
            <option value="public">Public (recommended)</option>
            <option value="discoverable">Discoverable</option>
            <option value="private">Private</option>
          </select>
          {visibility === 'private' && (
            <i>Note: Private resources will not appear on CIROH Portal until they are made public or discoverable.</i>
          )}
        </label>

        {/* hidden advanced editors */}
        <div style={{ display: 'none' }}>
          <CoveragesInput       onChange={handleCoveragesChange} />
          <FundingAgenciesInput onChange={handleFundingAgenciesChange} />
        </div>

        {/* Submit */}
        <br className={styles.sectionDivider} />
        <button
          type={!token ? "button" : "submit"}
          className={clsx(styles.button, styles.buttonPrimary)}
          disabled={loading || loginInProgress}
          onClick={!token ? handleAuthenticateWithFormSave : undefined}
          title={!token ? 'Click to authenticate with HydroShare' : undefined}
        >
          {getSubmitButtonText()}
          {token ? ''
          :
          <img className={styles.logoAuth} id="img-brand-logo" src="https://storage.googleapis.com/hydroshare-prod-static-media/static/img/logo-lg.cf4395806c8e.png" alt="CUAHSI HydroShare"></img>
          }
        </button>
      </form>

      {/* Feedback */}
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
                    visibility === 'private'
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
  // User is NOT authenticated with HydroShare
  else
  {
    return (
      <div className={styles.container}>

        <div className={styles.form}>
          <p>Login to HydroShare to add a {getTypeString(typeContribution)} resource.</p>
          <button
            type="button"
            className={clsx(styles.button, styles.buttonPrimary)}
            disabled={loginInProgress}
            onClick={handleAuthenticateWithFormSave}
            title="Click to authenticate with HydroShare"
          >
            {loginInProgress ? 'Redirecting…' : 'Authenticate with HydroShare'}
            <img className={styles.logoAuth} id="img-brand-logo" src="https://storage.googleapis.com/hydroshare-prod-static-media/static/img/logo-lg.cf4395806c8e.png" alt="Authenticate with HydroShare"></img>
          </button>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}
      </div>
    );
  }
}