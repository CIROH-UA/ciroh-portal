import CreateAppImageLight from '@site/static/img/hs_create_light_apps.png';
import CreateAppImageDark from '@site/static/img/hs_create_dark_apps.png';
import KeywordsAppImageLight from '@site/static/img/hs_keywords_light_apps.png';
import KeywordsAppImageDark from '@site/static/img/hs_keywords_dark_apps.png';
import AppListImageLight from '@site/static/img/hs_list_light_app.png';
import AppListImageDark from '@site/static/img/hs_list_dark_app.png';

export const contributeAppCards = [
  {
    imgSrcLight: CreateAppImageLight,
    imgSrcDark: CreateAppImageDark,
    imgAlt: 'Create an App Connector Resource',
    cardTitle: 'Create an App Connector Resource',
    cardDescription: 'Create a new App Connector Resource to connect your web app to CIROH.',
  },
  {
    imgSrcLight: KeywordsAppImageLight,
    imgSrcDark: KeywordsAppImageDark,
    imgAlt: 'Add Keywords to your App Connector Resource',
    cardTitle: 'Add Keywords to your App Connector Resource',
    cardDescription: 'Add nwm_portal_app keyword to your App Connector Resource to make it discoverable.',
  },
  {
    imgSrcLight: AppListImageLight,
    imgSrcDark: AppListImageDark,
    imgAlt: 'View your App in the App List',
    cardTitle: 'Make your App Public',
    cardDescription: 'Get your app listed in the CIROH App List.',
  }
];