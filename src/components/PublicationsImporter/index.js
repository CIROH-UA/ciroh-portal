import React, { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import styles from './PublicationsImporter.module.css';
import clsx from 'clsx';
import api from 'zotero-api-client';
import useRecaptcha from '@site/src/components/Captcha/useRecaptcha';
import ReCAPTCHA from "react-google-recaptcha";
import { useColorMode } from '@docusaurus/theme-common';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function PublicationsImporter({ groupId, zoteroApiKey  }) {
  const { capchaToken, recaptchaRef, handleRecaptcha } = useRecaptcha();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [progressMessage, setProgressMessage] = useState('');
  const [citationUrl, setCitationUrl] = useState('');
  const [error, setError] = useState('');
  const { colorMode } = useColorMode();
  const {
      siteConfig: {customFields},
    } = useDocusaurusContext();

  // Wikimedia REST API base (using the official REST endpoint)
  const wikimediaBaseUrl = 'https://en.wikipedia.org/api/rest_v1';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setProgressMessage('');
    setCitationUrl('');
    
    if (!query.trim()) {
      setError('Please enter an article identifier (URL, DOI, PMID, etc.).');
      handleRecaptcha('');
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      return;
    }
    if (!validateDOI(query.trim())) {
      setError('Please enter a valid DOI.');
      handleRecaptcha('');
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      return;
    }
    if (!capchaToken){
      setError('Please complete the reCAPTCHA to proceed.');
      handleRecaptcha('');
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      return;
    }
    // if (capchaToken && query) {
    //   // Send login request with captcha token, username, and password
    //   console.log("great!")
      
    // }
    setLoading(true);
    try {
      setProgressMessage('Fetching citation data...');
      const encodedQuery = encodeURIComponent('https://doi.org/' + query.trim());
      const targetUrl = `${wikimediaBaseUrl}/data/citation/zotero/${encodedQuery}`;
      const resp = await fetch(targetUrl);
      if (!resp.ok) {
        const text = await resp.text();
        const status = resp.status;

        // Get a user friendly error message
        let userFriendlyMessage = 'Error fetching citation data: ';

        if (status === 404) {
          userFriendlyMessage += 'No citation data found for the provided identifier. Please check your input and try again.';
        } else if (status === 500) {
          userFriendlyMessage += 'The server encountered an error. Please try again later.';
        } else if (status >= 400 && status < 500) {
          userFriendlyMessage += 'There was an issue with your request. Please verify your input and try again.';
        } else if (status >= 500) {
          userFriendlyMessage += 'The server is currently unavailable. Please try again later.';
        }
        recaptchaRef.current?.reset();

        throw new Error(userFriendlyMessage || text || `Error fetching citation data: ${resp.status}`);
      }
      const citationData = await resp.json();

      setProgressMessage('Citation data fetched. Importing citation...');
      
      // Call the Zotero API client to import the citation.
      const importedUrl = await importCitation(citationData, zoteroApiKey, groupId);
      
      setCitationUrl(importedUrl);
      setProgressMessage('Citation imported successfully! Visit your citation ');
    } catch (err) {
      setError(err.message);
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  // Import the citation using the Zotero API client.
  async function importCitation(citationData, apiKey, groupId) {
    try {
      // Initialize the client with your API key and configure for the group library.
      const zotero = api(apiKey).library('group', groupId);

      // Use the post() execution function to create the new item.
      // The API expects an array of entities.
      let response;

      try {
        response = await zotero.items().post(citationData);
      }
      catch (err) {
        // Check for errors in the response
        if (err.response.status >= 400 && err.response.status < 600) {
          // Handle specific status codes with user-friendly messages
          if (err.response.status === 400) {
            throw new Error('The citation data is invalid. Please check the input and try again.');
          } else if (err.response.status === 401) {
            throw new Error('Your Zotero API key is invalid or expired. Please check your API key and try again.');
          } else if (err.response.status === 403) {
            throw new Error('You do not have permission to add items to this Zotero group library. Please check your permissions.');
          } else if (err.response.status === 404) {
            throw new Error('The Zotero group could not be found. Please check the group ID and try again.');
          } else if (err.response.status === 429) {
            throw new Error('You have exceeded the API rate limit. Please wait a moment and try again.');
          } else if (err.response.status === 500) {
            throw new Error('The Zotero server encountered an error. Please try again later.');
          } else if (err.response.status === 503) {
            throw new Error('The Zotero API is currently unavailable. Please try again later.');
          } else {
            throw new Error(`An unexpected error occurred: ${err.response.status}`);
          }
        }

        throw err;
      }

      const createdItems = response.getData(); // returns an array
      const itemKey = createdItems[0].key; // get the key of the first created item
      return `https://www.zotero.org/groups/${groupId}/items/${itemKey}`;
    } catch (err) {
      throw err;
    }
  }

  function validateDOI(doi) {
    const doiRegex = /^(10\.\d{4,9}\/[-._;()/:A-Z0-9]+)$/i;
    return doiRegex.test(doi);
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
            onChange={(e) => {
              // Get the current value from the input field
              const value = e.target.value;
              setQuery(value);
          
              // Validate the DOI and set an error if it fails
              if (value.trim().length > 0 && !validateDOI(value.trim())) 
              {
                // Invalid DOI format
                setError('Invalid DOI format. Please enter a valid DOI.');
              } 
              else
              {
                // Clear the error if the DOI is valid
                setError('');
              }
            }}
            placeholder="Enter DOI following the format 10.1234/abcd.efgh"
          />
        </label>

        <div className={styles.captchaContainer}>
          <ReCAPTCHA
            key={colorMode}
            ref={recaptchaRef}
            sitekey={customFields.captcha_key}
            onChange={handleRecaptcha}
            theme={colorMode === 'dark' ? 'dark' : 'light'}
          />
        </div>
        
        <button 
          type="submit" 
          className={clsx(
            'button',
            styles.button,
            styles.buttonPrimary
          )}
          disabled={loading}
          // disabled={!capchaToken}
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
