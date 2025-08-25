import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { AuthProvider } from 'react-oauth2-code-pkce';

export default function Root({ children }) {
  const { siteConfig } = useDocusaurusContext();
  const cf = (siteConfig && siteConfig.customFields) || {};

  const redirectUri =
    typeof window !== 'undefined'
      ? (cf.hs_redirect_uri || `${window.location.origin}/auth/callback`)
      : 'http://localhost:3000/auth/callback';

  const scope = Array.isArray(cf.hs_scopes) ? cf.hs_scopes.join(' ') : (cf.hs_scopes || 'read write');

  const authConfig = {
    clientId: cf.hs_client_id,
    authorizationEndpoint: cf.hs_authorize_url || 'https://www.hydroshare.org/o/authorize/',
    tokenEndpoint: cf.hs_token_url || 'https://www.hydroshare.org/o/token/',
    redirectUri,
    scope,
    autoLogin: false,       // avoids dev-time redirect loops
    loginMethod: 'redirect',
    decodeToken: false,     // HS tokens may not be JWTs
    onRefreshTokenExpire: (e) => e.logIn(),
  };

  // Don’t render AuthProvider during SSR—let the site hydrate first.
  return (
    <BrowserOnly fallback={<>{children}</>}>
      {() => <AuthProvider authConfig={authConfig}>{children}</AuthProvider>}
    </BrowserOnly>
  );
}