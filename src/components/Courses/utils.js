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


export async function filterModulesViewUsingHydroshare(keyword) {
  let filterList = [];
  try {
    // Pull resource metadata from HydroShare by subject=keyword
    const resources = await fetchResourcesByKeyword(keyword);
    
    // Map resource titles
    for (const resource of resources) {
      console.warn(resource); // Similar to logger.warning(...) in Python
      if (resource.resource_title) {
        filterList.push(resource.resource_title);
      }
    }
  } catch (error) {
    console.warn(`Error fetching HydroLearn modules: ${error}`);
    filterList = [];
  }
  return filterList;
}


const PROXY_SERVERS = [
  'https://cors-proxy.htmldriven.com/?url=',
  'https://corsproxy.io/?', 
  'https://proxy.cors.sh/',
  'https://cors-anywhere.herokuapp.com/',
  'https://api.allorigins.win/post?'
];

async function postWithProxy(url, body, headers = {}) {
  const proxy = PROXY_SERVERS[Math.floor(Math.random() * PROXY_SERVERS.length)];
  
  try {
    const proxyUrl = proxy === 'https://api.allorigins.win/post?' 
      ? `${proxy}${encodeURIComponent(url)}`
      : proxy + url;

    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...headers
      },
      body: JSON.stringify(body)
    });

    // Handle different proxy response formats
    const data = await response.json();
    return data.contents ? JSON.parse(data.contents) : data;

  } catch (error) {
    console.error(`Proxy ${proxy} failed:`, error);
    return postWithProxy(url, body, headers); // Retry with next proxy
  }
}

async function fetchHydroLearnCourses() {
  const URL = 'https://edx.hydrolearn.org';
  const coursesUrl = `${URL}/search/course_discovery/`;
  const postData = {
    "csrfmiddlewaretoken": ""
  }
  const response = await postWithProxy(coursesUrl,postData);

  if (!response.ok) {
    throw new Error(`Error fetching courses: ${response.status}`);
  }
  
  const data = await response.json();
  // data["results"] is presumably an array of course objects
  return data["results"] || [];
}

async function getHydrolearnModules(keyword) {
  let modulesList = [];
  
  try {
    const coursesList = await fetchHydroLearnCourses();
    
    // 2) Transform them into your desired structure
    const URL = 'https://edx.hydrolearn.org';
    modulesList = coursesList.map(course => {
      const courseData = course["data"];
      return {
        course_title: courseData["content"]["display_name"],
        course_url: `${URL}/courses/${courseData["course"]}/about`,
        course_image_url: courseData["image_url"]
          ? `${URL}${courseData["image_url"]}`
          : "",
        course_organization: courseData["org"] || "",
        course_code: courseData["number"] || "",
        course_weekly_effort: courseData["effort"] || "",
        course_description_content: courseData["content"]["short_description"] || "",
      };
    });

    // 3) Fetch HydroShare list of titles for the given tag
    const filterHsList = await filterModulesViewUsingHydroshare(keyword);

    // 4) Filter the modules by matching the course_title to the titles in filterHsList
    const filteredModulesList = modulesList.filter(module =>
      filterHsList.includes(module.course_title)
    );
    
    return filteredModulesList;
    
  } catch (error) {
    console.warn(`Error fetching HydroLearn modules: ${error}`);
    return modulesList; // Return the unfiltered list on error (or empty)
  }
}


export { getHydrolearnModules };