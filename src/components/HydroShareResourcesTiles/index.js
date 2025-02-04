import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import HydroShareResourceCard from "./HydroShareResourceCard";


export default function HydroShareResourcesTiles({ resources }) {

  return (
    <div className={clsx("container", "margin-bottom--lg")}>
      
      <div className={styles.gridContainer}>
        {resources.map((res) => (
          <HydroShareResourceCard key={res.resource_id} resource={res} />
        ))}
      </div>
    </div>
  );
}