
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import FrameworkHero from '@site/src/components/FrameworkHero';
import PortalSection from '@site/src/components/PortalSection';


export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <FrameworkHero />
      <main>
        <PortalSection
          title={"Bringing the Whole Community Together"}
          description={"Improve forecasting, analysis, and water resource management by ensuring your web applications and tools are accessible to CIROH and NOAA's hydrologic research initiatives."}
        />
      </main>

    </Layout>
  );
}

