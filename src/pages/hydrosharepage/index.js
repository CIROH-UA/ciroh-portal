import React from "react";
import HydroShareResourcesSelector from "@site/src/components/HydroShareResourcesSelector";
import Header from "@site/src/components/Header";
import Layout from '@theme/Layout';
import PoweredBy from '@site/src/components/PoweredBy';
import { poweredByItems } from "./constants";
import Contribute from "@site/src/components/Contribute";
import SectionPin from "@site/src/components/SectionPin";
import TethysSection from "@site/src/components/TethysSection";

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
        
       <TethysSection 
          title="Convey your CIROH Models and Data as Interactive Web Applications."
          description={
            <div>
              Tethys is an open-source Python-based framework designed specifically for developing geospatial web applications. 
              It simplifies the creation of apps that process, visualize, and analyze spatial data.
            </div>
          }
       />
      </main>
    
    </Layout>
  );
}


{/* <HydroShareResourcesRows keyword="nwm_portal_app" /> */}
