import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { FaThLarge, FaBars } from "react-icons/fa";
import styles from "./styles.module.css";
import HydroShareResourcesTiles from "@site/src/components/HydroShareResourcesTiles";
import HydroShareResourcesRows from "@site/src/components/HydroShareResourcesRows";
import { fetchResourcesByGroup } from "./utils";

import { useColorMode } from "@docusaurus/theme-common"; // Hook to detect theme
import DatasetLightIcon from '@site/static/img/datasets_logo_light.png';
import DatasetDarkIcon from '@site/static/img/datasets_logo_dark.png';

export default function Datasets({ groupId = 4 }) {
  
    const { colorMode } = useColorMode(); // Get the current theme
    const hs_icon = colorMode === 'dark' ? DatasetDarkIcon : DatasetLightIcon;
    const PLACEHOLDER_ITEMS = 10;

  // Initialize with placeholder objects so that the component renders immediately.
  const initialPlaceholders = Array.from({ length: PLACEHOLDER_ITEMS }).map((_, index) => ({
    resource_id: `placeholder-${index}`,
    title: "",
    resource_type: "",
    resource_url: "",
    description: "",
    app_icon: ""
  }));

  const [resources, setResources] = useState(initialPlaceholders);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("row");

  useEffect(() => {
    (async () => {
      try {
        // Start data fetching (while placeholders are already rendered)
        const resourceList = await fetchResourcesByGroup(groupId);
        const mappedList = resourceList.map((res) => ({
          resource_id: res.resource_id,
          title: res.resource_title,
          resource_type: res.resource_type,
          resource_url: res.resource_url,
          description: res.abstract || "No description available.",
          app_icon: hs_icon,
        }));

        // Replace placeholders with fetched data
        setResources(mappedList);
        setLoading(false);

      } catch (err) {
        console.error(`Error fetching resources: ${err.message}`);
        setError(err.message);
        setLoading(false);
      }
    })();
  }, [groupId]);

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
