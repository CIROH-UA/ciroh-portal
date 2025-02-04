import React from "react";
import HydroShareResourcesSelector from "@site/src/components/HydroShareResourcesSelector";
// import HydroShareResourcesTiles from "@site/src/components/HydroShareResourcesTiles";
// import HydroShareResourcesRows from "@site/src/components/HydroShareResourceRow";
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
    repoUrl: "https://github.com/tethysplatform/tethys"

  },
  {
    lightIcon: HydroShareLogo,
    darkIcon: HydroShareLogo,
    title: "HydroShare",
    description:
      "HydroShare is CUAHSI's online collaboration environment for sharing data, models, and code.",
    link: "https://hydroshare.org/",
    repoUrl: "https://github.com/hydroshare/hydroshare"
  },
];



export default function HydroSharePage() {
  return (
    <Layout title="Applications" description="CIROH Applications">
      <div className="margin-top--lg">
        <Header 
            title="Web Applications" 
            tagline="En­hance fore­cast­ing, ana­lys­is, and wa­ter re­source man­age­ment by mak­ing your web ap­plic­a­tions and tools ac­cess­ible to CIROH and NOAA's hy­dro­lo­gic re­search ini­ti­at­ives." 
        />
      </div>

      <main>
        <HydroShareResourcesSelector keyword="nwm_portal_app" />
        <PoweredBy poweredByItems={poweredByItems} />

      </main>
    </Layout>
  );
}


{/* <HydroShareResourcesRows keyword="nwm_portal_app" /> */}
