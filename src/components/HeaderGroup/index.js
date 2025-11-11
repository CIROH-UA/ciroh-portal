import { Fragment } from "react";
import  clsx from "clsx";
import Link from "@docusaurus/Link";
import styles from './styles.module.css';


export function HeaderGroup({ 
  group, 
  backLink, 
  docsUrl 
}) {
    const Icon = group?.icon;
    return (
        <Fragment>
        <Link className={styles.backLink} to={`/${backLink}`}>
          ← Categories
        </Link>

        <article className={styles.headerCard}>
          <div className={styles.headerMain}>
            {Icon ? <Icon className={styles.headerIcon} aria-hidden="true" /> : null}
            <div>
              <h1 className={styles.headerTitle}>{group.title}</h1>
              {group.blurb ? (
                <p className={styles.headerBlurb}>{group.blurb}</p>
              ) : null}
              {docsUrl ? (
                <div className={styles.ctaRow}>
                  <a
                    className={clsx(styles.ctaButton, styles.ctaButtonPrimary)}
                    href={docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View documentation
                  </a>
                </div>
              ) : null}
            </div>
          </div>

        </article>
        </Fragment>
    );
}
