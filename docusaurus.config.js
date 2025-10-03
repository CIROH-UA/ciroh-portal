// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';
import path from 'path';
import 'dotenv/config';
// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)
const baseUrl = "/";
/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'CIROH Re­search Portal',
  tagline: 'CIROH en­hances U.S. hy­dro­lo­gic­al fore­cast­ing in col­lab­or­a­tion with NOAA, fo­cus­ing on wa­ter events and qual­ity through a con­sor­ti­um of di­verse in­sti­tu­tions. Ex­plore this portal for re­search pub­lic­a­tions, ap­plic­a­tions, and data­sets from the NOAA and CIROH com­munity of sci­ent­ists.',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  // url: 'https://portal.ciroh.org',
  url: 'http://portal.ciroh.org',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',
  customFields:{ // Default "dummy" values improve stability when environment variables are missing
    zotero_api_key: process.env.ZOTERO_API_KEY || "dummy",
    zotero_group_id: process.env.ZOTERO_CIROH_GROUP_ID,
    captcha_key: process.env.CAPTCHA_KEY || "dummy",
    s3_bucket: process.env.S3_BUCKET_NAME,
    s3_access_key: process.env.S3_ACCESS_KEY,
    s3_secret_key: process.env.S3_SECRET_KEY,
    s3_region: process.env.S3_REGION,
    hs_client_id: process.env.HS_CLIENT_ID || "dummy",
    hs_scopes: ['read', 'write'],
    hs_authorize_url: "https://www.hydroshare.org/o/authorize/",
    hs_token_url: "https://www.hydroshare.org/o/token/",
    hs_redirect_uri: "https://portal.ciroh.org/contribute"
  },
  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "CIROH-UA", // Usually your GitHub org/user name.
  projectName: "ciroh-portal", // Usually your repo name.
  trailingSlash: false,
  deploymentBranch: 'gh-pages',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // Future flags. (In preparation for DocuHub v4.)
  future: {
    v4: true,
    experimental_faster: true,
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        gtag: {
          trackingID: 'G-YNKKHRZP29',
          anonymizeIP: true,
        },
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/ciroh_small.png',
      navbar: {
        title: 'CIROH',
        logo: {
          alt: 'CIROH Portal',
          src: 'img/ciroh_small.png',
          srcDark: 'img/ciroh_small_dark.png',  // Dark mode logo
        },
        items: [          
          {to: '/apps', label: 'Apps', position: 'left'},
          {to: '/datasets', label: 'Datasets', position: 'left'},
          {to: '/publications', label: 'Publications', position: 'left'},
          {to: '/presentations', label: 'Presentations', position: 'left'},
          {to: '/courses', label: 'Courses', position: 'left'},
          {to: '/contribute', label: 'Contribute', position: 'right'},
          
          {to: '/develop', label: 'Develop', position: 'right'},
          // {to: '/hydroshare', label: 'HydroShare', position: 'right'},
          {
            href: "https://docs.ciroh.org/",
            label: "Docs",
            position: "left",
          },
          {
            type: 'dropdown',
            position: 'right',
            className: "header-github-link",
            "aria-label": "GitHub repositories",
            items: [
              {
                label: 'ciroh-portal',
                href: 'https://github.com/CIROH-UA/ciroh-portal',
              },
              {
                label: 'tethysportal-ciroh',
                href: 'https://github.com/CIROH-UA/tethysportal-ciroh',
              },
            ]
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Quick Links',
            items: [
              {
                label: 'Applications',
                href: '/apps'
              },
              {
                label: 'Datasets',
                href: '/datasets'
              },
              {
                label: 'Publications',
                href: '/publications'
              },
              {
                label: 'Courses',
                href: '/courses'
              },
              {
                label: 'Contribute',
                href: '/contribute'
              },
              {
                label: 'Develop',
                href: '/develop'
              },
              {
                label: 'DocuHub',
                href: 'http://docs.ciroh.org'
              },
            ]
          },
          {
            title: 'About CIROH',
            items: [
              {
                label: 'About Us',
                href: 'https://ciroh.ua.edu/about/'
              },
              {
                label: 'Members & Partners',
                href: 'https://ciroh.ua.edu/about/ciroh-partners/'
              },
              {
                label: 'Contact CIROH',
                href: 'https://ciroh.ua.edu/contact-us/'
              },
              {
                label: 'Portal Repository',
                href: 'https://github.com/CIROH-UA/ciroh-portal'
              }
            ]
          },
          {
            title: "Follow us on",
            items: [
              {
                html: `
                  <div class="footer-social-links">
                    <a href="https://github.com/CIROH-UA" target="_blank" rel="noreferrer noopener" aria-label="Visit CIROH">
                      <img src="${baseUrl}img/socials/github_light.svg" alt="CIROH on GitHub" width="40" height="40" />
                    </a>
                    <a href="https://www.linkedin.com/company/uaciroh/" target="_blank" rel="noreferrer noopener" aria-label="CIROH on LinkedIn">
                      <img src="${baseUrl}img/socials/linkedin_light.svg" alt="CIROH on LinkedIn" width="40" height="40" />
                    </a>
                    <a href="https://www.youtube.com/@UA_CIROH" target="_blank" rel="noreferrer noopener" aria-label="CIROH on YouTube">
                      <img src="${baseUrl}img/socials/youtube_light.svg" alt="CIROH on YouTube" width="40" height="40" />
                    </a>
                  </div>
                `,
              },
              {
                html: `
                <div class="footer-social-links"> 
                  <a href="https://www.instagram.com/ua_ciroh/" target="_blank" rel="noreferrer noopener" aria-label="CIROH on Instagram">
                    <img src="${baseUrl}img/socials/instagram_light.svg" alt="CIROH on Instagram" width="40" height="40" />
                  </a>       
                  <a href="https://www.facebook.com/UACIROH/" target="_blank" rel="noreferrer noopener" aria-label="CIROH on Facebook">
                    <img src="${baseUrl}img/socials/facebook_light.svg" alt="CIROH on Facebook" width="40" height="40" />
                  </a>              
                  <a href="https://twitter.com/UA_CIROH" target="_blank" rel="noreferrer noopener" aria-label="CIROH on X (Twitter)">
                    <img src="${baseUrl}img/socials/x_light.svg" alt="CIROH on X (Twitter)" width="40" height="40" />
                  </a>
                </div>
                `,
              }
            ],
          },
        ],
        copyright: `
          <div class="footer__attrib">
            Developed with ❤️ by the Portal Team at CIROH
          </div>
          <div class="footer__funding">
            This research was supported by the Cooperative Institute for Research to Operations in Hydrology
            (CIROH) with funding under award NA22NWS4320003 from the NOAA Cooperative Institute Program.
            The statements, findings, conclusions, and recommendations are those of the author(s) and do not
            necessarily reflect the opinions of NOAA.
          </div>
          <div class="footer__bottom">
            Copyright © ${new Date().getFullYear()} CIROH - Aquaveo - Brigham Young University
          </div>
          `,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
