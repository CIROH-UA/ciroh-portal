import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import CirohLogoImage from '@site/static/img/ciroh_logo.png';
import CirohLogoImageDark from '@site/static/img/ciroh_logo_dark.png';
import Header from './Header';

export default function FrameworkHero() {
  const { colorMode } = useColorMode();
  const Cirohlogo = colorMode === 'dark' ? CirohLogoImageDark : CirohLogoImage;

  return (
      <Header
        title="CIROH Re­search Portal"
        image={Cirohlogo}
        tagline="The CIROH Research Portal, developed in collaboration with NOAA, provides tools aimed at advancing water forecasting, hydrologic modeling, and water quality analysis. "
      />
  );
}