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
            tagline="Join the community by sharing your work" 
        />
      </div>
      <main>
        <Contribute 
          title="Your contributions drive the future of water science."
          description={
            <div>
              Join the community by sharing your work
            </div>
          }
        />
      </main>
    
    </Layout>
  );
}
