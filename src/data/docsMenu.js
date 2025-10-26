import productGroups from '../components/ProductGroupsWireframe/groups';
import {
  MdCloudQueue,
  MdStorage,
  MdShare,
} from 'react-icons/md';

const DOCS_SITE = 'https://docs.ciroh.org';
const DOCS_BASE = `${DOCS_SITE}/docs`;

const toHref = path =>
  path.startsWith('/docs/')
    ? `${DOCS_SITE}${path}`
    : `${DOCS_BASE}/${path}`;

const products = productGroups
  .filter(group => group.docsRoute)
  .map(group => ({
    id: group.id,
    title: group.title,
    description: group.blurb,
    icon: group.icon,
    href: `/product-groups?group=${group.id}`,
  }));

const services = [
  {
    id: 'cloudservices',
    title: 'Public Cloud',
    description: 'Managed AWS resources, workflows, and security guidance.',
    slug: 'services/cloudservices',
    icon: MdCloudQueue,
  },
  {
    id: 'on-prem',
    title: 'On-Premises',
    description: 'Guidance for installing CIROH tooling on HPC or data centers.',
    slug: 'services/on-prem',
    icon: MdStorage,
  },
  {
    id: 'external-resources',
    title: 'External Resources',
    description: 'Partner docs, references, and related knowledge bases.',
    slug: 'services/external-resources',
    icon: MdShare,
  },
];

const withLinks = section =>
  section.map(item => ({
    ...item,
    href: item.href ?? toHref(item.slug),
  }));

const docsMenu = {
  products: withLinks(products),
  services: withLinks(services),
};

export default docsMenu;
