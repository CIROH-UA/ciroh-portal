import React from "react";
import HydroShareResourcesSelector from "@site/src/components/HydroShareResourcesSelector";
import Header from "@site/src/components/Header";
import Layout from '@theme/Layout';
import { items } from "./constants";
import TechBox from "@site/src/components/TechBox";

export default function DatasetsPage() {
  return (
    <Layout title="Datasets" description="CIROH Datasets">
    
      <div className="margin-top--lg">
        <Header 
            title="Datasets" 
            tagline="Datasets from CIROH and NOAA's hydrologic research, designed to enhance forecasting, analysis, and management of water resources."
            buttons={[
              { label: "Add your Dataset", href: "/contribute", primary: true },
            ]}
        />
      </div>

      <main>
        <HydroShareResourcesSelector keyword="ciroh_portal_data" />
        <TechBox items={items}/>
      </main>
    
    </Layout>
  );
}

