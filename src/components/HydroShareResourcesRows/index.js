import React, { useEffect, useState } from "react";
import clsx from "clsx";
import styles from "./styles.module.css"; // Updated styles file
import HydroShareResourceRow from "./HydroShareResourceRow";
// import { fetchResourcesByKeyword, fetchResourceMetadata } from "./utils";

export default function HydroShareResourcesRows({ resources }) {
  return (
    <div className={clsx("container", "margin-bottom--lg")}>
      <div className={styles.rowContainer}>
        {resources.map((res) => (
          <HydroShareResourceRow key={res.resource_id} resource={res} />
        ))}
      </div>
    </div>
  );
}


// export default function HydroShareResourcesRows({ keyword = "nwm_portal_app" }) {
  
    // const PLACEHOLDER_ITEMS = 10;
    // const [resources, setResources] = useState([]);
    // const [error, setError] = useState(null);
    // const [loading, setLoading] = useState(true);
  
    // useEffect(() => {
    //   if (typeof window !== "undefined") {
    //     (async () => {
    //       try {
    //         setLoading(true);
  
    //         const resourceList = await fetchResourcesByKeyword(keyword);
    //         const mappedList = resourceList.map((res) => ({
    //           resource_id: res.resource_id,
    //           title: res.resource_title,
    //           resource_type: res.resource_type,
    //           resource_url: res.resource_url,
    //           description: res.abstract || "No description available.",
    //           app_icon: "",
    //           home_page_url: "",
    //           source_code_url: "",
    //           help_page_url: "",
    //         }));
  
    //         setResources(mappedList);
    //         setLoading(false);
  
    //         for (let res of mappedList) {
    //           try {
    //             const metadata = await fetchResourceMetadata(res.resource_id);
    //             const updatedResource = {
    //               ...res,
    //               app_icon: metadata?.app_icon?.data_url || "",
    //               home_page_url: metadata?.app_home_page_url?.value || "",
    //               source_code_url: metadata?.source_code_url?.value || "",
    //               help_page_url: metadata?.help_page_url?.value || "",
    //             };
  
    //             setResources((current) =>
    //               current.map((item) =>
    //                 item.resource_id === updatedResource.resource_id ? updatedResource : item
    //               )
    //             );
    //           } catch (metadataErr) {
    //             console.error(`Error fetching metadata: ${metadataErr.message}`);
    //           }
    //         }
    //       } catch (err) {
    //         console.error(`Error fetching resources: ${err.message}`);
    //         setError(err.message);
    //         setLoading(false);
    //       }
    //     })();
    //   }
    // }, [keyword]);
  
    // if (loading) {
    //   return (
    //     <div className={clsx("container")}>
    //       <div className={styles.rowContainer}>
    //         {Array.from({ length: PLACEHOLDER_ITEMS }).map((_, index) => (
    //           <div key={index} className={styles.rowItem}>
    //             <div className={styles.imageWrapper}>
    //               <div className={clsx(styles.imagePlaceholder, styles.shimmer)}></div>
    //             </div>
    //             <div className={styles.textWrapper}>
    //               <div className={clsx(styles.titlePlaceholder, styles.shimmer)}></div>
    //               <div className={clsx(styles.descriptionPlaceholder, styles.shimmer)}></div>
    //             </div>
    //           </div>
    //         ))}
    //       </div>
    //     </div>
    //   );
    // }
  
    // if (error) {
    //   return <p style={{ color: "red" }}>Error: {error}</p>;
    // }
  
  //   return (
  //     <div className={clsx("container", "margin-bottom--lg")}>
  //       <h1 className={styles.heading}>Applications</h1>
  //       <div className={styles.rowContainer}>
  //         {resources.map((res) => (
  //           <HydroShareResourceRow key={res.resource_id} resource={res} />
  //         ))}
  //       </div>
  //     </div>
  //   );
  // }
  