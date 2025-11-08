import {
  fetchResourcesByKeywordsIntersection,
  fetchResourceCustomMetadata,
  fetchResourceMetadata,
} from '@site/src/components/HydroShareImporter';


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

export function buildGroupKeywords(group) {
  const keywords = [];

  if (group?.primaryKeyword) {
    keywords.push(group.primaryKeyword);
  }
  if (group?.secondaryKeyword) {
    keywords.push(group.secondaryKeyword);
  }

  return keywords.filter(Boolean);
}

const normalizeProductType = value => {
  if (!value) {
    return null;
  }

  const normalized = value.toString().toLowerCase();

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

  if (normalized.includes('framework')) {
    return 'Framework';
  }

  if (normalized.includes('analytics')) {
    return 'Analytics';
  }

  if (normalized.includes('distribution')) {
    return 'Distribution';
  }

  if (normalized.includes('service')) {
    return 'Service';
  }

  if (normalized.includes('dashboard')) {
    return 'Dashboard';
  }

  if (normalized.includes('visual')) {
    return 'Visualization';
  }

  return value;
};

const extractProductTypeFromMetadata = customMetadata => {
  if (!customMetadata) {
    return null;
  }

  const candidates = [
    customMetadata.product_type,
    customMetadata.productType,
    customMetadata.product_category,
    customMetadata.productCategory,
    customMetadata.extra_metadata?.product_type,
    customMetadata.extra_metadata?.productType,
    customMetadata.extra_metadata?.product_category,
    customMetadata.extra_metadata?.productCategory,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return normalizeProductType(candidate.trim());
    }
  }

  return null;
};

const deriveProductType = (customMetadata, resource) => {
  const metadataType = extractProductTypeFromMetadata(customMetadata);
  if (metadataType) {
    return {
      resolved: metadataType,
      fromMetadata: metadataType,
      fromResource: null,
    };
  }

  const resourceType = resource?.resource_type || resource?.resourceType || '';
  const normalizedResourceType = normalizeProductType(resourceType);

  return {
    resolved: normalizedResourceType || 'Resource',
    fromMetadata: null,
    fromResource: normalizedResourceType || resourceType || '',
  };
};

const coerceSubjectsArray = value => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .map(item => {
        if (typeof item === 'string') {
          return item.trim();
        }
        if (item && typeof item.value === 'string') {
          return item.value.trim();
        }
        if (item && typeof item.term === 'string') {
          return item.term.trim();
        }
        return null;
      })
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    return value.trim() ? [value.trim()] : [];
  }

  return [];
};

const extractSubjectsFromMetadata = metadata => {
  if (!metadata) {
    return [];
  }

  const collected = new Set();
  const addSubjects = list => {
    list.forEach(subject => {
      if (subject) {
        collected.add(subject);
      }
    });
  };

  addSubjects(coerceSubjectsArray(metadata.subjects));
  addSubjects(coerceSubjectsArray(metadata.Subjects));

  const elementsArray = metadata.elements || metadata.Elements;
  if (Array.isArray(elementsArray)) {
    elementsArray.forEach(element => {
      const elementType = element?.type || element?.name;
      if (elementType && elementType.toLowerCase() === 'subject') {
        addSubjects(coerceSubjectsArray(element.value || element.term || element));
      }
    });
  }

  if (metadata.extra_metadata?.subjects) {
    addSubjects(coerceSubjectsArray(metadata.extra_metadata.subjects));
  }

  return Array.from(collected);
};

async function fetchSubjectsForResource(resourceId) {
  try {
    const metadata = await fetchResourceMetadata(resourceId);
    return extractSubjectsFromMetadata(metadata);
  } catch (error) {
    console.error(`Unable to fetch subject metadata for resource ${resourceId}:`, error);
    return [];
  }
}

function mapResourceToProduct(resource, customMetadata, extras = {}) {
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

  const { resolved: resolvedType, fromMetadata, fromResource } = deriveProductType(customMetadata, resource);
  const resolvedSubjects =
    Array.isArray(extras.subjectsOverride) && extras.subjectsOverride.length > 0
      ? extras.subjectsOverride
      : coerceSubjectsArray(resource.subjects);

  const product = {
    id: resource.resource_id,
    title: resource.resource_title || resource.title || 'Untitled resource',
    type: resolvedType,
    productType: resolvedType,
    productTypeSource: fromMetadata ? 'metadata' : 'resource',
    productTypeMetadata: fromMetadata || '',
    productTypeResource: fromResource || '',
    summary: derivedSummary,
    docsLink: docsUrlFromMetadata || fallbackDocsUrl,
    codeLink: repoUrl,
    resourceUrl: fallbackDocsUrl,
    pageUrl: customMetadata?.page_url || '',
    lastUpdated: resource.date_last_updated || resource.last_updated || '',
    createdAt: resource.date_created || '',
    authors: Array.isArray(resource.authors) ? resource.authors : [],
    keywords: resolvedSubjects,
    subjects: resolvedSubjects,
    thumbnailUrl: customMetadata?.thumbnail_url || '',
    resourceType: resource.resource_type || '',
    rawResource: resource,
    rawCustomMetadata: customMetadata || null,
  };

  return product;
}

async function enrichWithCustomMetadata(resources, { includeMetadata = true }) {
  if (!includeMetadata) {
    return resources
      .map(resource =>
        mapResourceToProduct(resource, null, {
          subjectsOverride: coerceSubjectsArray(resource.subjects),
        }),
      )
      .filter(Boolean);
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

    const subjects = await fetchSubjectsForResource(resource.resource_id);
    const mappedProduct = mapResourceToProduct(resource, customMetadata, { subjectsOverride: subjects });
    if (mappedProduct) {
      enrichedProducts.push(mappedProduct);
    }
  }

  return enrichedProducts;
}

export async function hydrateProductMetadata(product) {
  if (!product?.id || !product?.rawResource) {
    return product;
  }

  try {
    const [customMetadata, subjects] = await Promise.all([
      fetchResourceCustomMetadata(product.id).catch(error => {
        console.error(`Unable to fetch custom metadata for product ${product.id}:`, error);
        return null;
      }),
      fetchSubjectsForResource(product.id),
    ]);

    return (
      mapResourceToProduct(product.rawResource, customMetadata, {
        subjectsOverride: subjects,
      }) || product
    );
  } catch (error) {
    console.error(`Unable to hydrate product ${product.id}:`, error);
    return product;
  }
}

export async function fetchHydroShareProductsForGroup(keywords, options = {}) {
  const {
    includeMetadata = true,
    sortBy = 'date_last_updated'
  } = options;
  const normalizedKeywords = normalizeKeywords(keywords);
  if (normalizedKeywords.length === 0) {
    return [];
  }

  const resources = await fetchResourcesByKeywordsIntersection(normalizedKeywords, options);
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

  return enrichWithCustomMetadata(sortedResources, { includeMetadata });
}

export function mapResourcesToProducts(resources) {
  if (!Array.isArray(resources)) {
    return [];
  }
  return resources
    .map(resource => mapResourceToProduct(resource, null))
    .filter(Boolean);
}
