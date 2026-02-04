import React from "react";
import HydroShareResourcesSelector from "@site/src/components/HydroShareResourcesSelector";
import Header from "@site/src/components/Header";
import Layout from '@theme/Layout';
import TechBox from "@site/src/components/TechBox";
import TethysLogoDark from '@site/static/img/tethys_logo2_black.png';
import TethysLogWhite from '@site/static/img/tethys_white_final.png';
import HydroShareLogo from '@site/static/img/hydroshare_white.png';
import useBaseUrl from '@docusaurus/useBaseUrl';

const items = [
  {
    lightIcon: TethysLogoDark,
    darkIcon: TethysLogWhite,
    alt: 'Tethys Platform',
  },
  {
    lightIcon: HydroShareLogo,
    darkIcon: HydroShareLogo,
    alt: 'HydroShare',
  },
];

export default function ProductsPage() {
  const developUrl = useBaseUrl('/develop');
  const contributeUrl = useBaseUrl('/contribute?current-contribution=apps');
  const defaultImage = 'https://ciroh-portal-static-data.s3.us-east-1.amazonaws.com/app_placeholder.png'
  return (
    <Layout title="Products" description="CIROH Products">
    
      <div className="margin-top--lg">
        <Header 
            title="Products" 
            tagline="Enhance forecasting, analysis, and water resource management by making your web applications and tools accessible to CIROH and NOAA's hydrologic research initiatives."
            buttons={[
              { label: "Add your Product", href: contributeUrl, primary: true },
              { label: "Develop a Product", href: developUrl }
            ]}
        />
      </div>
      <main>
        <HydroShareResourcesSelector keyword="nwm_portal_app,ciroh_hub_app" defaultImage={defaultImage} />
        <TechBox items={items} type={"Applications"} tethys/>
      </main>
    
    </Layout>
  );
}

