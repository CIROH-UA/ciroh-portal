import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './header.module.css';
import TypewriterText from './TypeWritter';

export default function Header({ title,image,  tagline, buttons }) {


  return (
    <header className={clsx(styles.heroBanner)}>
      <div className={styles.waveBackground}>
        <svg
          className={clsx(styles.waves)}
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Light theme gradient */}
            <linearGradient id="wave-gradient-light" gradientTransform="rotate(45)">
              <stop offset="5%" stopColor="#02a9c173" />
              <stop offset="35%" stopColor="#02a9c173" />
            </linearGradient>
            {/* Dark theme gradient */}
            <linearGradient id="wave-gradient-dark" gradientTransform="rotate(45)">
              <stop offset="5%" stopColor="#255f9c" />
              <stop offset="35%" stopColor="#255f9c" />
            </linearGradient>

            {/* The path definition for waves */}
            <path
              id="wavePath"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
          </defs>

          {/* Wave shapes */}
          <g className={clsx(styles.wavePaths)}>
            <use xlinkHref="#wavePath" x="0" />
            <use xlinkHref="#wavePath" x="50" y="3" />
            <use xlinkHref="#wavePath" x="100" y="5" />
            {/* <use xlinkHref="#wavePath" x="150" y="7" /> */}
          </g>

        
        </svg>
      </div>

      <div className={clsx('container', styles.heroContainer)}>
        {image && (
            <img src={image} alt={title} className={styles.heroImage} />
        )}
        <Heading as="h1" className={clsx('hero__title', styles.heroTitle)}>
          {title}
        </Heading>

        <p className={clsx('hero__subtitle', styles.heroSubtitle)}>{tagline}</p>
                
        <div  className={clsx('hero__subtitle',styles.heroSubtitle, styles.typewriterContainer)}>
          <TypewriterText
            texts={[
              'Products',
              'Datasets',
              'Docs',
              'Publications',
              'Courses',
              'and More...',
            ]}
            typingSpeed={80}   // Adjust typing speed in ms
            pauseDuration={1200} // Adjust pause between typing/deleting
          />
        </div>
        {buttons && buttons.length > 0 && (
          <div className={styles.buttons}>
            {buttons.map((button, index) => (
              <a
                key={index}
                href={button.href}
                className={clsx(
                  'button',
                  styles.button,
                  button.primary ? styles.buttonPrimary : styles.buttonSecondary
                )}
              >
                {button.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
