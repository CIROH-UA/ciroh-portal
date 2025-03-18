import React, { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import styles from './PublicationsImporter.module.css';
import clsx from 'clsx';
import api from 'zotero-api-client';

export default function PublicationsImporter({ apiKey, groupId }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [progressMessage, setProgressMessage] = useState('');
  const [citationUrl, setCitationUrl] = useState('');
  const [error, setError] = useState('');

  // Wikimedia REST API base (using the official REST endpoint)
  const wikimediaBaseUrl = 'https://en.wikipedia.org/api/rest_v1';
  // Use AllOrigins proxy to bypass CORS issues.
  const corsProxyUrl = 'https://api.allorigins.win/get?url=';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setProgressMessage('');
    setCitationUrl('');
    
    if (!query.trim()) {
      setError('Please enter an article identifier (URL, DOI, PMID, etc.).');
      return;
    }
    
    setLoading(true);
    try {
      setProgressMessage('Fetching citation data...');
      const encodedQuery = encodeURIComponent(query.trim());
      const targetUrl = `${wikimediaBaseUrl}/data/citation/zotero/${encodedQuery}`;
      const resp = await fetch(corsProxyUrl + encodeURIComponent(targetUrl));
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || `Error fetching citation data: ${resp.status}`);
      }
      const proxyData = await resp.json();
      // AllOrigins returns a JSON with a 'contents' property containing the fetched content.
      const citationData = JSON.parse(proxyData.contents);
      console.log(citationData);
      setProgressMessage('Citation data fetched. Importing citation...');
      
      // Call the Zotero API client to import the citation.
      const importedUrl = await importCitation(citationData, apiKey, groupId);
      
      setCitationUrl(importedUrl);
      setProgressMessage('Citation imported successfully! Visit your citation ');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Import the citation using the Zotero API client.
  async function importCitation(citationData, apiKey, groupId) {
    // Initialize the client with your API key and configure for the group library.
    const zotero = api(apiKey).library('group', groupId);
    // Use the post() execution function to create the new item.
    // The API expects an array of entities.
    const response = await zotero.items().post(citationData);
    const createdItems = response.getData(); // returns an array
    const itemKey = createdItems[0].key; // get the key of the first created item
    return `https://www.zotero.org/groups/${groupId}/items/${itemKey}`;
  }

  return (
    <div className={styles.container}>
      {error && <div className={styles.errorMessage}>{error}</div>}
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>
          Article Identifier:
          <input
            type="text"
            className={styles.input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter URL, DOI, PMID, etc."
          />
        </label>
        <button 
          type="submit" 
          className={clsx(
            'button',
            styles.button,
            styles.buttonPrimary
          )}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Import Citation'}
        </button>
      </form>
      {progressMessage && (
        <div className={styles.progressMessage}>
          {loading && <FaSpinner className={styles.spinner} />}
          <span>
            {progressMessage}
            {!loading && citationUrl && (
              <a href={citationUrl} target="_blank" rel="noopener noreferrer">
                here
              </a>
            )}
          </span>
        </div>
      )}
    </div>
  );
}
