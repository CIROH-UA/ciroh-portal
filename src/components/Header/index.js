import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

export default function Header({title, tagline}) {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {title}
        </Heading>
        <p className="hero__subtitle">{tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/t/apps/">
             Get Started
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="https://docs.ciroh.org/docs/products/Portal/research-portal/#contribute">
             Contribute
          </Link>
        </div>
      </div>
    </header>
  );
}