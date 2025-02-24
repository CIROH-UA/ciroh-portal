import React from 'react';
import clsx from 'clsx';
import styles from './actionStyles.module.css';

const ActionButtons = ({ buttons }) => {

return(
    <div className={styles.actionButtons}>
        {buttons && buttons.length > 0 && (
        <div className={styles.buttons}>
          {buttons.map((button, index) => (
            <a
              key={index}
              href={button.href}
              className={clsx(
                'button',
                styles.button,
                button.primary ? styles.buttonPrimary : styles.buttonSecondary
              )}
            >
              {button.label}
            </a>
          ))}
        </div>
      )}
    </div>

);
}
export default ActionButtons;