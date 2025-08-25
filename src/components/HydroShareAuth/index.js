import React, { useContext } from 'react';
import { AuthContext } from 'react-oauth2-code-pkce';

export default function HydroShareAuthButton() {
  const { logIn, token, loginInProgress, error } = useContext(AuthContext);

  if (token) return <span>✅ Authenticated with HydroShare</span>;

  return (
    <div>
      <button type="button" onClick={() => logIn()} disabled={loginInProgress}>
        Authenticate with HydroShare
      </button>
      {error && <div style={{ color: 'crimson', marginTop: 8 }}>{String(error)}</div>}
    </div>
  );
}