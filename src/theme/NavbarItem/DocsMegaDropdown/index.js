import React, { useState } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import { MdExpandMore } from 'react-icons/md';
import docsMenu from '@site/src/data/docsMenu';
import styles from './styles.module.css';

const DOCS_HOME = 'https://docs.ciroh.org';

const columns = [
  { title: 'Products', items: docsMenu.products ?? [] },
  { title: 'Services', items: docsMenu.services ?? [] },
].filter(column => Array.isArray(column.items) && column.items.length > 0);

function MobileColumn({ title, items = [] }) {
  if (!items.length) {
    return null;
  }

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
  const hasColumns = columns.length > 0;
  const labelText = label ?? 'Docs';

  if (mobile) {
    if (!hasColumns) {
      return (
        <li className="menu__list-item">
          <Link className="menu__link" to={DOCS_HOME}>
            <span className={styles.mobileLinkLabel}>{labelText}</span>
          </Link>
        </li>
      );
    }

    return (
      <>
        {columns.map(column => (
          <MobileColumn key={column.title} {...column} />
        ))}
      </>
    );
  }

  if (!hasColumns) {
    return (
      <Link className={clsx('navbar__item', 'navbar__link')} to={DOCS_HOME}>
        {labelText}
      </Link>
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
        <span>{labelText}</span>
        <MdExpandMore
          className={clsx(styles.chevron, open && styles.chevronOpen)}
          aria-hidden="true"
        />
      </button>

      <div
        className={clsx(styles.dropdownPanel, open && styles.dropdownPanelOpen)}
        role="menu"
        aria-label={`${labelText} menu`}
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
