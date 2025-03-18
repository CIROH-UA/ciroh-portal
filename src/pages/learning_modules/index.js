import React from "react";
// import HydroShareResourcesSelector from "@site/src/components/HydroShareResourcesSelector";
import LearningModules from "@site/src/components/LearningModules";
import Header from "@site/src/components/Header";
import Layout from '@theme/Layout';
import TechBox from "@site/src/components/TechBox";
import HydroLearnLogo from '@site/static/img/hydrolearn_logo.png';
import useBaseUrl from '@docusaurus/useBaseUrl';


const items = [
  {
    lightIcon: HydroLearnLogo,
    darkIcon: HydroLearnLogo,
    alt: 'HydroLearn',
  },
];


export default function LearningModulesPage() {
  const contributeUrl = useBaseUrl('/contribute');

  return (
    <Layout title="Learning Modules" description="CIROH Learning Modules">
    
      <div className="margin-top--lg">
        <Header 
            title="Learning Modules" 
            tagline="Access a range of open courses and modules in hydrology, enriched with CIROH and NOAA research, designed for learners at all levels seeking to deepen their understanding of water science."
            buttons={[
              { label: "Add your Module", href: {contributeUrl}, primary: true },
              { label: "Visit the modules", href: "https://edx.hydrolearn.org/courses" }
            ]}
        />
      </div>

      <main>
      <LearningModules keyword="nwm_portal_module"/>
        {/* <HydroShareResourcesSelector keyword="nwm_portal_module"/> */}
        <TechBox items={items} type={"Learning Modules"}  />
      </main>
    
    </Layout>
  );
}

