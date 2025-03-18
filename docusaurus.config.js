// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';
import path from 'path';
import 'dotenv/config';
// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'CIROH Re­search Portal',
  tagline: 'CIROH en­hances U.S. hy­dro­lo­gic­al fore­cast­ing in col­lab­or­a­tion with NOAA, fo­cus­ing on wa­ter events and qual­ity through a con­sor­ti­um of di­verse in­sti­tu­tions. Ex­plore this portal for re­search pub­lic­a­tions, ap­plic­a­tions, and data­sets from the NOAA and CIROH com­munity of sci­ent­ists.',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  // url: 'https://portal.ciroh.org',
  // url: 'https://romer8.github.io/docusaurus-ciroh',
  url: 'https://aquaveo.github.io/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/docusaurus-ciroh/',
  customFields:{
    zotero_api_key: process.env.ZOTERO_API_KEY,
    zotero_group_id: process.env.ZOTERO_CIROH_GROUP_ID,
  },
  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'aquaveo', // Usually your GitHub org/user name.
  projectName: 'aquaveo.github.io/docusaurus-ciroh', // Usually your repo name.
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

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
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
  plugins: [
    [
      // Our local plugin path
      path.resolve(__dirname, 'plugins/docusaurus-plugin-hydroshare'),
      {
        pathToJson: 'hydroshare_resources.json',
      },
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
          {to: '/learning_modules', label: 'Modules', position: 'left'},
          {to: '/contribute', label: 'Contribute', position: 'right'},
          
          {to: '/develop', label: 'Develop', position: 'right'},
          {to: '/hydroshare', label: 'HydroShare', position: 'right'},
          {
            href: "https://docs.ciroh.org/",
            label: "Docs",
            position: "left",
          },
          {
            href: 'https://github.com/CIROH-UA/tethysportal-ciroh',
            position: 'right',
            className: "header-github-link",
            "aria-label": "GitHub repository",
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
                href: '/applications'
              },
              {
                label: 'Datasets',
                href: '/datasets'
              },
              {
                label: 'Publications',
                href: '/'
              },
              {
                label: 'Learning Modules',
                href: '/'
              },
              {
                label: 'Contribute',
                href: '/contribute'
              },
              {
                label: 'Develop',
                href: '/develop'
              }
            ]
          },
          {
            title: 'External Links',
            items: [
              {
                label: 'DocuHub',
                href: 'http://docs.ciroh.org'
              },
              {
                label: 'CIROH Portal',
                href: 'http://portal.ciroh.org/t'
              }
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
                label: 'DocuHub Repository',
                href: 'https://github.com/CIROH-UA/ciroh-ua_website'
              }
            ]
          },
          {
            title: "Follow us on",
            items: [
              {
                html: `
                <div class="footer-social-links">
                <a href="https://www.youtube.com/@UA_CIROH" target="_blank" rel="noreferrer noopener" aria-label="Visit CIROH" style="margin-left:-15px">
                <img src="https://static.vecteezy.com/system/resources/previews/018/930/572/non_2x/youtube-logo-youtube-icon-transparent-free-png.png" alt="CIROH on YouTube" width="70" height="60" />
              </a>
              <a href="https://www.linkedin.com/company/uaciroh/" target="_blank" rel="noreferrer noopener" aria-label="Visit CIROH"  style="margin-left:-15px">
                <img src="https://static.vecteezy.com/system/resources/previews/018/930/587/non_2x/linkedin-logo-linkedin-icon-transparent-free-png.png" alt="CIROH on LinkedIn" width="70" height="60" />
              </a>
              <a href="https://www.facebook.com/UACIROH/" target="_blank" rel="noreferrer noopener" aria-label="Visit CIROH"  style="margin-left:-25px">
                <img src="https://static.vecteezy.com/system/resources/previews/018/930/702/original/facebook-logo-facebook-icon-transparent-free-png.png" alt="CIROH on Facebook" width="70" height="60" />
              </a> 
              </div>
                `,
              },
              {
                html: `               
              <a href="https://twitter.com/UA_CIROH" target="_blank" rel="noreferrer noopener" aria-label="Visit CIROH"  style="margin-left:5px;">
                <img src="https://seeklogo.com/images/T/twitter-x-logo-0339F999CF-seeklogo.com.png?v=638264860180000000" alt="CIROH on X" width="40" height="40" />
              </a>
              <a href="https://github.com/CIROH-UA" target="_blank" rel="noreferrer noopener" aria-label="Visit CIROH"  style="margin-left:5px;">
                <img src="https://cdn4.iconfinder.com/data/icons/iconsimple-logotypes/512/github-512.png" alt="CIROH on GitHUb" width="40" height="40" />
              </a>
                
                `,
              },
            ],
          },
        ],
        copyright: `<div class="footer__funding">
        This project received funding under award NA22NWS4320003 from NOAA Cooperative Institute Program. 
        The statements, findings, conclusions, and recommendations are those of the author(s) and do not 
        necessarily reflect the views of NOAA.
        </div>
        <div class="footer__bottom">
          Copyright © ${new Date().getFullYear()} CIROH - Brigham Young University
        </div>`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
