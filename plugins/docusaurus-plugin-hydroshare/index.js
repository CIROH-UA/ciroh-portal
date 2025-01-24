// plugins/docusaurus-plugin-hydroshare/index.js
const fs = require('fs');
const path = require('path');

module.exports = function pluginHydroShare(context, options) {
  const { pathToJson = 'resources.json' } = options;

  return {
    name: 'docusaurus-plugin-hydroshare',

    // 1) Load the JSON content at build time
    async loadContent() {
      // Resolve the absolute path to the JSON file
      const jsonPath = path.resolve(process.cwd(), pathToJson);

      // If file doesn't exist, handle it gracefully or throw an error
      if (!fs.existsSync(jsonPath)) {
        console.warn(`[plugin-hydroshare] Could not find JSON file at: ${jsonPath}`);
        return null;
      }

      // Read the file and parse JSON
      const raw = fs.readFileSync(jsonPath, 'utf-8');
      const data = JSON.parse(raw);

      // Return data so we can pass it to "contentLoaded"
      return data;
    },

    // 2) Put the JSON data into "global data" so any page can use it
    async contentLoaded({ content, actions }) {
      if (!content) {
        return;
      }

      const { setGlobalData } = actions;
      // Save the entire JSON object under a key we can reference later
      setGlobalData({
        hydroShareAppsData: content,
      });
    },
  };
};
