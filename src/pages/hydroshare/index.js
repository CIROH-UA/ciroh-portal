import RedirectHero from '@site/src/components/RedirectHero';
import Layout from '@theme/Layout';

// This page seems to be outdated, and it's outright orphaned on the last production version of Portal.
// That said, the most appropriate target seems to be the documentation page on Hub.

export default function RedirPage() {
  return (
    <Layout title="CIROH Hub Redirect" description="Redirect from CIROH Portal to CIROH Hub.">
      <RedirectHero href="https://hub.ciroh.org/docs/products/data-management/hydroshare/" />
    </Layout>
  );
}