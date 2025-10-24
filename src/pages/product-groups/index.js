import React from 'react';
import Layout from '@theme/Layout';
import ProductGroupsWireframe from '@site/src/components/ProductGroupsWireframe';

export default function ProductGroupsPage() {
  return (
    <Layout
      title="Product Collections Wireframe"
      description="Prototype view that groups DocuHub collections into HydroShare-driven tiles."
    >
      <ProductGroupsWireframe />
    </Layout>
  );
}
