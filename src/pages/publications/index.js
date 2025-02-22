import React from "react";
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Header from "@site/src/components/Header";
import Layout from '@theme/Layout';
import Publications from "@site/src/components/Publications";

export default function PublicationsPage() {
    const {
        siteConfig: {customFields},
      } = useDocusaurusContext();

  return (
    <Layout title="Publications" description="CIROH Publications">
    
      <div className="margin-top--lg">
        <Header 
            title="Publications" 
            tagline="Your publications are great!" 
        />
      </div>

      <main>
        
       <Publications 
          apiKey={customFields.zotero_api_key}
          groupId={customFields.zotero_group_id}
       />
      </main>
    
    </Layout>
  );
}

