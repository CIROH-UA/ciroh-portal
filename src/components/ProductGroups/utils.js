// Build full docs URL from docsPath
export function buildDocsUrl(docsPath) {
  if (!docsPath) {
    return null;
  }
  return docsPath.startsWith('http')
    ? docsPath
    : `https://docs.ciroh.org${docsPath}`;
}

// Handle navigation to external docs
export const handleDocsNavigate = ({ docsPath }) => {
  const targetUrl = buildDocsUrl(docsPath);
  if (!targetUrl) {
    return;
  }

  if (typeof window !== 'undefined') {
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  }
};

// Normalize string for comparison

export const normalize = value => value ? value.toString().toLowerCase().trim() : '';