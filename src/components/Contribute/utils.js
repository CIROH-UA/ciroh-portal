import CreateAppImageLight from '@site/static/img/hs_create_light_apps.png';
import CreateAppImageDark from '@site/static/img/hs_create_dark_apps.png';
import KeywordsAppImageLight from '@site/static/img/hs_keywords_light_apps.png';
import KeywordsAppImageDark from '@site/static/img/hs_keywords_dark_apps.png';
import AppListImageLight from '@site/static/img/hs_list_light_app.png';
import AppListImageDark from '@site/static/img/hs_list_dark_app.png';

import CodeImageLight from '@site/static/img/hs_app_icon_web_light.png';
import CodeImageDark from '@site/static/img/hs_app_icon_web_dark.png';

import WebAppImageLight from '@site/static/img/hs_app_urls_light.png';
import WebAppImageDark from '@site/static/img/hs_app_urls_dark.png';

import ZoteroAPILogo from '@site/static/img/zotero-app-icon-512.png';
import ZoteroLoginDark from '@site/static/img/zotero_login_dark.png';
import ZoteroLoginLight from '@site/static/img/zotero_login_light.png';

import ZoteroSyncDark from '@site/static/img/zotero_sync_dark.png';
import ZoteroSyncLight from '@site/static/img/zotero_sync_light.png';

import ZoteroAddDark from '@site/static/img/zotero_add_dark.png';
import ZoteroAddLight from '@site/static/img/zotero_add_light.png';

import ZoteroJoinGroupDark from '@site/static/img/zotero_join_dark.png';
import ZoteroJoinGroupLight from '@site/static/img/zotero_join_light.png';

import DocsLogo from '@site/static/img/docuhub_logo.png';

import DocsEditDark from '@site/static/img/docs_edit_dark.png';
import DocsEditLight from '@site/static/img/docs_edit_light.png';

import DocsPRDark from '@site/static/img/docuhub_pr_dark.png';
import DocsPRLight from '@site/static/img/docuhub_pr_light.png';

import DocsForkDark from '@site/static/img/docuhub_fork_dark.png';
import DocsForkLight from '@site/static/img/docuhub_fork_light.png';

import DocsMDDark from '@site/static/img/docuhub_md_dark3.png';
import DocsMDLight from '@site/static/img/docuhub_md_light3.png';

import Hydrolearn101Dark from '@site/static/img/hydrolearn_101_dark.png';
import Hydrolearn101Light from '@site/static/img/hydrolearn_101_light.png';

import JoinCommunityDark from '@site/static/img/join_community_dark.png';
import JoinCommunityLight from '@site/static/img/join_community_light.png';

import JoinGroupDark from '@site/static/img/join_group_dark.png';
import JoinGroupLight from '@site/static/img/join_group_light.png';

import DatasetsDark from '@site/static/img/datasets_dark.png';
import DatasetsLight from '@site/static/img/datasets_light.png';

export const contributeAppCards = [
  // {
  //   imgSrcLight: CreateAppImageLight,
  //   imgSrcDark: CreateAppImageDark,
  //   imgAlt: 'Create an App Resource',
  //   cardTitle: '1. Create an App Resource',
  //   cardDescription: 'Provide the necessary metadata and URLs to make your app public on HydroShare. Provide an image to make your app visually appealing.',
  // },
  // {
  //   imgSrcLight: KeywordsAppImageLight,
  //   imgSrcDark: KeywordsAppImageDark,
  //   imgAlt: 'Add Keywords to your Resource',
  //   cardTitle: '2. Add Keywords',
  //   cardDescription: 'Add nwm_portal_app keyword to your App Connector Resource to make it discoverable.',
  // },
  {
    imgSrcLight: CodeImageLight,
    imgSrcDark: CodeImageDark,
    imgAlt: 'Add an App Icon to your Resource',
    cardTitle: '1. Add an App Icon',
    cardDescription: 'Provide a png icon with transparent background with dimentsions 200x200.',
  },
  {
    imgSrcLight: WebAppImageLight,
    imgSrcDark: WebAppImageDark,
    imgAlt: 'Add Source Code to your Resource',
    cardTitle: '2. Link Source Code',
    cardDescription: 'Provide a link to the source code repository for your app.',
  },
  {
    imgSrcLight: AppListImageLight,
    imgSrcDark: AppListImageDark,
    imgAlt: 'View your App on the App List',
    cardTitle: '3. Make your App Public',
    cardDescription: 'Make your App Connector Resource public to share it with the CIROH community.',
  },
];

export const contributeDatasetsCards = [

  {
    imgSrcLight: JoinCommunityLight,
    imgSrcDark: JoinCommunityDark,
    imgAlt: 'Join the CIROH Community',
    cardTitle: '1. Join the CIROH Community',
    cardDescription: 'Join the CIROH Community on HydroShare to share your datasets.',
  },
  {
    imgSrcLight: JoinGroupLight,
    imgSrcDark: JoinGroupDark,
    imgAlt: 'Join any Community Group',
    cardTitle: '2. Join any CIROH Group',
    cardDescription: 'Join any of the different Group on the CIROH HydroShare Community.',
  },
  // {
  //   imgSrcLight: CreateAppImageLight,
  //   imgSrcDark: CreateAppImageDark,
  //   imgAlt: 'Create a Resource',
  //   cardTitle: '3. Create a Resource',
  //   cardDescription: 'Provide the necessary metadata to make your resource public on HydroShare.',
  // },
  {
    imgSrcLight: DatasetsLight,
    imgSrcDark: DatasetsDark,
    imgAlt: 'Share your dataset with the CIROH Community',
    cardTitle: '3. Share your Dataset ',
    cardDescription: 'Share your dataset with the CIROH Community',
  },
]

