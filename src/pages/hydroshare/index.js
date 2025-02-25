import React from "react";

import Header from "@site/src/components/Header";
import Layout from '@theme/Layout';
import HydroShareHelp from "@site/src/components/HydroShareHelp";

export default function HydroSharePage() {
  return (
    <Layout title="Applications" description="CIROH Applications">
    
      <div className="margin-top--lg">
        <Header 
            title="HydroShare Support your Research" 
            tagline="Discover content shared by your colleagues and other researchers. Access a broad range of data types used in hydrology." 
        />
      </div>

      <main>
        
       <HydroShareHelp 
          title="Sharing Research products with colleagues and others using FAIR Data Principles"
       />
      </main>
    
    </Layout>
  );
}

