import React from "react";
import Header from "@site/src/components/Header";
import Layout from '@theme/Layout';
import Contribute from "@site/src/components/Contribute";


export default function ContributePage() {
  return (
    <Layout title="Applications" description="CIROH Applications">
    
      <div className="margin-top--lg">
        <Header 
            title="Building the Whole Community Together" 
            tagline="Join the community Your Applications, Datasets, Publications and make CIROH better" 
        />
      </div>

      <main>
        <Contribute 
          title="Add your Application to the CIROH App Suite"
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
