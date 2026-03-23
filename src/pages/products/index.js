import RedirectHero from '@site/src/components/RedirectHero';
import Layout from '@theme/Layout';

// Renamed to 'Apps'.

export default function RedirPage() {
  return (
    <Layout title="CIROH Hub Redirect" description="Redirect from CIROH Portal to CIROH Hub.">
      <RedirectHero href="https://hub.ciroh.org/apps/" />
    </Layout>
  );
}