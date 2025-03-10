import React, { useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import CoveragesInput from './CoveragesInput';
import styles from './HydroShareResourceCreator.module.css';

export default function HydroShareResourceCreator() {
  // ----- Resource Creation Form Fields -----
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [keywords, setKeywords] = useState('');
  
  // ----- Funding Agency Fields as an Array -----
  const [fundingAgencies, setFundingAgencies] = useState([
    { agency_name: '', award_title: '', award_number: '', agency_url: '' },
  ]);
  
  // ----- Coverages State from CoveragesInput -----
  const [coverages, setCoverages] = useState([]);
  
  // ----- UI Feedback State -----
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const urlBase = 'https://www.hydroshare.org/hsapi';
  
  // Utility: Count words in abstract
  const countWords = (str) => str.trim().split(/\s+/).filter(Boolean).length;
  
  // Handler to update a funding agency at given index
  const updateFundingAgency = (index, field, value) => {
    const newAgencies = [...fundingAgencies];
    newAgencies[index][field] = value;
    setFundingAgencies(newAgencies);
  };
  
  // Handler to add a new funding agency entry
  const addFundingAgency = () => {
    setFundingAgencies([
      ...fundingAgencies,
      { agency_name: '', award_title: '', award_number: '', agency_url: '' },
    ]);
  };
  
  // Handler to remove a funding agency entry by index
  const removeFundingAgency = (index) => {
    if (fundingAgencies.length > 1) {
      const newAgencies = fundingAgencies.filter((_, i) => i !== index);
      setFundingAgencies(newAgencies);
    }
  };
  
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
  
    // ----- Basic Validation -----
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
  
    // ----- Prepare Keywords -----
    const keywordArr = keywords
      .split(/[,\s]+/)
      .map((k) => k.trim())
      .filter((k) => k);
    if (!keywordArr.includes('nwm_data_ciroh')) {
      keywordArr.push('nwm_data_ciroh');
    }
  
    // ----- Prepare Metadata for Resource Creation -----
    // Instead of hardcoding coverage, use coverages from the CoveragesInput component.
    const metadataArray = [...coverages];
    const metadataJson = JSON.stringify(metadataArray);
  
    // ----- Build the FormData for the POST Request -----
    const formData = new FormData();
    formData.append('resource_type', 'ToolResource');
    formData.append('title', title.trim());
    formData.append('abstract', abstract.trim());
    keywordArr.forEach((kw, i) => {
      formData.append(`keywords[${i}]`, kw);
    });
    formData.append('metadata', metadataJson);
    formData.append('extra_metadata', '{}');
  
    // ----- Prepare Basic Auth Header -----
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
  
      // Notify the user with the resource URL
      const resourceUrl = `https://www.hydroshare.org/resource/${resourceId}`;
      setSuccess(`Resource created successfully! ID: ${resourceId}. You can view it here: ${resourceUrl}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Create a HydroShare Resource</h2>
      {error && <div className={styles.errorMessage}>{error}</div>}
      {success && <div className={styles.successMessage}>{success}</div>}
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
            placeholder="Provide a detailed abstract"
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
  
        {/* Coverages Section */}
        <CoveragesInput onChange={(covs) => setCoverages(covs || [])} />
  
        {/* Funding Agency Fields */}
        <div className={styles.fundingAgencyHeaderContainer}>
          <h3 className={styles.fundingAgencyHeader}>Funding Agencies</h3>
          <button type="button" className={styles.addButton} onClick={addFundingAgency}>
            <FaPlus className={styles.addIcon} />
          </button>
        </div>
        {fundingAgencies.map((agency, index) => (
          <div key={index} className={styles.fundingAgencyCard}>
            <button
              type="button"
              className={styles.removeIcon}
              onClick={() => removeFundingAgency(index)}
            >
              <FaTrash />
            </button>
            <label className={styles.label}>
              Agency Name:
              <input
                className={styles.input}
                value={agency.agency_name}
                onChange={(e) => updateFundingAgency(index, 'agency_name', e.target.value)}
                placeholder="e.g. National Science Foundation"
              />
            </label>
            <label className={styles.label}>
              Award Title:
              <input
                className={styles.input}
                value={agency.award_title}
                onChange={(e) => updateFundingAgency(index, 'award_title', e.target.value)}
                placeholder="e.g. Model Execution Cyberinfrastructure"
              />
            </label>
            <label className={styles.label}>
              Award Number:
              <input
                className={styles.input}
                value={agency.award_number}
                onChange={(e) => updateFundingAgency(index, 'award_number', e.target.value)}
                placeholder="e.g. NSF_9087658_2017"
              />
            </label>
            <label className={styles.label}>
              Agency URL:
              <input
                className={styles.input}
                type="url"
                value={agency.agency_url}
                onChange={(e) => updateFundingAgency(index, 'agency_url', e.target.value)}
                placeholder="http://www.nsf.gov"
              />
            </label>
          </div>
        ))}
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Processing...' : 'Create Resource'}
        </button>
      </form>
    </div>
  );
}