export const contributePublicationsCards = [
  {
    imgSrcLight: ZoteroAPILogo,
    imgSrcDark: ZoteroAPILogo,
    imgAlt: 'Install Zotero',
    cardTitle: '1. Install Zotero',
    cardDescription: 'Install Zotero and its web connector plugin or access it through its web ui to manage your publications',
  },
  {
    imgSrcLight: ZoteroLoginLight,
    imgSrcDark: ZoteroLoginDark,
    imgAlt: 'Register with Zotero',
    cardTitle: '2. Register with Zotero',
    cardDescription: 'Create an account with Zotero to manage your publications',
  },
  {
    imgSrcLight: ZoteroJoinGroupLight,
    imgSrcDark: ZoteroJoinGroupDark,
    imgAlt: 'Request Permission to the Library Group',
    cardTitle: '3. Request Permission to the Library Group',
    cardDescription: 'Request Permission to the Zotero CIROH Library Group',
  },
  {
    imgSrcLight: ZoteroSyncLight,
    imgSrcDark: ZoteroSyncDark,
    imgAlt: 'Sync your Zotero account to see your group folder',
    cardTitle: '4. Sync your Zotero account to see your group folder',
    cardDescription: 'If using the Zotero desktop app, sync your account to see the CIROH Library Group',
  },
  // {
  //   imgSrcLight: ZoteroAddLight,
  //   imgSrcDark: ZoteroAddDark,
  //   imgAlt: 'Add your Publications',
  //   cardTitle: '5. Add your Publications',
  //   cardDescription: 'Add new citations using the Zotero icon in the URL bar or drag and drop items from other folders into your group folders',
  // },
];

export const contributeSimpleDocsCards = [
  {
    imgSrcLight: DocsLogo,
    imgSrcDark: DocsLogo,
    imgAlt: 'Visit the Documentation',
    cardTitle: '1. Visit the Documentation',
    cardDescription: 'Visit docs.ciroh.org and navigate to the page you wish to modify.',
  },
  {
    imgSrcLight:DocsEditLight ,
    imgSrcDark: DocsEditDark,
    imgAlt: 'Edit page',
    cardTitle: '2. Edit page',
    cardDescription: 'Click on "Edit page" at the bottom of the page to make any necessary changes.',
  },
  {
    imgSrcLight: DocsPRLight,
    imgSrcDark: DocsPRDark,
    imgAlt: 'Submit a Pull Request',
    cardTitle: '3. Submit a Pull Request',
    cardDescription: 'Submit a pull request with your changes to the repository.',
  }
];

export const contributeBlogsDocsCards = [
  {
    imgSrcLight: DocsForkLight,
    imgSrcDark: DocsForkDark,
    imgAlt: 'Visit the Documentation',
    cardTitle: '1. Create a Fork',
    cardDescription: 'Fork the repository ciroh-ua_website to your GitHub account.',
  },
  {
    imgSrcLight:DocsMDLight ,
    imgSrcDark: DocsMDDark,
    imgAlt: 'Create a Blog page',
    cardTitle: '2. Create a Blog page',
    cardDescription: 'Create a new markdown file (YYYY-MM-DD-my-blog-post-title.md or YYYY/MM/DD/my-blog-post-title.md) in the blog folder with the necessary metadata.',
  },
  {
    imgSrcLight: DocsPRLight,
    imgSrcDark: DocsPRDark,
    imgAlt: 'Submit a Pull Request',
    cardTitle: '3. Submit a Pull Request',
    cardDescription: 'Submit a pull request with your changes to the repository.',
  }
];


export const contributeLearningModulesCards = [
  {
    imgSrcLight: Hydrolearn101Light,
    imgSrcDark: Hydrolearn101Dark,
    imgAlt: 'Complete HydroLearn 101',
    cardTitle: '1. Complete HydroLearn 101',
    cardDescription: 'Complete the HydroLearn 101 course to learn how to create a learning module.',
  },

  {
    imgSrcLight: CreateAppImageLight,
    imgSrcDark: CreateAppImageDark,
    imgAlt: 'Create a Resource',
    cardTitle: '1. Create a Resource',
    cardDescription: 'Provide the necessary metadata to make your resource public on HydroShare.',
  },
  {
    imgSrcLight: KeywordsAppImageLight,
    imgSrcDark: KeywordsAppImageDark,
    imgAlt: 'Add Keywords to your Resource',
    cardTitle: '2. Add Keywords',
    cardDescription: 'Add nwm_portal_module keyword to your Resource to make it discoverable.',
  },
  {
    imgSrcLight: AppListImageLight,
    imgSrcDark: AppListImageDark,
    imgAlt: 'View your Dataset on the Resource List',
    cardTitle: '3. Make your Dataset Public',
    cardDescription: 'Make your Resource public to share it with the CIROH community.',
  },
]
