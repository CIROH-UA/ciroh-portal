import React, { useEffect, useState } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import HydroShareResourceCard from "./HydroShareResourceCard";
import { fetchResourcesByKeyword, fetchResourceMetadata } from "./utils";


export default function HydroShareResources({ keyword = "nwm_portal_app" }) {
  const PLACEHOLDER_ITEMS = 12;
  const [resources, setResources] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only run this fetch client-side to avoid SSR issues
    if (typeof window !== "undefined") {
      (async () => {
        try {
          setLoading(true);

          // 1. Fetch initial resource list with minimal fields
          const resourceList = await fetchResourcesByKeyword(keyword);

          // 2. Map the resource list to an initial shape
          //    Provide immediate access to "title" or "resource_title"
          //    and track placeholders for other fields:
          const mappedList = resourceList.map((res) => ({
            resource_id: res.resource_id,
            // Adjust the key for the resource title, depending on the actual JSON structure
            title: res.resource_title, 
            resource_type: res.resource_type,
            resource_url: res.resource_url,
            // Lazy-loaded fields initialize as empty (or placeholders)
            app_icon: "",
            home_page_url: "",
            source_code_url: "",
            help_page_url: "",
          }));

          setResources(mappedList);
          setLoading(false);

          // 3. For each resource, fetch metadata (lazy loading)
          //    Update the resource card data with additional fields
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

              // Update state for this one resource
              setResources((current) =>
                current.map((item) =>
                  item.resource_id === updatedResource.resource_id
                    ? updatedResource
                    : item
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
    }
  }, [keyword]);

  if (loading) {
    return (
      <div className={clsx("container")}>
      <div className={styles.gridContainer}>
        {Array.from({ length: PLACEHOLDER_ITEMS }).map((_, index) => (
          <div key={index} className={styles.gridItem}>
            <div className={styles.imageWrapper}>
              <div className={clsx(styles.imagePlaceholder, styles.placeholder)}></div>
            </div>
          </div>
        ))}
      </div>
      </div>
    );
  }

  if (error) {
    return <p style={{ color: "red" }}>Error: {error}</p>;
  }

  return (
    <div className={clsx("container")}>
      
      <div className={styles.gridContainer}>
        {resources.map((res) => (
          <HydroShareResourceCard key={res.resource_id} resource={res} />
        ))}
      </div>
    </div>
  );
}
