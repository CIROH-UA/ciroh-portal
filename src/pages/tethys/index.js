import React from "react";

import Header from "@site/src/components/Header";
import Layout from '@theme/Layout';
import TethysSection from "@site/src/components/TethysSection";

export default function TethysPage() {
  return (
    <Layout title="Applications" description="CIROH Applications">
    
      <div className="margin-top--lg">
        <Header 
            title="Convey your CIROH models and data" 
            tagline="Tethys Platform has been designed to lower the barrier to geospatial web app development" 
        />
      </div>

      <main>
        
       <TethysSection 
          title="Geospatial and scientfic web applications for the 21st century"
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

