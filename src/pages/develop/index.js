import RedirectHero from '@site/src/components/RedirectHero';
import Layout from '@theme/Layout';

// !!! THIS PAGE NEEDS AN EQUIVALENT ON HUB !!!
// For now, the apps page is the closest target, but it's not an appropriate one.

export default function RedirPage() {
  return (
    <Layout title="CIROH Hub Redirect" description="Redirect from CIROH Portal to CIROH Hub.">
      <RedirectHero href="https://hub.ciroh.org/apps/" />
    </Layout>
  );
}