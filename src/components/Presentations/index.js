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
  const CURATED_PARENT_ID = "200fa86bea61438aa862d437103485db";
  // The name is a holdover from the "datasets" tab. This "curated" list actually serves as a
  // backwards compatibility layer to ensure that older presentations can be included in this tab.

  const PLACEHOLDER_ITEMS = 10;
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
    embed_url: "",
  }));

  const [resources, setResources] = useState(initialPlaceholders);   // all resources
  const [collections, setCollections] = useState(initialPlaceholders);
  //const [curatedResources, setCuratedResources] = useState(initialPlaceholders); // Deprecated
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("row");

  useEffect(() => {
    // Maps a resource list to the internal format, including custom metadata
    const mapWithCustomMetadata = async (resourceList) => {
      const mapping = await Promise.all(resourceList.map(async (res) => {
        let customMetadata = null;
        try {
          customMetadata = await fetchResourceCustomMetadata(res.resource_id);
        } catch (metadataErr) {
          console.error(`Error fetching metadata: ${metadataErr.message}`);
        }
        let embedUrl = "";
        if (customMetadata?.pres_path) embedUrl = `https://www.hydroshare.org/resource/${res.resource_id}/data/contents/${customMetadata.pres_path}`;
        return {
          resource_id: res.resource_id,
          title: res.resource_title,
          authors: res.authors.map(
            (author) => author.split(',').reverse().join(' ')
          ).join(' 🖊️ '),
          resource_type: res.resource_type,
          resource_url: res.resource_url,
          description: res.abstract || "No description available.",
          thumbnail_url: customMetadata?.thumbnail_url || hs_icon,
          page_url: customMetadata?.page_url || "",
          docs_url: customMetadata?.docs_url || "",
          embed_url: embedUrl,
        }
      }));
      return mapping;
    }

    // Fetch the curated resources first (from the "parent" resource).
    const fetchRawCuratedResources = async () => {
      try {
        const curatedIds = await getCuratedIds(CURATED_PARENT_ID);

        const curatedList = await Promise.all(curatedIds.map(async (id) => {
          const resource = await fetchResource(id);
          return resource;
        }));

        return curatedList;
      } catch (err) {
        console.error("Error fetching curated resources:", err);
        return [];
      }
    };

    // Fetch all resources by keyword and/or curation
    const fetchAll = async () => {
      try {
        const [rawCuratedResources, invKeywordResources, invCollections] = await Promise.all([
          fetchRawCuratedResources(), // get array of curated resource IDs
          fetchResourcesByKeyword("ciroh_portal_presentation"), // Chronological order
          fetchResourcesByKeyword("ciroh_portal_pres_collections"),
        ]);
        const rawKeywordResources = invKeywordResources.reverse(); // Reverse chronological order
        const rawCollections = invCollections.reverse();
        const rawResources = joinExtraResources(rawKeywordResources, rawCuratedResources); // Merge ensures backwards compatibility for presentations predating the keyword

        // Map the full resource lists to your internal format (with custom metadata)
        const mappedResources = await mapWithCustomMetadata(rawResources);
        const mappedCollections = await mapWithCustomMetadata(rawCollections);
        //const mappedCurated = await mapWithCustomMetadata(rawCuratedResources); // If uncommenting, merge this and the above line into a Promise.all call
        
        setResources(mappedResources);
        setCollections(mappedCollections);
        //setCuratedResources(mappedCurated);

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

        {/* Tabs for "Presentations" and "Collections" */}
        <Tabs className={styles.contributeTabs}>
          <TabItem
            value="presentations"
            label={
              <span className={styles.tabLabel}>
                <FaListUl className={styles.tabIcon} /> Presentations
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
            value="collections"
            label={
              <span className={styles.tabLabel}>
                <MdFilterList className={styles.tabIcon} /> Collections
              </span>
            }
          >
            {view === "grid" ? (
              <HydroShareResourcesTiles resources={collections} loading={loading} />
            ) : (
              <HydroShareResourcesRows resources={collections} loading={loading} />
            )}
          </TabItem>
        </Tabs>
      </div>
    </div>
  );
}
