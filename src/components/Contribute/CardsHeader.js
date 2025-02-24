

import React from 'react';
import styles from './cardsHeaderStyles.module.css';

const CardsHeader = ({header}) => {

return(
    <div className={styles.headerContainer}>
        <h2 className={styles.title}>{header}</h2>
    </div>
)};
export default CardsHeader;

