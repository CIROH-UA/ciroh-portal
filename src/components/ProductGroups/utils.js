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

export const productMatchesFilter = (product, filter) => {
  if (!filter) {
    return true;
  }

  const normalizedFilterValues = filter.values
    .map(value => normalize(value))
    .filter(Boolean);

  const matchesValue = value => {
    const normalizedValue = normalize(value);
    return normalizedValue && normalizedFilterValues.includes(normalizedValue);
  };

  if (Array.isArray(product?.keywords) && product.keywords.some(matchesValue)) {
    return true;
  }

  return false;
};