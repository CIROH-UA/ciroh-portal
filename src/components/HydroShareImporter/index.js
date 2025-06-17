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
async function fetchResourceMetadata(resourceId="302dcbef13614ac486fb260eaa1ca87c") {
  const url = `https://www.hydroshare.org/hsapi/resource/${resourceId}/scimeta/elements/`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Error fetching metadata for resource ${resourceId} (status: ${response.status})`
    );
  }
  const metadata = await response.json();
  return metadata;
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
  
function extractRelatedResourceIds(metadata) {
  return metadata.relations
    .filter(item => item.type === 'hasPart')
    .map(item => {
      const match = item.value.match(/http:\/\/www\.hydroshare\.org\/resource\/([a-f0-9]{32})/);
      return match ? match[1] : null;
    })
    .filter(id => id !== null); // Remove non-matching entries
}

async function getCuratedIds(resourceId) {
  try {
    const metadata = await fetchResourceMetadata(resourceId);
    return extractRelatedResourceIds(metadata);
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

async function getGroupIds(communityId="4") {
  const url = `https://www.hydroshare.org/community/${communityId}/`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    
    // Find the JSON script tag
    const scriptTag = doc.querySelector('script#community-app-data[type="application/json"]');
    if (!scriptTag?.textContent) {
      console.log("No script tag with id 'community-app-data' found or it contains no data.");
      return [];
    }

    // Parse JSON and extract group IDs
    const data = JSON.parse(scriptTag.textContent);
    return data.members?.map(member => member.id.toString()).filter(Boolean) || [];

  } catch (error) {
    console.error(`Error processing community ${communityId}:`, error);
    return [];
  }
}


async function joinGroupResources(groupIds) {
  const seenResourceIds = new Set();
  const uniqueResources = [];
  
  // Process groups sequentially to maintain order
  for (const groupId of groupIds) {
    try {
      const resources = await fetchResourcesByGroup(groupId);
      

      // Filter and collect unique resources
      for (const resource of resources) {
        const resourceId = resource.resource_id;
        if (!seenResourceIds.has(resourceId)) {
          seenResourceIds.add(resourceId);
          uniqueResources.push(resource);
        }
      }
    } catch (error) {
      console.error(`Error processing group ${groupId}:`, error);
      // Continue processing other groups even if one fails
    }
  }
  
  return uniqueResources;
}

async function joinExtraResources(group_resources, extra_resources) {
  const seenResourceIds = new Set();
  const allResources = [...group_resources, ...extra_resources];
  const uniqueResources = [];

  // Filter and collect unique resources
  for (const resource of allResources) {
    const resourceId = resource.resource_id;
    if (!seenResourceIds.has(resourceId)) {
      seenResourceIds.add(resourceId);
      uniqueResources.push(resource);
    }
  }

  return uniqueResources;

}

async function getCommunityResources(communityId="4", keyword="ciroh_portal_data") {
  try {
    const groupIds = await getGroupIds(communityId);
    const group_resources =  await joinGroupResources(groupIds);
    const extra_resources = await fetchResourcesByKeyword(keyword);
    return await joinExtraResources(group_resources, extra_resources);
    // return await joinGroupResources(groupIds);
  } catch (error) {
    console.error('Community resource fetch failed:', error);
    return [];
  }
}

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

export {getCuratedIds, fetchResourcesByGroup, fetchResourcesByKeyword, getCommunityResources, fetchResourceCustomMetadata};