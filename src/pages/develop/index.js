import RedirectHero from '@site/src/components/RedirectHero';
import Layout from '@theme/Layout';

// 03/23/2026: As of today, this page doesn't have an equivalent on the production version of Hub.
// I've submitted a PR to address this: https://github.com/CIROH-UA/ciroh_hub/pull/80
// As such, the link this redirects to is currently dead, but it'll be live and working by the time these redirects are published.

export default function RedirPage() {
  return (
    <Layout title="CIROH Hub Redirect" description="Redirect from CIROH Portal to CIROH Hub.">
      <RedirectHero href="https://hub.ciroh.org/contribute/develop/" />
    </Layout>
  );
}