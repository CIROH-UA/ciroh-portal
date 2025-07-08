import React from "react";
import Header from "@site/src/components/Header";
import Layout from '@theme/Layout';
import Contribute from "@site/src/components/Contribute";


export default function ContributePage() {
  return (
    <Layout title="Contribute" description="Contribute to CIROH Portal">
      <div className="margin-top--lg">
        <Header 
            title="Building the Whole Community Together" 
            tagline="Amplify your hydrologic work through community collaboration. Whether 
                you're sharing existing resources or building new solutions, your 
                contribution accelerates water prediction innovation for flood 
                resilience and drought management." 
        />
      </div>
      <main>
        <Contribute 
          title="Your contributions drive the future of water science."
        />
      </main>
    
    </Layout>
  );
}
