import RedirectHero from "./RedirectHero";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { useLocation } from 'react-router-dom';

// Mostly identical to RedirectHero. Automatically handles redirects to pages that retain largely identical paths in CIROH Hub.

const target = "https://hub.ciroh.org"

function stripBaseURL(path, baseURL) {
    if (baseURL === "/") return path;
    const alteredPath = path.substring(baseURL.length-1);
    return alteredPath;
}

export default function AutoRedirectHero() {
  const path = useLocation().pathname;
  const baseURL = useBaseUrl('/');

  return (
    <RedirectHero href={target + stripBaseURL(path, baseURL)} />
  );
}