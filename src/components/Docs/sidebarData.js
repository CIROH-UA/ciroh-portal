const sidebarData = {
  ngiab: [
    {
      type: 'category',
      label: 'NextGen In A Box',
      items: [
        {
          type: 'category',
          label: 'Intro to NGIAB',
          items: [
            {
              type: 'link',
              label: 'NWM, NextGen, and NGIAB',
              to: '/docs/products/ngiab/intro/what-is',
            },
            {
              type: 'link',
              label: 'NGIAB at a Glance',
              to: '/docs/products/ngiab/intro/at-a-glance',
            },
            {
              type: 'link',
              label: 'Installing NGIAB Locally',
              to: '/docs/products/ngiab/intro/install',
            },
            {
              type: 'link',
              label: 'Glossary',
              to: '/docs/products/ngiab/intro/glossary',
            },
            {
              type: 'link',
              label: 'Run Configuration Directory Structure',
              to: '/docs/products/ngiab/intro/directories',
            },
          ],
        },
        {
          type: 'category',
          label: 'Distributions',
          items: [
            {
              type: 'link',
              label: 'NextGen on 2i2c',
              to: '/docs/products/ngiab/distributions/nextgen-2i2c',
            },
            {
              type: 'category',
              label: 'NGIAB Docker',
              items: [
                {
                  type: 'link',
                  label: 'Overview',
                  to: '/docs/products/ngiab/distributions/ngiab-docker',
                },
                {
                  type: 'link',
                  label: 'Install',
                  to: '/docs/products/ngiab/distributions/ngiab-docker/install',
                },
                {
                  type: 'link',
                  label: 'Getting Started',
                  to: '/docs/products/ngiab/distributions/ngiab-docker/getting-started',
                },
                {
                  type: 'link',
                  label: 'Building',
                  to: '/docs/products/ngiab/distributions/ngiab-docker/building',
                },
                {
                  type: 'link',
                  label: 'Contribute',
                  to: '/docs/products/ngiab/distributions/ngiab-docker/contribute',
                },
                {
                  type: 'link',
                  label: 'Contact',
                  to: '/docs/products/ngiab/distributions/ngiab-docker/contact',
                },
              ],
            },
            {
              type: 'link',
              label: 'NGIAB Singularity',
              to: '/docs/products/ngiab/distributions/ngiab-singularity',
            },
          ],
        },
        {
          type: 'category',
          label: 'Components',
          items: [
            {
              type: 'link',
              label: 'NGIAB Data Preprocess',
              to: '/docs/products/ngiab/components/ngiab-preprocessor',
            },
            {
              type: 'link',
              label: 'NGIAB TEEHR Integration',
              to: '/docs/products/ngiab/components/ngiab-teehr',
            },
            {
              type: 'link',
              label: 'NGIAB Tethys Visualization Integration',
              to: '/docs/products/ngiab/components/ngiab-visualizer',
            },
            {
              type: 'link',
              label: 'NGIAB Calibration',
              to: '/docs/products/ngiab/components/ngiab-calibration',
            },
            {
              type: 'link',
              label: 'Community Hydrofabric Patcher',
              to: '/docs/products/ngiab/components/community-hydrofabric',
            },
          ],
        },
        {
          type: 'category',
          label: 'Community NextGen Repos',
          items: [
            {
              type: 'link',
              label: 'NGen',
              to: '/docs/products/ngiab/community-nextgen-repos/ngen',
            },
            {
              type: 'link',
              label: 't-route',
              to: '/docs/products/ngiab/community-nextgen-repos/t-route',
            },
            {
              type: 'link',
              label: 'LSTM',
              to: '/docs/products/ngiab/community-nextgen-repos/lstm',
            },
          ],
        },
        {
          type: 'link',
          label: 'GitHub Repository Dashboard',
          to: '/docs/products/ngiab/dashboard',
        },
        {
          type: 'link',
          label: 'Community & Office Hours',
          to: '/docs/products/ngiab/office-hours',
        },
      ],
    },
  ],
  hydrofabric: [
    {
      type: 'category',
      label: 'Community Hydrofabric',
      items: [
        {
          type: 'link',
          label: 'Overview',
          to: '/docs/products/Hydrofabric',
        },
        {
          type: 'link',
          label: 'Hydrofabric Patcher',
          to: '/docs/products/ngiab/components/community-hydrofabric',
        },
        {
          type: 'link',
          label: 'Repository Dashboard',
          to: '/docs/products/ngiab/dashboard',
        },
      ],
    },
  ],
  'community-fim': [
    {
      type: 'category',
      label: 'Community FIM',
      items: [
        {
          type: 'link',
          label: 'Overview',
          to: '/docs/products/community-fim',
        },
        {
          type: 'link',
          label: 'FIM as a Service (FIMSERV)',
          to: '/docs/products/community-fim/fimserv',
        },
        {
          type: 'link',
          label: 'FIM Evaluation Framework',
          to: '/docs/products/community-fim/fimeval',
        },
        {
          type: 'link',
          label: 'FIM Database',
          to: '/docs/products/community-fim/fim-database',
        },
      ],
    },
  ],
  'research-datastream': [
    {
      type: 'category',
      label: 'Research Datastream',
      items: [
        {
          type: 'link',
          label: 'Overview',
          to: '/docs/products/research-datastream',
        },
        {
          type: 'category',
          label: 'CLI',
          items: [
            {
              type: 'link',
              label: 'Install',
              to: '/docs/products/research-datastream/cli/install',
            },
            {
              type: 'link',
              label: 'Usage',
              to: '/docs/products/research-datastream/cli/usage',
            },
            {
              type: 'link',
              label: 'Options',
              to: '/docs/products/research-datastream/cli/options',
            },
            {
              type: 'link',
              label: 'Models',
              to: '/docs/products/research-datastream/cli/models',
            },
            {
              type: 'link',
              label: 'Directories',
              to: '/docs/products/research-datastream/cli/directories',
            },
            {
              type: 'link',
              label: 'Breakdown',
              to: '/docs/products/research-datastream/cli/breakdown',
            },
          ],
        },
        {
          type: 'link',
          label: 'Components',
          to: '/docs/products/research-datastream/components',
        },
        {
          type: 'link',
          label: 'Status',
          to: '/docs/products/research-datastream/status',
        },
      ],
    },
  ],
  'snow-tools': [
    {
      type: 'category',
      label: 'Snow Tools',
      items: [
        {
          type: 'link',
          label: 'Overview',
          to: '/docs/products/snow-tools',
        },
        {
          type: 'link',
          label: 'Intro to Snow Observations',
          to: '/docs/products/snow-tools/snow-intro',
        },
        {
          type: 'link',
          label: 'Snow Sensing',
          to: '/docs/products/snow-tools/snow-sensing',
        },
        {
          type: 'link',
          label: 'Optimize Sensors',
          to: '/docs/products/snow-tools/optimize-sensors',
        },
        {
          type: 'link',
          label: 'SWEML v2.0',
          to: '/docs/products/snow-tools/sweml-v2-0',
        },
      ],
    },
  ],
};

export default sidebarData;
