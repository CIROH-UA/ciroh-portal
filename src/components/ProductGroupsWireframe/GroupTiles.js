import React from 'react';
import clsx from 'clsx';
import GroupTile from './GroupTile';
import styles from './styles.module.css';

export default function GroupTiles({
  groups,
  activeGroupId,
  onSelect,
  variant = 'grid',
}) {
  return (
    <div
      className={clsx(
        styles.tilesGrid,
        variant === 'grid' ? styles.tilesGridGrid : styles.tilesGridList,
      )}
    >
      {groups.map(group => (
        <GroupTile
          key={group.id}
          group={group}
          isActive={group.id === activeGroupId}
          onSelect={onSelect}
          variant={variant}
        />
      ))}
    </div>
  );
}
