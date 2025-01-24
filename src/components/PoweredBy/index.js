import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

export default function PoweredBy({ poweredByItems }) {
  return (
    <section className={clsx(styles.poweredBySection)}>
      <h2 className={styles.heading}>Powered By</h2>
      <div className={styles.cardContainer}>
        {poweredByItems.map((item, index) => (
          <div className={styles.card} key={index}>
            <div className={styles.iconWrapper}>{item.icon}</div>
            <p className={styles.cardDescription}>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
