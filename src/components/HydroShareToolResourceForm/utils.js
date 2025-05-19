import AWS from "aws-sdk";


/**
 * @param {string} urlBase         e.g. "https://www.hydroshare.org/hsapi"
 * @param {string} username        HydroShare username (Basic Auth)
 * @param {string} password        HydroShare password (Basic Auth)
 * @param {string} resourceType    e.g. "CompositeResource", "ToolResource", etc.
 * @param {string} title           The new resource title
 * @param {File | string | null} resourceFile   A file or file path
 * @param {string|null} resourceFilename        If resourceFile is a File, pass its filename here
 * @param {string|null} abstract   Resource abstract
 * @param {string[]|null} keywords List of keyword strings
 * @param {string[]|null} editUsers    List of usernames for edit perms
 * @param {string[]|null} viewUsers    List of usernames for view perms
 * @param {string[]|null} editGroups   List of group names for edit perms
 * @param {string[]|null} viewGroups   List of group names for view perms
 * @param {string|null} metadata      JSON string data for advanced metadata
 * @param {string|null} extraMetadata JSON string for user-defined key/value pairs
 * @param {(loaded, total) => void} progressCallback  For reporting upload progress
 *
 * @returns {Promise<string>} resource_id of the newly created resource
 */
export async function createResource({
    urlBase,
    username,
    password,
    resourceType,
    title,
    resourceFile = null,
    resourceFilename = null,
    abstract = null,
    keywords = null,
    editUsers = null,
    viewUsers = null,
    editGroups = null,
    viewGroups = null,
    metadata = null,
    extraMetadata = null,
    progressCallback = null,
  }) {
    // Example: "https://www.hydroshare.org/hsapi/resource/"
    const url = `${urlBase}/resource/`;
  
    // If you want to replicate the Python check for resource_type validity,
    // you'd have to define known resource types. For now, we skip that check.
  
    // Build 'params' object, which we will turn into form-data
    const params = {
      resource_type: resourceType,
      title,
    };
  
    // Optional fields
    if (abstract) {
      params.abstract = abstract;
    }
    if (keywords && keywords.length > 0) {
      // The Python client turns them into "keywords[0]=..., keywords[1]=..."
      // We'll handle that when appending to FormData below.
      // We'll store them temporarily in an array.
    }
    if (editUsers && editUsers.length > 0) {
      params.edit_users = editUsers;
    }
    if (viewUsers && viewUsers.length > 0) {
      params.view_users = viewUsers;
    }
    if (editGroups && editGroups.length > 0) {
      params.edit_groups = editGroups;
    }
    if (viewGroups && viewGroups.length > 0) {
      params.view_groups = viewGroups;
    }
    if (metadata) {
      params.metadata = metadata;
    }
    if (extraMetadata) {
      params.extra_metadata = extraMetadata;
    }
  
    // If resource_file was provided
    // (But note: for ToolResource, this will cause an error if you pass a file)
    if (resourceFile) {
      // The Python code does something like _prepareFileForUpload,
      // which sets param 'file' to (filename, fileObject).
      // We'll do a similar approach in FormData.
      // If resourceFile is a File object, we can append directly:
      // If it's a string path, the user must handle that differently.
      // This example assumes you're passing a File object from an <input type="file" />.
      if (resourceFile instanceof File) {
        // If the user did not specify resource_filename, default to resourceFile.name
        const finalName = resourceFilename || resourceFile.name;
        // We'll store it in param 'file' for HydroShare
        params.file = [finalName, resourceFile];
      } else if (typeof resourceFile === 'string') {
        // Python allows resource_file to be a path. For pure JS in the browser,
        // we typically don't read local file paths. But for node or custom usage,
        // you'd do something else. We'll skip that for simplicity.
        throw new Error("resourceFile is a string path; not supported in a browser environment.");
      }
    }
  
    // Now build a FormData. We'll replicate the 'MultipartEncoder(params)' logic
    const formData = new FormData();
  
    // 1) Append resource_type and title, etc. as single fields
    formData.append('resource_type', params.resource_type);
    formData.append('title', params.title);
  
    if (params.abstract) {
      formData.append('abstract', params.abstract);
    }
  
    // 2) keywords -> each as "keywords[i]"
    if (keywords && keywords.length > 0) {
      keywords.forEach((kw, i) => {
        formData.append(`keywords[${i}]`, kw);
      });
    }
  
    // 3) If we have edit_users, pass them. The Python code sets `params['edit_users'] = [listOfUsernames]`.
    // But HydroShare expects repeated fields named 'edit_users' for each user. 
    // Or it can handle arrays if the library interprets them. 
    // We'll replicate the "list-of-strings => repeated param" approach:
    if (params.edit_users) {
      params.edit_users.forEach(u => {
        formData.append('edit_users', u);
      });
    }
    if (params.view_users) {
      params.view_users.forEach(u => {
        formData.append('view_users', u);
      });
    }
    if (params.edit_groups) {
      params.edit_groups.forEach(g => {
        formData.append('edit_groups', g);
      });
    }
    if (params.view_groups) {
      params.view_groups.forEach(g => {
        formData.append('view_groups', g);
      });
    }
  
    if (params.metadata) {
      formData.append('metadata', params.metadata);
    }
    if (params.extra_metadata) {
      formData.append('extra_metadata', params.extra_metadata);
    }
  
    // 4) If resource_file was set, we have 'params.file = [filename, fileObject]'
    if (params.file) {
      const [fname, fobj] = params.file;
      // Python sets 'params["file"] = (filename, fileobject)'. 
      // We'll replicate that by appending:
      formData.append('file', fobj, fname);
    }
  
    // 5) Progress callback
    // We can implement an 'onUploadProgress' with XHR or a library like 'fetch-blob' or axios.
    // Native fetch in browsers doesn't have a built-in progress event for uploading.
    // For a browser approach, you'd typically use an XHR. We'll show a minimal example below.
  
    // Convert Basic Auth
    const authString = btoa(`${username}:${password}`);
  
    // If we want to track progress in a browser environment, we must use XHR directly or a library.
    // Here's a minimal example with XHR to show how you'd get progress events:
    // If you don't need progress, skip this and do fetch().
  
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', `Basic ${authString}`);
  
      // Listen for progress
      // progress_callback is a user function that takes (uploadedBytes, totalBytes)
      if (typeof progressCallback === 'function') {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            progressCallback(e.loaded, e.total);
          }
        };
      }
  
      xhr.onload = () => {
        if (xhr.status === 201) {
          try {
            const resp = JSON.parse(xhr.responseText);
            const resourceId = resp.resource_id;
            resolve(resourceId);
          } catch (err) {
            reject(new Error('Error parsing JSON response: ' + xhr.responseText));
          }
        } else {
          reject(new Error(`HTTP ${xhr.status}: ${xhr.responseText || 'Request failed'}`));
        }
      };
  
      xhr.onerror = () => {
        reject(new Error(`Network error or CORS issue: ${xhr.status}`));
      };
  
      xhr.send(formData);
    });
  }


export const uploadFileToS3Cucket = async (
        s3_bucket,
        region,
        s3_access_key,
        s3_secret_key,
        file
    ) => {
            // S3 Credentials
        AWS.config.update({
        accessKeyId: s3_access_key,
        secretAccessKey: s3_secret_key,
        });
        const s3 = new AWS.S3({
            params: { Bucket: s3_bucket },
            region: region,
        });


        const params = {
            Bucket: s3_bucket,
            Key: file.name,
            Body: file,
        };

        // Uploading file to s3

        var upload = s3
        .putObject(params)
        .on("httpUploadProgress", (evt) => {
            // File uploading progress
            console.log(
            "Uploading " + parseInt((evt.loaded * 100) / evt.total) + "%"
            );
        })
        .promise();

        await upload.then((err, data) => {
        console.log(err);
        });
  };