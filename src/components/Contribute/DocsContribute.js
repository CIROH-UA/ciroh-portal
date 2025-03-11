import React from 'react';
import styles from './styles.module.css';
import { contributeSimpleDocsCards,contributeBlogsDocsCards } from './utils';
import StepsCards from './StepsCards';
import ActionButtons from './ActionButtons';
import CardsHeader from './CardsHeader';

export default function DocsContribute({ description }) {

  return (
      <div className={styles.currentAppSection}>
        <div className={styles.headerContainer}>
          <h3 className={styles.description2}>
             {description}
          </h3>

        </div>
        {/* <iframe width="100%" style={{"aspect-ratio": "16 / 9"}} src="https://www.youtube.com/embed/B8wp_eTW204?si=FbCsL7yyKLH4vUZs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe> */}
        <CardsHeader header="Contribute on 3 Easy Steps" />
        <ActionButtons
            buttons={[
                { label: "Add Documentation", href: "https://docs.ciroh.org/contribute/", primary: true },
                { label: "Visit the Docs", href: "https://docs.ciroh.org" }
              ]}
        />
        <StepsCards
            steps={contributeSimpleDocsCards}
            containerId="add-docs-steps"
        />

        <CardsHeader header="Add a Blog on 3 Easy Steps" />

        <StepsCards
            steps={contributeBlogsDocsCards}
            containerId="add-blogs-steps"
        />
        <ActionButtons
            buttons={[
                { label: "Add a Blog", href: "https://docs.ciroh.org/contribute/#adding-posts", primary: true },
                { label: "Visit Blogs", href: "https://docs.ciroh.org/blog" }
              ]}
        />
      </div>
    
  );
}
