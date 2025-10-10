import React, { useContext } from 'react';
import { AuthContext } from 'react-oauth2-code-pkce';
import hydroShareLogoAuthenticated from '@site/static/img/hydroshare_logo_authenticated.png';

export default function HydroShareAuthButton() {
  const { logIn, logOut, token, loginInProgress, error } = useContext(AuthContext);

  // User is authenticated
  if (token) return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '4px' 
    }}>
      <span>
        Authenticated with <img src={hydroShareLogoAuthenticated} alt="HydroShare" style={{ verticalAlign: 'middle', fontWeight: 'bold', fontSize: '13px', color: 'var(--ifm-color-primary)' }} />
      </span>
      <button 
        type="button" 
        onClick={() => {logOut();}}
        style={{ 
          fontSize: '12px', 
          padding: '2px 6px',
          background: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '3px',
          cursor: 'pointer'
        }}
      >
        Logout
      </button>
    </div>
  );

  // User is NOT authenticated
  return (
    <div>
      <button type="button" onClick={() => logIn()} disabled={loginInProgress}>
        Authenticate with HydroShare
      </button>
      {error && <div style={{ color: 'crimson', marginTop: 8 }}>{String(error)}</div>}
    </div>
  );
}