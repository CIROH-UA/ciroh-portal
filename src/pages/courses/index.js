import React from "react";
// import HydroShareResourcesSelector from "@site/src/components/HydroShareResourcesSelector";
import Courses from "@site/src/components/Courses";
import Header from "@site/src/components/Header";
import Layout from '@theme/Layout';
import TechBox from "@site/src/components/TechBox";
import HydroLearnLogo from '@site/static/img/hydrolearn_logo.png';
import useBaseUrl from '@docusaurus/useBaseUrl';
import HydroShareLogo from '@site/static/img/hydroshare_white.png';

const items = [
  {
    lightIcon: HydroLearnLogo,
    darkIcon: HydroLearnLogo,
    alt: 'HydroLearn',
  },
    {
      lightIcon: HydroShareLogo,
      darkIcon: HydroShareLogo,
      alt: 'HydroShare',
    },
];


export default function CoursesPage() {
  const contributeUrl = useBaseUrl('/contribute');

  return (
    <Layout title="Courses" description="CIROH Courses">
    
      <div className="margin-top--lg">
        <Header 
            title="Courses" 
            tagline="Access a range of open courses in hydrology, enriched with CIROH and NOAA research, designed for learners at all levels seeking to deepen their understanding of water science."
            buttons={[
              { label: "Add your Course", href: contributeUrl, primary: true },
            ]}
        />
      </div>

      <main>
      <Courses keyword="nwm_portal_module"/>
        
        <TechBox items={items} type={"Courses"}  />
      </main>
    
    </Layout>
  );
}

