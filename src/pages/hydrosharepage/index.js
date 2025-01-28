import React from "react";
import HydroShareResources from "@site/src/components/DynamicHydroShareResources";
import Header from "@site/src/components/Header";
import Layout from '@theme/Layout';
import PoweredBy from '@site/src/components/PoweredBy';
import TethysLogoDark from '@site/static/img/tethys_logo2_black.png';
import TethysLogWhite from '@site/static/img/tethys_white_final.png';
import HydroShareLogo from '@site/static/img/hydroshare_white.png';

const poweredByItems = [
  {
    lightIcon: TethysLogoDark,
    darkIcon: TethysLogWhite,
    title: "Tethys Platform",
    description:
      "Tethys Platform has been designed to lower the barrier to geospatial web app development. Convey your models and data as interactive web apps.",
    link: "https://www.tethysplatform.org/",
  },
  {
    lightIcon: HydroShareLogo,
    darkIcon: HydroShareLogo,
    title: "HydroShare",
    description:
      "HydroShare is CUAHSI's online collaboration environment for sharing data, models, and code.",
    link: "https://hydroshare.org/",
  },
];



export default function HydroSharePage() {
  return (
    <Layout title="Applications" description="CIROH Applications">
      <Header 
          title="Web Applications" 
          tagline="En­hance fore­cast­ing, ana­lys­is, and wa­ter re­source man­age­ment by mak­ing your web ap­plic­a­tions and tools ac­cess­ible to CIROH and NOAA's hy­dro­lo­gic re­search ini­ti­at­ives." 
      />
      <main>
        <PoweredBy poweredByItems={poweredByItems} />
        <HydroShareResources keyword="nwm_portal_app" />
      </main>


    </Layout>
  );
}



