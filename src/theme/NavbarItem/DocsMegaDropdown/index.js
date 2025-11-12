import React, { useState } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import { MdExpandMore } from 'react-icons/md';
import docsMenu from '@site/src/pages/resources/resourcesMenu';
import styles from './styles.module.css';

const columns = [
  { title: 'Docs', items: docsMenu.docs },
];

function MobileColumn({ title, items }) {
  return (
    <>
      <li className="menu__list-item">
        <div className={styles.mobileHeading}>{title}</div>
      </li>
      {items.map(item => (
        <li key={item.id} className="menu__list-item">
          <Link className="menu__link" to={item.href}>
            <span className={styles.mobileLinkLabel}>{item.title}</span>
          </Link>
        </li>
      ))}
    </>
  );
}

export default function DocsMegaDropdown({
  mobile = false,
  label,
  ...props
}) {
  const [open, setOpen] = useState(false);

  if (mobile) {
    return (
      <>
        {columns.map(column => (
          <MobileColumn key={column.title} {...column} />
        ))}
      </>
    );
  }

  return (
    <div
      className={clsx('navbar__item', styles.dropdownWrapper)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setOpen(false);
        }
      }}
    >
      <button
        type="button"
        className={clsx('navbar__link', styles.trigger)}
        onClick={() => setOpen(toggle => !toggle)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span>{label}</span>
        <MdExpandMore
          className={clsx(styles.chevron, open && styles.chevronOpen)}
          aria-hidden="true"
        />
      </button>

      <div
        className={clsx(styles.dropdownPanel, open && styles.dropdownPanelOpen)}
        role="menu"
        aria-label={`${label} menu`}
      >
        {columns.map(column => (
          <div key={column.title} className={styles.column}>
            <p className={styles.columnTitle}>{column.title}</p>
            <ul className={styles.linkList}>
              {column.items.map(item => (
                <li key={item.id}>
                  <Link
                    className={styles.dropdownLink}
                    to={item.href}
                    onClick={() => setOpen(false)}
                  >
                    {item.icon && (
                      <div className={styles.linkIconWrapper}>
                        <item.icon className={styles.linkIcon} aria-hidden="true" />
                      </div>
                    )}
                    <div className={styles.linkCopy}>
                      <span className={styles.linkLabel}>{item.title}</span>
                      {item.description && (
                        <span className={styles.linkDescription}>
                          {item.description}
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}