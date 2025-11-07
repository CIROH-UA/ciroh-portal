import React from 'react';
import NotFound from '@theme/NotFound';
import groups from './groups';
import ProductGroupDetailPage from './ProductGroupDetailPage';

export default function ProductGroupRoute({ group: groupModule }) {
  const groupData = groupModule?.default ?? groupModule;
  const groupId = groupData?.id;
  const matchedGroup = groups.find(group => group.id === groupId);

  if (!matchedGroup) {
    return <NotFound />;
  }

  return <ProductGroupDetailPage group={matchedGroup} />;
}
