import React from "react";
import HydroShareResourceCard from "./HydroShareResourceCard";
import styles from "./styles.module.css";
import clsx from "clsx"; // Use clsx for combining classes

export default function HydroShareResources({ resources = [] }) {
  return (
    <div className={clsx("container")}>
      <div className={styles.gridContainer}>
        {resources.map((res, idx) => (
          <HydroShareResourceCard resource={res} key={idx} />
        ))}
      </div>
    </div>
  );
}
