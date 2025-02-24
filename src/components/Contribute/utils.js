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

export const contributeAppCards = [
  {
    imgSrcLight: CreateAppImageLight,
    imgSrcDark: CreateAppImageDark,
    imgAlt: 'Create an App Resource',
    cardTitle: '1. Create an App Resource',
    cardDescription: 'Provide the necessary metadata and URLs to make your app public on HydroShare. Provide an image to make your app visually appealing.',
  },
  {
    imgSrcLight: KeywordsAppImageLight,
    imgSrcDark: KeywordsAppImageDark,
    imgAlt: 'Add Keywords to your Resource',
    cardTitle: '2. Add Keywords',
    cardDescription: 'Add nwm_portal_app keyword to your App Connector Resource to make it discoverable.',
  },
  {
    imgSrcLight: CodeImageLight,
    imgSrcDark: CodeImageDark,
    imgAlt: 'Add an App Icon to your Resource',
    cardTitle: '3. Add an App Icon',
    cardDescription: 'Provide a png icon with transparent background with dimentsions 200x200.',
  },
  {
    imgSrcLight: WebAppImageLight,
    imgSrcDark: WebAppImageDark,
    imgAlt: 'Add Source Code to your Resource',
    cardTitle: '4. Link Source Code',
    cardDescription: 'Provide a link to the source code repository for your app.',
  },
  {
    imgSrcLight: AppListImageLight,
    imgSrcDark: AppListImageDark,
    imgAlt: 'View your App on the App List',
    cardTitle: '5. Make your App Public',
    cardDescription: 'Make your App Connector Resource public to share it with the CIROH community.',
  },
];


export const contributeDatasetsCards = [
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
    cardDescription: 'Add ciroh_portal_data keyword to your Resource to make it discoverable.',
  },
  {
    imgSrcLight: AppListImageLight,
    imgSrcDark: AppListImageDark,
    imgAlt: 'View your Dataset on the Resource List',
    cardTitle: '3. Make your Dataset Public',
    cardDescription: 'Make your Dataset Resource public to share it with the CIROH community.',
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
    imgSrcLight: CodeImageLight,
    imgSrcDark: CodeImageDark,
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
  {
    imgSrcLight: ZoteroAddLight,
    imgSrcDark: ZoteroAddDark,
    imgAlt: 'Add your Publications',
    cardTitle: '5. Add your Publications',
    cardDescription: 'Add new citations using the Zotero icon in the URL bar or drag and drop items from other folders into your group folders',
  },
];