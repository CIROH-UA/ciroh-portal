import React, { useState } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import { MdExpandMore } from 'react-icons/md';
import groups from '@site/src/components/ProductGroups/groups';
import styles from './styles.module.css';

const buildGroupLink = id => `/product-groups/${id}`;

function MobileList({ label }) {
  return (
    <>
      <li className="menu__list-item">
        <div className={styles.mobileHeading}>{label}</div>
      </li>
      {groups.map(group => (
        <li key={group.id} className="menu__list-item">
          <Link className="menu__link" to={buildGroupLink(group.id)}>
            <span className={styles.mobileLinkLabel}>{group.title}</span>
          </Link>
        </li>
      ))}
    </>
  );
}

export default function ProductGroupsDropdownNavbarItem({
  mobile = false,
  label,
  ...props
}) {
  const [open, setOpen] = useState(false);

  if (mobile) {
    return <MobileList label={label} />;
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
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <div className={styles.column}>
          <p className={styles.columnTitle}>Explore</p>
          <ul className={styles.linkList}>
            {groups.map(group => {
              const Icon = group.icon;
              return (
                <li key={group.id}>
                  <Link
                    className={styles.dropdownLink}
                    to={buildGroupLink(group.id)}
                    onClick={() => setOpen(false)}
                  >
                    <div className={styles.linkIconWrapper}>
                      {Icon ? <Icon className={styles.linkIcon} /> : null}
                    </div>
                    <div className={styles.linkCopy}>
                      <span className={styles.linkLabel}>{group.title}</span>
                      <span className={styles.linkDescription}>
                        {group.blurb}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
