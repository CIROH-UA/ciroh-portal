import React, { useEffect, useRef } from 'react';
import Layout from '@theme/Layout';
import { useLocation } from '@docusaurus/router';
import Link from '@docusaurus/Link';
import groups from '@site/src/components/ProductGroups/groups';
import {
  MdCloudQueue,
  MdStorage,
  MdShare,
  MdArrowForward,
} from 'react-icons/md';
import styles from './styles.module.css';

const services = [
  {
    id: 'cloudservices',
    title: 'Public Cloud',
    blurb: 'Managed AWS resources, workflows, and security guidance.',
    icon: MdCloudQueue,
    docsLink: 'https://docs.ciroh.org/docs/services/cloudservices',
  },
  {
    id: 'on-prem',
    title: 'On-Premises',
    blurb: 'Guidance for installing CIROH tooling on HPC or data centers.',
    icon: MdStorage,
    docsLink: 'https://docs.ciroh.org/docs/services/on-prem',
  },
  {
    id: 'external-resources',
    title: 'External Resources',
    blurb: 'Partner docs, references, and related knowledge bases.',
    icon: MdShare,
    docsLink: 'https://docs.ciroh.org/docs/services/external-resources',
  },
];

function GroupCard({ group }) {
  const Icon = group.icon;
  // Construct external docs URL
  const docsUrl = `https://docs.ciroh.org${group.docsRoute}`;

  return (
    <a
      href={docsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.groupCard}
    >
      <div className={styles.cardIconWrapper}>
        {Icon && <Icon className={styles.cardIcon} />}
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{group.title}</h3>
        <p className={styles.cardDescription}>{group.blurb}</p>
      </div>
      <div className={styles.cardArrow}>
        <MdArrowForward />
      </div>
    </a>
  );
}

function ServiceCard({ service }) {
  const Icon = service.icon;

  return (
    <a
      href={service.docsLink}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.groupCard}
    >
      <div className={styles.cardIconWrapper}>
        {Icon && <Icon className={styles.cardIcon} />}
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{service.title}</h3>
        <p className={styles.cardDescription}>{service.blurb}</p>
      </div>
      <div className={styles.cardArrow}>
        <MdArrowForward />
      </div>
    </a>
  );
}

export default function DocsPage() {
  const location = useLocation();
  const productGroupsRef = useRef(null);
  const servicesRef = useRef(null);

  useEffect(() => {
    // Handle hash-based navigation (e.g., #services, #products)
    const hash = location.hash.replace('#', '');

    if (hash === 'services' && servicesRef.current) {
      setTimeout(() => {
        servicesRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    } else if (hash === 'products' && productGroupsRef.current) {
      setTimeout(() => {
        productGroupsRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    }
  }, [location.hash]);

  // Filter to only show groups that have docsRoute
  const displayGroups = groups.filter(group => group.title);

  return (
    <Layout
      title="Documentation"
      description="Explore CIROH product documentation and services."
    >
      <main className="container margin-vert--lg">
        <div className={styles.pageHeader}>
          <h1>Documentation</h1>
          <p className={styles.pageDescription}>
            Comprehensive documentation for CIROH products and services.
            Access guides, tutorials, and technical references for all our tools and platforms.
          </p>
        </div>

        {/* Product Groups Section */}
        <section
          id="products"
          ref={productGroupsRef}
          className={styles.section}
        >
          <h2 className={styles.sectionTitle}>Product Categories</h2>
          <div className={styles.cardsGrid}>
            {displayGroups.map(group => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        </section>

        {/* Services Section */}
        <section
          id="services"
          ref={servicesRef}
          className={styles.section}
        >
          <h2 className={styles.sectionTitle}>Services</h2>
          <div className={styles.cardsGrid}>
            {services.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
