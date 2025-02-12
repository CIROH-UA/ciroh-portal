import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { FaThLarge, FaBars } from "react-icons/fa";
import styles from "./styles.module.css";
import HydroShareResourcesTiles from "@site/src/components/HydroShareResourcesTiles";
import HydroShareResourcesRows from "@site/src/components/HydroShareResourcesRows";
import { fetchResourcesByKeyword, fetchResourceMetadata } from "./utils";

export default function HydroShareResourcesSelector({ keyword = "nwm_portal_app" }) {
  const PLACEHOLDER_ITEMS = 10;

  // Initialize with placeholder objects so that the component renders immediately.
  const initialPlaceholders = Array.from({ length: PLACEHOLDER_ITEMS }).map((_, index) => ({
    resource_id: `placeholder-${index}`,
    title: "",
    resource_type: "",
    resource_url: "",
    description: "",
    app_icon: "",
    home_page_url: "",
    source_code_url: "",
    help_page_url: "",
  }));

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
          resource_type: res.resource_type,
          resource_url: res.resource_url,
          description: res.abstract || "No description available.",
          app_icon: "",
          home_page_url: "",
          source_code_url: "",
          help_page_url: "",
        }));

        // Replace placeholders with fetched data
        setResources(mappedList);
        setLoading(false);

        // Fetch metadata for each resource and update them individually
        for (let res of mappedList) {
          try {
            const metadata = await fetchResourceMetadata(res.resource_id);
            const updatedResource = {
              ...res,
              app_icon: metadata?.app_icon?.data_url || "",
              home_page_url: metadata?.app_home_page_url?.value || "",
              source_code_url: metadata?.source_code_url?.value || "",
              help_page_url: metadata?.help_page_url?.value || "",
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
          <HydroShareResourcesTiles resources={resources}/>
        ) : (
          <HydroShareResourcesRows resources={resources}/>
        )}
      </div>
    </div>
  );
}
