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

