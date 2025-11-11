// import productGroups from '../../components/ProductGroups/groups';
import {
  MdStorage,
  MdSpeakerNotes,
  MdNotificationsActive,
  MdShield
} from 'react-icons/md';

const DOCS_SITE = 'https://docs.ciroh.org';
const DOCS_BASE = `${DOCS_SITE}/docs`;

const toHref = path => {
  if (!path) {
    return DOCS_SITE;
  }

  if (path.startsWith('http')) {
    return path;
  }

  if (path.startsWith('/')) {
    return `${DOCS_SITE}${path}`;
  }

  return `${DOCS_BASE}/${path}`;
};

const docuhub =[
  {
    id: 'docuhub-policies',
    title: 'Policies',
    description: 'Data, Code Sharing and Infrastructure Policies',
    slug: 'policies/intro',
    icon: MdShield,
  },
  {
    id: 'docuhub-services',
    title: 'IT Resources',
    description: 'CIROH CyberInfrastructure: Unleashing Potential in Hydrological Research',
    slug: 'services/intro',
    icon: MdStorage,
  },
  {
    id: 'docuhub-news',
    title: 'News',
    description: 'Stay connected with the latest developments in NextGen water modeling',
    slug: '/news',
    icon: MdSpeakerNotes ,
  },
  {
    id: 'docuhub-blog',
    title: 'Blog',
    description: 'Comunity Blog',
    slug: '/blog',
    icon: MdNotificationsActive ,
  },
]


const withLinks = section =>
  section.map(item => ({
    ...item,
    href: item.href ?? toHref(item.slug),
  }));

const docsMenu = {
  docs: withLinks(docuhub),

};

export default docsMenu;
// const products = productGroups
//   .filter(group => group.title)
//   .map(group => ({
//     id: group.id,
//     title: group.title,
//     description: group.blurb,
//     icon: group.icon,
//     slug: `${group.docsRoute}`,
//   }));

// const services = [
//   {
//     id: 'cloudservices',
//     title: 'Public Cloud',
//     description: 'Managed AWS resources, workflows, and security guidance.',
//     slug: 'services/cloudservices',
//     icon: MdCloudQueue,
//   },
//   {
//     id: 'on-prem',
//     title: 'On-Premises',
//     description: 'Guidance for installing CIROH tooling on HPC or data centers.',
//     slug: 'services/on-prem',
//     icon: MdStorage,
//   },
//   {
//     id: 'external-resources',
//     title: 'External Resources',
//     description: 'Partner docs, references, and related knowledge bases.',
//     slug: 'services/external-resources',
//     icon: MdShare,
//   },
// ];
