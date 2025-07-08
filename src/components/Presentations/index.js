import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { FaThLarge, FaBars, FaListUl } from "react-icons/fa";
import styles from "./styles.module.css";
import HydroShareResourcesTiles from "@site/src/components/HydroShareResourcesTiles";
import HydroShareResourcesRows from "@site/src/components/HydroShareResourcesRows";
import { fetchResource, fetchResourcesByKeyword, getCuratedIds,fetchResourceCustomMetadata, joinExtraResources } from "../HydroShareImporter";
import { useColorMode } from "@docusaurus/theme-common"; // Hook to detect theme
import DatasetLightIcon from '@site/static/img/datasets_logo_light.png';
import DatasetDarkIcon from '@site/static/img/datasets_logo_dark.png';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { MdFilterList } from "react-icons/md";

export default function Presentations({ community_id = 4 }) {
  const { colorMode } = useColorMode(); // Get the current theme
  const hs_icon = colorMode === 'dark' ? DatasetDarkIcon : DatasetLightIcon;
  const CURATED_PARENT_ID = "302dcbef13614ac486fb260eaa1ca87c"; // TODO

  const PLACEHOLDER_ITEMS = 10;
  const initialPlaceholders = Array.from({ length: PLACEHOLDER_ITEMS }).map((_, index) => ({
    resource_id: `placeholder-${index}`,
    title: "",
    resource_type: "",
    resource_url: "",
    description: "",
    thumbnail_url: "",
    page_url: "",
    docs_url: ""
  }));

  const [resources, setResources] = useState(initialPlaceholders);   // all resources
  const [curatedResources, setCuratedResources] = useState(initialPlaceholders);     // subset for the curated tab
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("row");

  useEffect(() => {
    // Fetch the curated resources first (from the "parent" resource).
    const fetchCuratedResources = async () => {
      try {
        const curatedIds = await getCuratedIds(CURATED_PARENT_ID);

        const curatedResources = await Promise.all(curatedIds.map(async (id) => {
          const resource = await fetchResource(id);
          return resource;
        }));

        return curatedResources;
      } catch (err) {
        console.error("Error fetching curated resources:", err);
        return [];
      }
    };

    // Fetch all resources by keyword and/or curation
    const fetchAll = async () => {
      try {
        const [curatedResources, keywordResources] = await Promise.all([
          fetchCuratedResources(), // get array of curated resource IDs
          fetchResourcesByKeyword("ciroh_portal_presentation"), // intermediate step
        ]);
        const resourceList = joinExtraResources(curatedResources, keywordResources); // Merge ensures backwards compatibility for presentations predating the keyword

        // Map the full resource lists to your internal format
        const mappedList = resourceList.map((res) => ({
          resource_id: res.resource_id,
          title: res.resource_title,
          resource_type: res.resource_type,
          resource_url: res.resource_url,
          description: res.abstract || "No description available.",
          thumbnail_url: hs_icon,
          page_url: "",
          docs_url: ""
        }));

        // From Gio: apply custom thumbnail metadata
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

        setResources(mappedList);
        
        const mappedCurated = curatedResources.map((res) => ({
          resource_id: res.resource_id,
          title: res.resource_title,
          resource_type: res.resource_type,
          resource_url: res.resource_url,
          description: res.abstract || "No description available.",
          thumbnail_url: hs_icon,
          page_url: "",
          docs_url: ""
        }));
        setCuratedResources(mappedCurated);

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
