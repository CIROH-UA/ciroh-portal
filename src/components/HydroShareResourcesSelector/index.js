import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { FaThLarge, FaBars } from "react-icons/fa";
import styles from "./styles.module.css";
import HydroShareResourcesTiles from "@site/src/components/HydroShareResourcesTiles";
import HydroShareResourcesRows from "@site/src/components/HydroShareResourcesRows";
import { fetchResourcesByKeyword, fetchResourceMetadata, fetchResourceCustomMetadata } from "@site/src/components/HydroShareImporter";
import { useColorMode } from "@docusaurus/theme-common"; // Hook to detect theme
import DatasetLightIcon from '@site/static/img/datasets_logo_light.png';
import DatasetDarkIcon from '@site/static/img/datasets_logo_dark.png';


export default function HydroShareResourcesSelector({ keyword = "nwm_portal_app", defaultImage }) {
  const { colorMode } = useColorMode(); // Get the current theme
  const PLACEHOLDER_ITEMS = 10;

  // Initialize with placeholder objects so that the component renders immediately.
  const initialPlaceholders = Array.from({ length: PLACEHOLDER_ITEMS }).map((_, index) => ({
    resource_id: `placeholder-${index}`,
    title: "",
    authors: "",
    resource_type: "",
    resource_url: "",
    description: "",
    thumbnail_url: "",
    page_url: "",
    docs_url: "",
  }));

  const hs_icon = colorMode === 'dark' ? DatasetDarkIcon : DatasetLightIcon;
  
  const [resources, setResources] = useState(initialPlaceholders);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("row");
  useEffect(() => {
    (async () => {
      try {
        // Start data fetching (while placeholders are already rendered)
        const resourceList = await fetchResourcesByKeyword(keyword);
        const mappedList = resourceList.map((res) => ({
          resource_id: res.resource_id,
          title: res.resource_title,
          authors: res.authors.map(
            (author) => author.split(',').reverse().join(' ')
          ).join(' 🖊️ '),
          resource_type: res.resource_type,
          resource_url: res.resource_url,
          description: res.abstract || "No description available.",
          thumbnail_url: "",
          page_url: "",
          docs_url: "",
          embed_url: "",
        }));

        // Replace placeholders with fetched data
        setResources(mappedList);
        setLoading(false);

        // Fetch metadata for each resource and update them individually
        for (let res of mappedList) {
          try {
            // const metadata = await fetchResourceMetadata(res.resource_id);
            const customMetadata = await fetchResourceCustomMetadata(res.resource_id);
            const updatedResource = {
              ...res,
              thumbnail_url: customMetadata?.thumbnail_url || hs_icon,
              page_url: customMetadata?.page_url || "",
              docs_url: customMetadata?.docs_url || "",
            };

            setResources((current) =>
              current.map((item) =>
                item.resource_id === updatedResource.resource_id ? updatedResource : item
              )
            );
          } catch (metadataErr) {
            console.error(`Error fetching metadata: ${metadataErr.message}`);
          }
        }
      } catch (err) {
        console.error(`Error fetching resources: ${err.message}`);
        setError(err.message);
        setLoading(false);
      }
    })();
  }, [keyword]);

  if (error) {
    return <p style={{ color: "red" }}>Error: {error}</p>;
  }

  return (
    <div className={clsx(styles.wrapper)}>
      <div className={clsx("container", "margin-bottom--lg")}>
        <div className={styles.header}>
          <div className={styles.viewToggle}>
            <button
              className={clsx(styles.toggleButton, { [styles.active]: view === "grid" })}
              onClick={() => setView("grid")}
              title="Grid View"
            >
              <FaThLarge size={18} />
            </button>
            <button
              className={clsx(styles.toggleButton, { [styles.active]: view === "row" })}
              onClick={() => setView("row")}
              title="List View"
            >
              <FaBars size={18} />
            </button>
          </div>
        </div>

        {view === "grid" ? (
          <HydroShareResourcesTiles resources={resources} />
        ) : (
          <HydroShareResourcesRows resources={resources} />
        )}
      </div>
    </div>
  );
}
