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
    imgAlt: 'Create an App Resource',
    cardTitle: '1. Create an App Resource',
    cardDescription: 'Provide the necessary metadata and URLs to make your app discoverable. Provide an image to make your app visually appealing.',
  },
  {
    imgSrcLight: KeywordsAppImageLight,
    imgSrcDark: KeywordsAppImageDark,
    imgAlt: 'Add Keywords to your Resource',
    cardTitle: '2. Add Keywords',
    cardDescription: 'Add nwm_portal_app keyword to your App Connector Resource to make it discoverable.',
  },
  {
    imgSrcLight: "https://placehold.co/200/transparent/255f9c",
    imgSrcDark: "https://placehold.co/200/transparent/4bc1d3",
    imgAlt: 'Add an App Icon to your Resource',
    cardTitle: '3. Add an App Icon',
    cardDescription: 'Provide a png icon with transparent background with dimentsions 200x200.',
  },
  {
    imgSrcLight: KeywordsAppImageLight,
    imgSrcDark: KeywordsAppImageDark,
    imgAlt: 'Add Source Code to your Resource',
    cardTitle: '4. Link Source Code',
    cardDescription: 'Provide a link to the source code repository for your app.',
  },
  {
    imgSrcLight: AppListImageLight,
    imgSrcDark: AppListImageDark,
    imgAlt: 'View your App in the App List',
    cardTitle: '5. Make your App Public',
    cardDescription: 'Make your App Connector Resource public to share it with the CIROH community.',
  },
];