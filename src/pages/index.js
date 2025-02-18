
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import FrameworkHero from '@site/src/components/FrameworkHero';



export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <FrameworkHero />
      <main>
        {/* <HomepageFeatures /> */}
      </main>

    </Layout>
  );
}

