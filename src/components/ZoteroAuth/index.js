// import React, { useState } from 'react';
// import styles from './styles.module.css';
// import { FaSpinner } from 'react-icons/fa';
// import OAuth from 'oauth-1.0a';
// import crypto from 'crypto';



// export default function ZoteroPush(){

// }
// {
    // const [oauthState, setOauthState] = useState({
    //     state: 0,
    //     requestToken: null,
    //     accessToken: null,
    //     verifier: null,
    // });

//     const oauth = OAuth({
//         consumer: {
//             key: ,
//             secret: ,
//         },
//         signature_method: 'HMAC-SHA256',
//         hash_function(baseString, key) {
//             return crypto.createHmac('sha256', key).update(baseString).digest('base64');
//         },
//     });

//     // Make a request to Zotero to get a temporary token
//     if (oauthState.state === 0)
//     {
//         let requestTokenEndpoint = 'https://www.zotero.org/oauth/request';
        
//     }
//     else
//     // Redirect user to Zotero with temporary token for authorization
//     if (oauthState.state === 1)
//     {
//         let zoteroAuthorizeEndpoint = 'https://www.zotero.org/oauth/authorize';
//     }
//     else
//     // Exchange the temporary authorized token for a permanent token
//     if (oauthState.state === 2)
//     {
//         let accessTokenEndpoint = 'https://www.zotero.org/oauth/access';
//     }
// }


import React, { useEffect, useState } from 'react';
import OAuth from 'oauth-1.0a';
import JsSHA from 'jssha';

// ====[ CAUTION: Inlining secrets is insecure! ]=== //
const CLIENT_KEY = '8784164c9356d9e2f026';
const CLIENT_SECRET = 'fd1b919095312dedb477';

// OAuth endpoints
const REQUEST_TOKEN_URL = 'https://www.zotero.org/oauth/request';
const AUTHORIZE_URL     = 'https://www.zotero.org/oauth/authorize';
const ACCESS_TOKEN_URL  = 'https://www.zotero.org/oauth/access';

// This must match exactly what you set in your Zotero application settings.
const CALLBACK_URL = 'https://portal.ciroh.org/contribute';

function hmacSha1Sig(baseString, key) {
  // Use jssha to generate HMAC-SHA1
  const shaObj = new JsSHA('SHA-1', 'TEXT');
  shaObj.setHMACKey(key, 'TEXT');
  shaObj.update(baseString);
  return shaObj.getHMAC('B64');
}

// Create an OAuth-1.0a object with the hashing function
function getOAuth() {
  return new OAuth({
    consumer: {
      key: CLIENT_KEY,
      secret: CLIENT_SECRET,
    },
    signature_method: 'HMAC-SHA1',
    hash_function(baseString, key) {
      return hmacSha1Sig(baseString, key);
    },
  });
}

export default function ZoteroAuth() {
  const [apiKey, setApiKey] = useState(null);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);

  // If Zotero redirects back to https://portal.ciroh.org/contribute?oauth_token=...&oauth_verifier=...,
  // we can detect that here by reading the query parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const oauthToken = urlParams.get('oauth_token');
    const oauthVerifier = urlParams.get('oauth_verifier');
    const oauthTokenSecret = sessionStorage.getItem('zotero_oauth_token_secret');

    // If we have token & verifier & secret, we must exchange for the permanent Zotero API key
    if (oauthToken && oauthVerifier && oauthTokenSecret) {
      exchangeAccessToken(oauthToken, oauthVerifier, oauthTokenSecret)
        .then(({ token, userID }) => {
          setApiKey(token);
          setUserId(userID);
          // Optionally clear the query string so it doesn't stay in the URL
          window.history.replaceState({}, document.title, window.location.pathname);
        })
        .catch((err) => setError(err.message));
    }
  }, []);

  // Step 1: Obtain a temporary "request token" from Zotero
  const handleLogin = async () => {
    try {
      const oauth = getOAuth();
      const requestData = {
        url: REQUEST_TOKEN_URL,
        method: 'POST',
        data: {
          oauth_callback: CALLBACK_URL,
        },
      };

      const authHeader = oauth.toHeader(oauth.authorize(requestData));

      // We must send the data as query parameters plus the `Authorization` header.
      const queryParams = new URLSearchParams({ oauth_callback: CALLBACK_URL });
      const response = await fetch(`${REQUEST_TOKEN_URL}?${queryParams.toString()}`, {
        method: 'POST',
        headers: {
          Authorization: authHeader.Authorization,
        },
      });

      const text = await response.text(); 
      // e.g. "oauth_token=...&oauth_token_secret=...&oauth_callback_confirmed=true"
      const data = new URLSearchParams(text);

      const oauthToken = data.get('oauth_token');
      const oauthTokenSecret = data.get('oauth_token_secret');

      if (!oauthToken || !oauthTokenSecret) {
        throw new Error('Failed to get request token');
      }

      // Temporarily store the secret in sessionStorage
      sessionStorage.setItem('zotero_oauth_token_secret', oauthTokenSecret);

      // Now redirect user to Zotero to authorize your app
      // You can also add: &library_access=1&notes_access=1&write_access=1&all_groups=read
      const authorizeUrl = `${AUTHORIZE_URL}?oauth_token=${oauthToken}&name=MyApp`;

      window.location.href = authorizeUrl;
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // Step 2: Exchange the temporary token + verifier for a permanent Zotero key
  const exchangeAccessToken = async (oauthToken, oauthVerifier, oauthTokenSecret) => {
    try {
      const oauth = getOAuth();
      const requestData = {
        url: ACCESS_TOKEN_URL,
        method: 'POST',
        data: {
          oauth_token: oauthToken,
          oauth_verifier: oauthVerifier,
        },
      };

      const token = {
        key: oauthToken,
        secret: oauthTokenSecret,
      };

      const authHeader = oauth.toHeader(oauth.authorize(requestData, token));

      const queryParams = new URLSearchParams({
        oauth_token: oauthToken,
        oauth_verifier: oauthVerifier,
      });
      const response = await fetch(`${ACCESS_TOKEN_URL}?${queryParams.toString()}`, {
        method: 'POST',
        headers: {
          Authorization: authHeader.Authorization,
        },
      });

      const text = await response.text();
      // e.g. "oauth_token=<the_permanent_key>&oauth_token_secret=&userID=123456&username=..."
      const data = new URLSearchParams(text);

      const zoteroApiKey = data.get('oauth_token'); // This is the permanent key
      const userID = data.get('userID');

      // Clear the stored secret
      sessionStorage.removeItem('zotero_oauth_token_secret');

      if (!zoteroApiKey || !userID) {
        throw new Error('Failed to obtain Zotero API key');
      }

      return { token: zoteroApiKey, userID };
    } catch (err) {
      throw err;
    }
  };

  return (
    <div style={{ margin: '2rem 0' }}>
      {!apiKey && (
        <>
          <button onClick={handleLogin}>Login to Zotero</button>
          {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        </>
      )}
      {apiKey && userId && (
        <div>
          <h2>Connected to Zotero!</h2>
          <p><strong>API Key:</strong> {apiKey}</p>
          <p><strong>User ID:</strong> {userId}</p>
          <p>You can now make Zotero API calls on behalf of this user.</p>
        </div>
      )}
    </div>
  );
}