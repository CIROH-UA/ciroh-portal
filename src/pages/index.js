import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import FrameworkHero from '@site/src/components/FrameworkHero';

import GeneralHomeSection from '@site/src/components/GeneralHomeSection';

import PublicationsExampleLight from '@site/static/img/zotero_publications_light.png';
import PublicationsExampleDark from '@site/static/img/zotero_publications_dark.png';
import PortalAppExampleLight from '@site/static/img/portal_apps_light.png';
import PortalAppExampleDark from '@site/static/img/portal_apps_dark.png';
import PortalDatasetsExampleLight from '@site/static/img/home_datasets_light.png';
import PortalDatasetsExampleDark from '@site/static/img/home_datasets_dark.png';
import PortalLearningExampleLight from '@site/static/img/home_learning_ modules_light.png';
import PortalLearningExampleDark from '@site/static/img/home_learning_ modules_dark.png';

import DocuHubLight from '@site/static/img/docuhub_light.png';
import DocuHubDark from '@site/static/img/docuhub_dark.png';


export default function Home() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title="CIROH Research Portal: Advancing Hydrological Science with NOAA"
      description="A central portal for exploring collaborative web apps, datasets, publications, and learning modules in hydrological research from CIROH and NOAA."
    >
      {/* Hero / Banner Section */}
      <FrameworkHero />

      <main>
        {/* Applications Section */}
        <GeneralHomeSection
          title="Empower Your Projects with Collaborative Web Applications"
          description="Leverage innovative web apps built in partnership with NOAA’s hydrologic research. Enhance water resource management, forecasting, and analysis through interactive tools—ensuring broad accessibility and real-time insights."
          lightImage={PortalAppExampleLight}
          darkImage={PortalAppExampleDark}
        />

        {/* Documents Section */}
        <GeneralHomeSection
          title="CIROH DocuHub"
          description="A carefully curated central repository providing in-depth technical insights into CIROH's projects, services, and documentation"
          lightImage={DocuHubLight}
          darkImage={DocuHubDark}
          background="secondary"
        />

        {/* Datasets Section */}
        <GeneralHomeSection
          title="Streamlined Hydrological Datasets"
          description="Access curated datasets from CIROH and NOAA, offering timely and historical water-related data. From river flows to atmospheric conditions, these resources support advanced modeling, forecasting, and decision-making."
          lightImage={PortalDatasetsExampleLight}
          darkImage={PortalDatasetsExampleDark}
        />

        {/* Publications Section */}
        <GeneralHomeSection
          title="Research & Publications: A Knowledge Hub"
          description="Discover groundbreaking studies, peer-reviewed papers, and technical reports authored by CIROH and NOAA experts. Dive into cutting-edge research on hydrological forecasting, water quality, and the impacts of a changing climate."
          lightImage={PublicationsExampleLight}
          darkImage={PublicationsExampleDark}
          background="secondary"
        />

        {/* Learning Modules Section */}
        <GeneralHomeSection
          title="Enhance Your Expertise with Learning Modules"
          description="Explore open courses and self-paced modules designed to foster deeper understanding of critical hydrological concepts. Created by CIROH in collaboration with NOAA, these resources cater to both novice learners and seasoned professionals."
          lightImage={PortalLearningExampleLight}
          darkImage={PortalLearningExampleDark}
        />
      </main>
    </Layout>
  );
}
