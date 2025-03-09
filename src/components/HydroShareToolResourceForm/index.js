import React, { useState } from 'react';

/**
 * Example React form to create a HydroShare resource (e.g. ToolResource)
 * with fields for app_home_page_url, source_code_url, help_page_url,
 * all included in the `metadata` JSON array.
 *
 * NOTE:
 * - For a ToolResource, do NOT append a file, or you'll get
 *   "Content files are not allowed in ToolResource".
 * - This example sends a single coverage/creators/etc. object if you want,
 *   but here we focus on the three app-related URLs.
 */
export default function HydroShareFormWithAppUrls() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [keywords, setKeywords] = useState('');

  // Fields for app URLs
  const [appHomePageUrl, setAppHomePageUrl] = useState('');
  const [sourceCodeUrl, setSourceCodeUrl] = useState('');
  const [helpPageUrl, setHelpPageUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Utility to count words in the abstract
  function countWords(str) {
    return str.trim().split(/\s+/).filter(Boolean).length;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic checks
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

    // Parse user keywords
    const keywordArr = keywords
      .split(/[,\s]+/)
      .map((k) => k.trim())
      .filter((k) => k);
    // Ensure 'nwm_data_ciroh' is present
    if (!keywordArr.includes('nwm_data_ciroh')) {
      keywordArr.push('nwm_data_ciroh');
    }

    // Build a single metadata array object that can hold coverage/creator/etc.
    // Here, we only add the 3 app URLs as separate objects:
    const metadataArray = [];

    if (appHomePageUrl.trim()) {
      metadataArray.push({
        homepage: appHomePageUrl.trim(),
      });
    }
    if (sourceCodeUrl.trim()) {
      metadataArray.push({
        modelCodeRepository: sourceCodeUrl.trim(),
      });
    }
    if (helpPageUrl.trim()) {
      metadataArray.push({
        help_page_url: helpPageUrl.trim(),
      });
    }

    // If you want coverage or creators, you could do something like:
    metadataArray.push({
      coverage: {
        type: 'period',
        value: { start: '01/01/2000', end: '12/12/2010' },
      },
      fundingAgency:
        {"agency_name":"National Science Foundation","award_title":"Model Execution Cyberinfrastructure ","award_number":"NSF_9087658_2017","agency_url":"http://www.nsf.gov"}
    });



    // metadataArray.push({ creator: { name: 'John Smith' } });
    // etc.

    // Convert metadata array to a JSON string
    const metadataJson = JSON.stringify(metadataArray);

    // Build multipart form
    const formData = new FormData();
    // Mandatory
    formData.append('resource_type', 'ToolResource'); // or 'CompositeResource', etc.
    formData.append('title', title.trim());
    formData.append('abstract', abstract.trim());

    // Keywords => repeated fields as "keywords[0]", "keywords[1]"...
    keywordArr.forEach((kw, i) => {
      formData.append(`keywords[${i}]`, kw);
    });

    // Add metadata + extra_metadata
    formData.append('metadata', metadataJson);
    formData.append('extra_metadata', '{}');

    // DO NOT append any "file" for ToolResource -> not allowed

    // Basic Auth
    const authString = btoa(`${username}:${password}`);

    setLoading(true);
    try {
      const resp = await fetch('https://www.hydroshare.org/hsapi/resource/', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${authString}`,
        },
        body: formData,
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || `Server error ${resp.status}`);
      }

      const json = await resp.json();
      setSuccess(`Resource created successfully! ID: ${json.resource_id || '(unknown)'}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '1rem', border: '1px solid #ccc' }}>
      <h2>Create a HydroShare Resource (with App URLs)</h2>

      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      {success && <div style={{ background: '#4caf50', color: '#fff', padding: '0.5rem', borderRadius: 4, marginBottom: '1rem' }}>
        {success}
      </div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label>
          Username:
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="HydroShare username"
          />
        </label>

        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="HydroShare password"
          />
        </label>

        <label>
          Title (required):
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Resource title"
          />
        </label>

        <label>
          Abstract (≥150 words):
          <textarea
            rows={4}
            value={abstract}
            onChange={(e) => setAbstract(e.target.value)}
            placeholder="Provide a detailed abstract"
          />
        </label>

        <label>
          Keywords (comma/spaces):
          <input
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="e.g. model HPC weather"
          />
          <small style={{ display: 'block', color: '#555' }}>
            "nwm_data_ciroh" is auto-added if missing
          </small>
        </label>

        {/* Three fields for app URLs */}
        <label>
          App Home Page URL:
          <input
            type="url"
            value={appHomePageUrl}
            onChange={(e) => setAppHomePageUrl(e.target.value)}
            placeholder="https://example.com"
          />
        </label>

        <label>
          Source Code URL:
          <input
            type="url"
            value={sourceCodeUrl}
            onChange={(e) => setSourceCodeUrl(e.target.value)}
            placeholder="https://github.com/user/repo"
          />
        </label>

        <label>
          Help Page URL:
          <input
            type="url"
            value={helpPageUrl}
            onChange={(e) => setHelpPageUrl(e.target.value)}
            placeholder="https://example.com/help"
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Resource'}
        </button>
      </form>
    </div>
  );
}
