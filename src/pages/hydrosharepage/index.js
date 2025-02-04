import React from "react";
import HydroShareResourcesSelector from "@site/src/components/HydroShareResourcesSelector";
import Header from "@site/src/components/Header";
import Layout from '@theme/Layout';
import PoweredBy from '@site/src/components/PoweredBy';
import { poweredByItems,contributeAppCards } from "./constants";
import Contribute from "@site/src/components/Contribute";

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
        <Contribute 
          title="Add your application to the CIROH App Suite"
          description={
            <div>
              Powered by <a href="https://www.hydroshare.org/">HydroShare</a> create a new App Conector Resource, Add the required metadata, while
              adding the <code>nwm_portal_app</code> keyword to make it discoverable
            </div>
          }
        />

      </main>
    </Layout>
  );
}


{/* <HydroShareResourcesRows keyword="nwm_portal_app" /> */}
