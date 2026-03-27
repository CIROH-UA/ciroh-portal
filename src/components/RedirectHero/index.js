import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import CirohLogoImage from '@site/static/img/ciroh_logo.png';
import CirohLogoImageDark from '@site/static/img/ciroh_logo_dark.png';
import Header from './Header';
import RedirectHandler from './RedirectHandler';

export default function RedirectHero({ href }) {
  const { colorMode } = useColorMode();
  const Cirohlogo = colorMode === 'dark' ? CirohLogoImageDark : CirohLogoImage;
  const delayTime = 10; // In seconds

  return (
      <>
        <Header
          title="Redirecting to CIROH Hub..."
          image={Cirohlogo}
          tagline="CIROH Portal and DocuHub have been merged into CIROH Hub, an all-in-one resource for CIROH research and documentation. You will be redirected to your destination in a few moments. Alternatively, click the button below to be redirected immediately."
          buttons={[{href: href, label: "To CIROH Hub"}]}
        />
        <RedirectHandler href={href} delayTime={delayTime} />
      </>
  );
}