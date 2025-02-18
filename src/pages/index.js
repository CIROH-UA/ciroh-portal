
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
          description={"En­hance fore­cast­ing, ana­lys­is, and wa­ter re­source man­age­ment by mak­ing your web ap­plic­a­tions and tools ac­cess­ible to CIROH and NOAA's hy­dro­lo­gic re­search ini­ti­at­ives."}
        />
      </main>

    </Layout>
  );
}

