import React, { useState, useCallback } from 'react';
import { FaSpinner } from 'react-icons/fa';
import CoveragesInput from './CoveragesInput';
import FundingAgenciesInput from './FundingAgenciesInput';
import styles from './HydroShareResourceCreator.module.css';
import clsx from 'clsx';

export default function HydroShareResourceCreator({
  resourceType = "ToolResource",
  makePublic = false,
  keywordToAdd = "nwm_portal_app",
}) {
  // Credentials
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Resource Info
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [keywords, setKeywords] = useState('');

  // Funding Agencies state from FundingAgenciesInput component
  const [fundingAgencies, setFundingAgencies] = useState([]);

  // Coverages state from CoveragesInput
  const [coverages, setCoverages] = useState([]);

  // Files state for uploaded files
  const [files, setFiles] = useState([]);

  // UI Feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Instead of a list of progress messages, we keep a single message.
  const [progressMessage, setProgressMessage] = useState('');
  // Once complete, store the final resource URL.
  const [resourceUrl, setResourceUrl] = useState('');

  const urlBase = 'https://www.hydroshare.org/hsapi';

  // Utility: Count words in abstract
  const countWords = (str) =>
    str.trim().split(/\s+/).filter(Boolean).length;

  // Memoize callbacks to avoid recreating them on every render.
  const handleCoveragesChange = useCallback((covs) => {
    setCoverages(covs || []);
  }, []);

  const handleFundingAgenciesChange = useCallback((agencies) => {
    setFundingAgencies(agencies);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setProgressMessage('');
    setResourceUrl('');

    // Basic Validation
    if (!username || !password) {
      setError('Username and password are required.');
      return;
    }
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (countWords(abstract) < 150) {
      setError('Abstract must be at least 150 words.');
      return;
    }
    if (!keywords.trim()) {
      setError('At least one keyword is required.');
      return;
    }
    // Validate funding agencies
    const validAgencies = fundingAgencies.filter(
      (fa) =>
        fa.agency_name.trim() &&
        fa.award_title.trim() &&
        fa.award_number.trim() &&
        fa.agency_url.trim()
    );
    if (validAgencies.length === 0) {
      setError('At least one complete funding agency entry is required.');
      return;
    }

    // Prepare Keywords
    const keywordArr = keywords
      .split(/[,\s]+/)
      .map((k) => k.trim())
      .filter((k) => k);
    if (!keywordArr.includes(keywordToAdd)) {
      keywordArr.push(keywordToAdd);
    }

    // Prepare Metadata for Resource Creation (coverages)
    const metadataArray = [...coverages];
    const metadataJson = JSON.stringify(metadataArray);

    // Build the FormData for the POST Request to create the resource.
    const formData = new FormData();
    formData.append('resource_type', resourceType);
    formData.append('title', title.trim());
    formData.append('abstract', abstract.trim());
    keywordArr.forEach((kw, i) => {
      formData.append(`keywords[${i}]`, kw);
    });
    formData.append('metadata', metadataJson);
    formData.append('extra_metadata', '{}');

    // Prepare Basic Auth Header
    const authString = btoa(`${username}:${password}`);

    setLoading(true);
    try {
      // POST: Create the resource
      const postResp = await fetch(`${urlBase}/resource/`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${authString}`,
        },
        body: formData,
      });
      if (!postResp.ok) {
        const text = await postResp.text();
        throw new Error(text || `Server error ${postResp.status}`);
      }
      const postResult = await postResp.json();
      const resourceId = postResult.resource_id;
      if (!resourceId) {
        throw new Error('No resource ID returned');
      }
      setProgressMessage(`Resource created (ID: ${resourceId})`);

      // PUT: Update Science Metadata with Funding Agencies
      const scienceMetadata = {
        funding_agencies: validAgencies,
      };
      const putMetaResp = await fetch(
        `${urlBase}/resource/${resourceId}/scimeta/elements/`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${authString}`,
          },
          body: JSON.stringify(scienceMetadata),
        }
      );
      if (putMetaResp.status !== 202) {
        const errText = await putMetaResp.text();
        throw new Error(
          `Updating science metadata failed: HTTP ${putMetaResp.status} - ${errText}`
        );
      }
      setProgressMessage('Funding agencies updated');

      // Upload files one at a time using the endpoint POST /resource/{id}/files/
      if (files.length > 0) {
        for (const file of files) {
          const fileFormData = new FormData();
          fileFormData.append('file', file);
          const fileResp = await fetch(
            `${urlBase}/resource/${resourceId}/files/`,
            {
              method: 'POST',
              headers: {
                Authorization: `Basic ${authString}`,
              },
              body: fileFormData,
            }
          );
          if (!fileResp.ok) {
            const errText = await fileResp.text();
            throw new Error(
              `Uploading file ${file.name} failed: HTTP ${fileResp.status} - ${errText}`
            );
          }
          setProgressMessage(`Uploaded file: ${file.name}`);
        }
      }

      // If the makePublic prop is true, call the access rules endpoint.
      if (makePublic) {
        const putAccessResp = await fetch(
          `${urlBase}/resource/accessRules/${resourceId}/`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Basic ${authString}`,
            },
            body: JSON.stringify({ public: true }),
          }
        );
        if (putAccessResp.status !== 200) {
          const errText = await putAccessResp.text();
          throw new Error(
            `Setting access rules failed: HTTP ${putAccessResp.status} - ${errText}`
          );
        }
        setProgressMessage('Resource made public');
      }

      // Final success message with resource URL
      const resourceUrl = `https://www.hydroshare.org/resource/${resourceId}`;
      setResourceUrl(resourceUrl);
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
          Username:
          <input
            className={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="HydroShare username"
          />
        </label>
        <label className={styles.label}>
          Password:
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="HydroShare password"
          />
        </label>
        {/* Resource Info */}
        <label className={styles.label}>
          Title (required):
          <input
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Resource title"
          />
        </label>
        <label className={styles.label}>
          Abstract (≥150 words):
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
          <small className={styles.hint}>
            "nwm_data_ciroh" is auto-added if missing
          </small>
        </label>

        {/* File Upload */}
        <label className={styles.label}>
          Attach Files:
          <input
            className={styles.input}
            type="file"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files))}
          />
        </label>

        {/* Coverages Section */}
        <CoveragesInput onChange={handleCoveragesChange} />

        {/* Funding Agencies Section */}
        <FundingAgenciesInput onChange={handleFundingAgenciesChange} />

        <button
          type="submit"
          className={clsx(styles.button, styles.buttonPrimary)}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Create Resource'}
        </button>
      </form>

      {progressMessage && (
        <div className={styles.progressMessage}>
          {loading && (
            <FaSpinner className={styles.spinner} />
          )}
          <span>
            {progressMessage}
            {!loading && resourceUrl && (
              <>
                <a
                  href={resourceUrl}
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
    </div>
  );
}
