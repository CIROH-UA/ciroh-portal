import React from "react";
// import HydroShareResourcesSelector from "@site/src/components/HydroShareResourcesSelector";
import Header from "@site/src/components/Header";
import Layout from '@theme/Layout';
import TechBox from "@site/src/components/TechBox";
import Datasets from "@site/src/components/Datasets";
import HydroShareLogo from '@site/static/img/hydroshare_white.png';
import useBaseUrl from '@docusaurus/useBaseUrl';

const items = [
  {
    lightIcon: HydroShareLogo,
    darkIcon: HydroShareLogo,
    alt: 'HydroShare',
  },
];



export default function DatasetsPage() {
  const contributeUrl = useBaseUrl('/contribute?current-contribution=datasets');

  return (
    <Layout title="Datasets" description="CIROH Datasets">
    
      <div className="margin-top--lg">
        <Header 
            title="Datasets" 
            tagline="Datasets from CIROH and NOAA's hydrologic research, designed to enhance forecasting, analysis, and management of water resources."
            buttons={[
              { label: "Add your Dataset", href: contributeUrl, primary: true },
            ]}
        />
      </div>

      <main>
        <Datasets/>

        {/* <HydroShareResourcesSelector keyword="ciroh_portal_data" /> */}
        <TechBox items={items} type={"Datasets"}  />
      </main>
    
    </Layout>
  );
}

