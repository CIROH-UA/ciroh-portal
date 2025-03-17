import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import HydroShareResourceRow from "./HydroShareResourceRow";


export default function HydroShareResourcesRows({ resources, defaultImage }) {
  return (
    <div className={clsx("container", "margin-bottom--lg")}>
      <div className={styles.rowContainer}>
        {resources.map((res) => (
          <HydroShareResourceRow key={res.resource_id} resource={res} defaultImage={defaultImage} />
        ))}
      </div>
    </div>
  );
}