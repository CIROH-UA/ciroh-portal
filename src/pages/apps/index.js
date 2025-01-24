import React from 'react';
import Layout from '@theme/Layout';
import HydroShareResources from '@site/src/components/HydroShareResources';
import SplitImageLayout from '@site/src/components/SplitImageLayout';
import Header from '@site/src/components/Header';
import useGlobalData from '@docusaurus/useGlobalData';
import TethysLogo from '@site/static/img/tethys_logo2_black.png';
import HydroShareLogo from '@site/static/img/hydroshare_white.png';

export default function AppsPage() {

    const globalData = useGlobalData();
    const pluginData = globalData['docusaurus-plugin-hydroshare']['default']['hydroShareAppsData'];
    
    const { resources = [] } = pluginData;
    return (
        <Layout title="Applications" description="CIROH Applications">
            <Header 
                title="Web Applications" 
                tagline="En­hance fore­cast­ing, ana­lys­is, and wa­ter re­source man­age­ment by mak­ing your web ap­plic­a­tions and tools ac­cess­ible to CIROH and NOAA's hy­dro­lo­gic re­search ini­ti­at­ives." 
            />
             <main>

            <HydroShareResources 
                resources={resources} 
                isLoading={false} 
            />
    <div>
      <SplitImageLayout
        image={TethysLogo}
        alt="A cool picture"
        title="Hello from the Split Layout"
        text="This is a short paragraph about this image. 
              You can style it however you like, 
              or even pass in React elements."
      />

      {/* Reversed layout: image on the right, text on the left */}
      <SplitImageLayout
        image={HydroShareLogo}
        alt="Another image"
        title="Another Section"
        text="Some interesting details about the image or topic."
        reverse
      />
    </div>


            </main>


        </Layout>

    );

}
