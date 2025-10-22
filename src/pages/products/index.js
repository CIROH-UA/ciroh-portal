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
            tagline="En­hance fore­cast­ing, ana­lys­is, and wa­ter re­source man­age­ment by mak­ing your web ap­plic­a­tions and tools ac­cess­ible to CIROH and NOAA's hy­dro­lo­gic re­search ini­ti­at­ives."
            buttons={[
              { label: "Add your Product", href: contributeUrl, primary: true },
              { label: "Develop a Product", href: developUrl }
            ]}
        />
      </div>
      <main>
        <HydroShareResourcesSelector keyword="nwm_portal_app" defaultImage={defaultImage} />
        <TechBox items={items} type={"Applications"} tethys/>
      </main>
    
    </Layout>
  );
}

