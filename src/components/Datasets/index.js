import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { FaThLarge, FaBars, FaListUl } from "react-icons/fa";
import styles from "./styles.module.css";
import HydroShareResourcesTiles from "@site/src/components/HydroShareResourcesTiles";
import HydroShareResourcesRows from "@site/src/components/HydroShareResourcesRows";
import { getCommunityResources, getCuratedIds } from "./utils";
import { useColorMode } from "@docusaurus/theme-common"; // Hook to detect theme
import DatasetLightIcon from '@site/static/img/datasets_logo_light.png';
import DatasetDarkIcon from '@site/static/img/datasets_logo_dark.png';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { MdFilterList } from "react-icons/md";

export default function Datasets({ community_id = 4 }) {
  const { colorMode } = useColorMode(); // Get the current theme
  const hs_icon = colorMode === 'dark' ? DatasetDarkIcon : DatasetLightIcon;
  const CURATED_PARENT_ID = "302dcbef13614ac486fb260eaa1ca87c";

  const PLACEHOLDER_ITEMS = 10;
  const initialPlaceholders = Array.from({ length: PLACEHOLDER_ITEMS }).map((_, index) => ({
    resource_id: `placeholder-${index}`,
    title: "",
    resource_type: "",
    resource_url: "",
    description: "",
    app_icon: ""
  }));

  const [resources, setResources] = useState(initialPlaceholders);   // all resources
  const [curatedResources, setCuratedResources] = useState([]);     // subset for the curated tab
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("row");

  useEffect(() => {
    // Fetch the curated IDs first (from the "parent" resource).
    const fetchCurated = async () => {
      try {
        const curatedIds = await getCuratedIds(CURATED_PARENT_ID);
        console.log("Curated IDs:", curatedIds);
        return curatedIds;
      } catch (err) {
        console.error("Error fetching curated IDs:", err);
        return [];
      }
    };

    // Fetch all resources by group, then filter them based on curated IDs
    const fetchAll = async () => {
      try {
        const [curatedIds, resourceList] = await Promise.all([
          fetchCurated(),                // get array of curated resource IDs
          getCommunityResources() // get all resources for the group
        ]);

        // Map the full resource list to your internal format
        const mappedList = resourceList.map((res) => ({
          resource_id: res.resource_id,
          title: res.resource_title,
          resource_type: res.resource_type,
          resource_url: res.resource_url,
          description: res.abstract || "No description available.",
          app_icon: hs_icon,
        }));
        console.log("Mapped resources:", mappedList);
        // Filter to get only curated subset
        const curatedSubset = mappedList.filter(item =>
          curatedIds.includes(item.resource_id)
        );

        setResources(mappedList);
        setCuratedResources(curatedSubset);
        setLoading(false);
      } catch (err) {
        console.error(`Error fetching resources: ${err.message}`);
        setError(err.message);
        setLoading(false);
      }
    };

    // Kick off fetch
    fetchAll();
  }, [community_id]);

  if (error) {
    return <p style={{ color: "red" }}>Error: {error}</p>;
  }

  return (
    <div className={clsx(styles.wrapper)}>
      <div className={clsx("container", "margin-bottom--lg")}>
        {/* Toggle between grid view & list view */}
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

        {/* Tabs for "All" and "Curated" */}
        <Tabs className={styles.contributeTabs}>
          <TabItem
            value="all"
            label={
              <span className={styles.tabLabel}>
                <FaListUl className={styles.tabIcon} /> All
              </span>
            }
            default
          >
            {view === "grid" ? (
              <HydroShareResourcesTiles resources={resources} loading={loading} />
            ) : (
              <HydroShareResourcesRows resources={resources} loading={loading} />
            )}
          </TabItem>

          <TabItem
            value="curated"
            label={
              <span className={styles.tabLabel}>
                <MdFilterList className={styles.tabIcon} /> Curated
              </span>
            }
          >
            {view === "grid" ? (
              <HydroShareResourcesTiles resources={curatedResources} loading={loading} />
            ) : (
              <HydroShareResourcesRows resources={curatedResources} loading={loading} />
            )}
          </TabItem>
        </Tabs>
      </div>
    </div>
  );
}
