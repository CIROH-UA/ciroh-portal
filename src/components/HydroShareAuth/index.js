import React, { useContext } from 'react';
import { AuthContext } from 'react-oauth2-code-pkce';
import hydroShareLogoAuthenticated from '@site/static/img/hydroshare_logo_authenticated.png'

export default function HydroShareAuthButton() {
  const { logIn, token, loginInProgress, error } = useContext(AuthContext);

  if (token) return <span>Authenticated with <img src={hydroShareLogoAuthenticated} alt="HydroShare" style={{ verticalAlign: 'middle' }}></img></span>;

  return (
    <div>
      <button type="button" onClick={() => logIn()} disabled={loginInProgress}>
        Authenticate with HydroShare
      </button>
      {error && <div style={{ color: 'crimson', marginTop: 8 }}>{String(error)}</div>}
    </div>
  );
}