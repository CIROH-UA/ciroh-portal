import React, { useState } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import { MdKeyboardArrowDown, MdArticle } from 'react-icons/md';
import sidebarData from './sidebarData';
import styles from './styles.module.css';

function SidebarCategory({ item, level, renderItems, onSelect, activeItem }) {
  const [isOpen, setIsOpen] = useState(item.collapsed ? false : true);
  const id = item.id || `category-${item.label}`;
  const isActive = activeItem?.id === id;

  const handleToggle = () => {
    setIsOpen(open => !open);
    onSelect?.({ type: 'category', id, label: item.label });
  };

  return (
    <div
      className={clsx(
        styles.sidebarCategory,
        level > 0 && styles.sidebarCategoryNested,
        isActive && styles.sidebarActive,
      )}
    >
      <button
        type="button"
        className={styles.sidebarCategoryButton}
        onClick={handleToggle}
        aria-expanded={isOpen}
      >
        <span className={styles.sidebarCategoryLabel}>{item.label}</span>
        <MdKeyboardArrowDown
          className={clsx(
            styles.sidebarChevron,
            isOpen && styles.sidebarChevronOpen,
          )}
          size={18}
        />
      </button>
      {isOpen && (
        <div className={styles.sidebarChildren}>
          {renderItems(item.items, level + 1)}
        </div>
      )}
    </div>
  );
}

function SidebarLink({ item, level, onSelect, activeItem }) {
  const id = item.id || item.to || `link-${item.label}`;
  const isActive = activeItem?.id === id;

  return (
    <Link
      to={item.to}
      className={clsx(
        styles.sidebarLink,
        level > 0 && styles.sidebarLinkNested,
        isActive && styles.sidebarActiveLink,
      )}
      onClick={e => {
        e.preventDefault();
        onSelect?.({ type: 'link', id, label: item.label, to: item.to });
      }}
    >
      <MdArticle className={styles.sidebarLinkIcon} size={16} />
      <span>{item.label}</span>
    </Link>
  );
}

export default function GroupSidebar({ groupId, onBack, onSelect, activeItem }) {
  const sections = sidebarData[groupId];
  if (!sections) return null;

  const renderItems = (items, level = 0) =>
    items.map(navItem => {
      if (navItem.type === 'category') {
        return (
          <SidebarCategory
            key={`category-${navItem.label}`}
            item={navItem}
            level={level}
            renderItems={renderItems}
            onSelect={onSelect}
            activeItem={activeItem}
          />
        );
      }

      if (navItem.type === 'link') {
        return (
          <SidebarLink
            key={`link-${navItem.to || navItem.label}`}
            item={navItem}
            level={level}
            onSelect={onSelect}
            activeItem={activeItem}
          />
        );
      }

      return null;
    });

  return (
    <nav className={styles.sidebarNav} aria-label="Product group navigation">
      <Link to="/product-groups" className={styles.backButton}>
        All Products
      </Link>
      <div className={styles.sidebarNavSections}>{renderItems(sections)}</div>
    </nav>
  );
}
