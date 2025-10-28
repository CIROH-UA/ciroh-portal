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

async function fetchResource(id) {
  const url = `https://www.hydroshare.org/hsapi/resource/${encodeURIComponent(id)}/sysmeta`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error fetching resources (status: ${response.status})`);
  }
  const data = await response.json();
  return data;
}

// Helper function to fetch list of resources by group
async function fetchResourcesByGroup(groupid, fullTextSearch=undefined) {
  let url = `https://www.hydroshare.org/hsapi/resource/?group=${encodeURIComponent(
    groupid
  )}`;

  if (fullTextSearch !== undefined) {
    url += `&full_text_search=${encodeURIComponent(fullTextSearch)}`;
  }

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


async function joinGroupResources(groupIds, fullTextSearch=undefined) {
  const seenResourceIds = new Set();
  const uniqueResources = [];
  
  // Process groups sequentially to maintain order
  for (const groupId of groupIds) {
    try {
      const resources = await fetchResourcesByGroup(groupId, fullTextSearch);
      

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

function joinExtraResources(groupResources, extraResources) {
  const seenResourceIds = new Set();
  const allResources = groupResources.concat(extraResources);
  const uniqueResources = [];
  
  // Filter and collect unique resources
  allResources.forEach( (resource) => {
    const resourceId = resource.resource_id;
    if (!seenResourceIds.has(resourceId)) {
      seenResourceIds.add(resourceId);
      uniqueResources.push(resource);
    }
  });

  return uniqueResources;

}

async function getCommunityResources(keyword="ciroh_portal_data", communityId="4", fullTextSearch=undefined, ascending=false, sortBy=undefined, author=undefined) {
  try {
    const groupIds = await getGroupIds(communityId);
    const group_resources =  await joinGroupResources(groupIds, fullTextSearch);
    const extra_resources = await fetchResourcesBySearch(keyword, fullTextSearch, ascending, sortBy, author);

    return joinExtraResources(group_resources, extra_resources);
    // return await joinGroupResources(groupIds);
  } catch (error) {
    console.error('Community resource fetch failed:', error);
    return [];
  }
}

async function fetchResourcesByKeyword(keyword, fullTextSearch=undefined) {
  let url = `https://www.hydroshare.org/hsapi/resource/?subject=${encodeURIComponent(
    keyword
  )}`;

  if (fullTextSearch !== undefined) {
    url += `&full_text_search=${encodeURIComponent(fullTextSearch)}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error fetching resources (status: ${response.status})`);
  }
  const data = await response.json();
  // data.results is typically where the list of resources is stored.
  // If your actual structure differs, adjust accordingly.
  return data.results;
}

/**
 * Fetch resources from HydroShare based on search criteria.
 * @param {string} keyword  - The keyword (subject) to use for the api request
 * @param {string} searchText - The text to look for in all the resource fields
 * @param {boolean} ascending - Whether to sort results in ascending order (true) or descending order (false)
 * @param {string} sortBy - The field to sort by. One of 'title', 'author', 'created', 'modified'
 * @param {string} author - The author to filter by
 * @returns {Promise<Array>} Array of resource objects
 */
async function fetchResourcesBySearch(keyword, searchText, ascending=false, sortBy=undefined, author=undefined, pageNumber=1) {
  // API Url with query parameters
  let url = `https://www.hydroshare.org/discoverapi/?q=${encodeURIComponent(searchText)}&subject=${encodeURIComponent([keyword])}`;

  // Add sort order parameter
  if (ascending) {
    url += `&asc=1`;
  } else {
    url += `&asc=-1`;
  }

  // Add sort parameter if provided
  if (sortBy !== undefined) {
    url += `&sort=${encodeURIComponent(sortBy)}`;
  }

  // Convert author name from "First Middle Last" to "Last, First Middle"
  if (author !== undefined) {
    const nameParts = author.split(' ');
    const lastName = nameParts.pop();
    const firstName = nameParts.join(' ');
    author = `${lastName}, ${firstName}`;
  }

  // Add page number parameter (1-based indexing)
  url += `&pnum=${pageNumber}`;

  // Add filter parameter
  const filter = {
    author: [author].filter(a => a !== undefined),
    subject: [keyword],
  };

  url += `&filter=${encodeURIComponent(JSON.stringify(filter))}`;

  // Fetch data from the API
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error fetching resources (status: ${response.status})`);
  }
  const data = await response.json();

  // Put resources into a corrected format
  let resources = JSON.parse(data.resources);
  let resourcesCorrected = [];

  for (let i = 0;i < resources.length;i++)
  {
    let resource = resources[i];
    let resourceCorrected = {
      resource_id: resource.short_id,
      resource_title: resource.title,
      authors: resource.authors,
      resource_type: resource.type,
      resource_url: 'http://www.hydroshare.org' + resource.link,
      abstract: resource.abstract,
      date_created: resource.created,
      date_last_updated: resource.modified,
    };

    resourcesCorrected.push(resourceCorrected);
  }

  // Return the corrected resources
  return resourcesCorrected;
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

export {getCuratedIds, fetchResource, fetchResourcesByGroup, fetchResourcesByKeyword, fetchResourcesBySearch, getCommunityResources, fetchResourceCustomMetadata, joinExtraResources};