import NgiabWhatIs from '@site/src/productDocs/ngiab/intro/what-is.mdx';
import NgiabAtAGlance from '@site/src/productDocs/ngiab/intro/at-a-glance.mdx';
import NgiabInstall from '@site/src/productDocs/ngiab/intro/install.mdx';
import NgiabGlossary from '@site/src/productDocs/ngiab/intro/glossary.mdx';
import NgiabDirectories from '@site/src/productDocs/ngiab/intro/directories.mdx';

import NextGen2i2c from '@site/src/productDocs/ngiab/distributions/nextgen-2i2c.mdx';
import NgiabDockerIndex from '@site/src/productDocs/ngiab/distributions/ngiab-docker/index.mdx';
import NgiabDockerInstall from '@site/src/productDocs/ngiab/distributions/ngiab-docker/install.mdx';
import NgiabDockerGettingStarted from '@site/src/productDocs/ngiab/distributions/ngiab-docker/getting-started.mdx';
import NgiabDockerBuilding from '@site/src/productDocs/ngiab/distributions/ngiab-docker/building.mdx';
import NgiabDockerContribute from '@site/src/productDocs/ngiab/distributions/ngiab-docker/contribute.mdx';
import NgiabDockerContact from '@site/src/productDocs/ngiab/distributions/ngiab-docker/contact.mdx';
import NgiabSingularity from '@site/src/productDocs/ngiab/distributions/ngiab-singularity.mdx';

import NgiabPreprocessor from '@site/src/productDocs/ngiab/components/ngiab-preprocessor.mdx';
import NgiabTeehr from '@site/src/productDocs/ngiab/components/ngiab-teehr.mdx';
import NgiabVisualizer from '@site/src/productDocs/ngiab/components/ngiab-visualizer.mdx';
import NgiabCalibration from '@site/src/productDocs/ngiab/components/ngiab-calibration.mdx';
import CommunityHydrofabric from '@site/src/productDocs/ngiab/components/community-hydrofabric.mdx';

import CommunityReposIndex from '@site/src/productDocs/ngiab/community-nextgen-repos/index.mdx';
import CommunityReposNgen from '@site/src/productDocs/ngiab/community-nextgen-repos/ngen.mdx';
import CommunityReposTRoute from '@site/src/productDocs/ngiab/community-nextgen-repos/t-route.mdx';
import CommunityReposLstm from '@site/src/productDocs/ngiab/community-nextgen-repos/lstm.mdx';

import NgiabDashboard from '@site/src/productDocs/ngiab/dashboard.mdx';
import NgiabOfficeHours from '@site/src/productDocs/ngiab/office-hours.mdx';

const docContentMap = {
  '/docs/products/ngiab/intro/what-is': NgiabWhatIs,
  '/docs/products/ngiab/intro/at-a-glance': NgiabAtAGlance,
  '/docs/products/ngiab/intro/install': NgiabInstall,
  '/docs/products/ngiab/intro/glossary': NgiabGlossary,
  '/docs/products/ngiab/intro/directories': NgiabDirectories,

  '/docs/products/ngiab/distributions/nextgen-2i2c': NextGen2i2c,
  '/docs/products/ngiab/distributions/ngiab-docker': NgiabDockerIndex,
  '/docs/products/ngiab/distributions/ngiab-docker/install': NgiabDockerInstall,
  '/docs/products/ngiab/distributions/ngiab-docker/getting-started': NgiabDockerGettingStarted,
  '/docs/products/ngiab/distributions/ngiab-docker/building': NgiabDockerBuilding,
  '/docs/products/ngiab/distributions/ngiab-docker/contribute': NgiabDockerContribute,
  '/docs/products/ngiab/distributions/ngiab-docker/contact': NgiabDockerContact,
  '/docs/products/ngiab/distributions/ngiab-singularity': NgiabSingularity,

  '/docs/products/ngiab/components/ngiab-preprocessor': NgiabPreprocessor,
  '/docs/products/ngiab/components/ngiab-teehr': NgiabTeehr,
  '/docs/products/ngiab/components/ngiab-visualizer': NgiabVisualizer,
  '/docs/products/ngiab/components/ngiab-calibration': NgiabCalibration,
  '/docs/products/ngiab/components/community-hydrofabric': CommunityHydrofabric,

  '/docs/products/ngiab/community-nextgen-repos': CommunityReposIndex,
  '/docs/products/ngiab/community-nextgen-repos/ngen': CommunityReposNgen,
  '/docs/products/ngiab/community-nextgen-repos/t-route': CommunityReposTRoute,
  '/docs/products/ngiab/community-nextgen-repos/lstm': CommunityReposLstm,

  '/docs/products/ngiab/dashboard': NgiabDashboard,
  '/docs/products/ngiab/office-hours': NgiabOfficeHours,
};

export default docContentMap;
