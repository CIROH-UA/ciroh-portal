import { fetchResourcesByKeywordsIntersection, fetchResourceCustomMetadata } from '@site/src/components/HydroShareImporter';

const DEFAULT_LIMIT = 24;

const parseDate = value => {
  if (!value) {
    return 0;
  }
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const normalizeKeywords = keywords => {
  if (!Array.isArray(keywords)) {
    return [];
  }
  return keywords
    .map(keyword => (typeof keyword === 'string' ? keyword.trim() : ''))
    .filter(Boolean);
};

const mapHydroShareType = resourceType => {
  if (!resourceType) {
    return 'Resource';
  }

  const normalized = resourceType.toLowerCase();

  if (normalized.includes('notebook') || normalized.includes('jupyter')) {
    return 'Notebook';
  }

  if (normalized.includes('app') || normalized.includes('web')) {
    return 'Application';
  }

  if (normalized.includes('data') || normalized.includes('dataset')) {
    return 'Dataset';
  }

  if (normalized.includes('model') || normalized.includes('library') || normalized.includes('tool')) {
    return 'Library';
  }

  return resourceType;
};

function mapResourceToProduct(resource, customMetadata) {
  if (!resource) {
    return null;
  }

  const fallbackDocsUrl = resource.resource_url || resource.resource_link || '';
  const docsUrlFromMetadata = customMetadata?.docs_url || customMetadata?.page_url;
  const derivedSummary =
    customMetadata?.description ||
    customMetadata?.summary ||
    customMetadata?.abstract ||
    resource.abstract ||
    '';
  const repoUrl =
    customMetadata?.repo_url ||
    customMetadata?.repository_url ||
    customMetadata?.code_url ||
    customMetadata?.github_url ||
    '';

  const product = {
    id: resource.resource_id,
    title: resource.resource_title || resource.title || 'Untitled resource',
    type: mapHydroShareType(resource.resource_type),
    summary: derivedSummary,
    docsLink: docsUrlFromMetadata || fallbackDocsUrl,
    codeLink: repoUrl,
    resourceUrl: fallbackDocsUrl,
    pageUrl: customMetadata?.page_url || '',
    lastUpdated: resource.date_last_updated || resource.last_updated || '',
    createdAt: resource.date_created || '',
    authors: Array.isArray(resource.authors) ? resource.authors : [],
    keywords: Array.isArray(resource.subjects) ? resource.subjects : [],
    thumbnailUrl: customMetadata?.thumbnail_url || '',
    rawResource: resource,
    rawCustomMetadata: customMetadata || null,
  };

  return product;
}

async function enrichWithCustomMetadata(resources, { includeMetadata = true }) {
  if (!includeMetadata) {
    return resources.map(resource => mapResourceToProduct(resource, null)).filter(Boolean);
  }

  const enrichedProducts = [];

  for (const resource of resources) {
    if (!resource?.resource_id) {
      continue;
    }

    let customMetadata = null;
    try {
      customMetadata = await fetchResourceCustomMetadata(resource.resource_id);
    } catch (error) {
      console.error(`Unable to fetch custom metadata for resource ${resource.resource_id}:`, error);
    }

    const mappedProduct = mapResourceToProduct(resource, customMetadata);
    if (mappedProduct) {
      enrichedProducts.push(mappedProduct);
    }
  }

  return enrichedProducts;
}

export async function fetchHydroShareProductsForGroup(keywords, options = {}) {
  const {
    limit = DEFAULT_LIMIT,
    includeMetadata = true,
    sortBy = 'date_last_updated',
  } = options;

  const normalizedKeywords = normalizeKeywords(keywords);
  if (normalizedKeywords.length === 0) {
    return [];
  }

  const resources = await fetchResourcesByKeywordsIntersection(normalizedKeywords);
  if (!resources || resources.length === 0) {
    return [];
  }

  const sortedResources = [...resources].sort((a, b) => {
    if (sortBy === 'date_created') {
      return parseDate(b.date_created) - parseDate(a.date_created);
    }
    if (sortBy === 'title') {
      return (a.resource_title || '').localeCompare(b.resource_title || '');
    }
    // default: date_last_updated
    return parseDate(b.date_last_updated) - parseDate(a.date_last_updated);
  });

  const limitedResources =
    typeof limit === 'number' && limit > 0
      ? sortedResources.slice(0, limit)
      : sortedResources;

  return enrichWithCustomMetadata(limitedResources, { includeMetadata });
}

export function mapResourcesToProducts(resources) {
  if (!Array.isArray(resources)) {
    return [];
  }
  return resources
    .map(resource => mapResourceToProduct(resource, null))
    .filter(Boolean);
}
