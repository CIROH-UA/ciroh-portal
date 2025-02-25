/**
 * Sample endpoint: 
 *   GET https://www.hydroshare.org/hsapi/resources/?subject=YOUR_KEYWORD
 * 
 * Resource metadata endpoint:
 *   GET https://www.hydroshare.org/resource/{resource_id}/scimeta/elements/
 * 
 * Adjust or add query parameters (e.g., page, count) as needed.
 */

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

// Helper function to fetch list of resources by group
async function fetchResourcesByGroup(groupid) {
  const url = `https://www.hydroshare.org/hsapi/resource/?group=${encodeURIComponent(
    groupid
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


export {fetchResourceMetadata, fetchResourcesByGroup };