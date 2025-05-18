/**
 * Sample endpoint: 
 *   GET https://www.hydroshare.org/hsapi/resources/?subject=YOUR_KEYWORD
 * 
 * Resource metadata endpoint:
 *   GET https://www.hydroshare.org/resource/{resource_id}/scimeta/elements/
 * 
 * Adjust or add query parameters (e.g., page, count) as needed.
 */

// Helper function to fetch list of resources by keyword
async function fetchResourcesByKeyword(keyword) {
  const url = `https://www.hydroshare.org/hsapi/resource/?subject=${encodeURIComponent(
    keyword
  )}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error fetching resources (status: ${response.status})`);
  }
  const data = await response.json();
  // data.results is typically where the list of resources is stored.
  // If your actual structure differs, adjust accordingly.
  return data.results;
}

// Helper function to fetch detailed metadata for a specific resource
async function fetchResourceMetadata(resourceId) {
  const url = `https://www.hydroshare.org/hsapi/resource/${resourceId}/scimeta/elements/`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Error fetching metadata for resource ${resourceId} (status: ${response.status})`
    );
  }
  const data = await response.json();
  return data;
}

async function fetchResourceCustomMetadata(resourceId) {
  const url = `https://www.hydroshare.org/hsapi/resource/${resourceId}/scimeta/custom/`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Error fetching metadata for resource ${resourceId} (status: ${response.status})`
    );
  }
  const data = await response.json();
  return data;
}

export { fetchResourcesByKeyword, fetchResourceMetadata, fetchResourceCustomMetadata };