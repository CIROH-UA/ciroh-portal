import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

/**
 * A split layout with a static image on one side
 * and a title + text on the other side.
 *
 * Props:
 * - image: Path/URL to the static image
 * - alt: Alt text for the image
 * - title: A string for the title
 * - text: A string (or React node) for the text
 * - reverse: (boolean) if true, image goes on the right, text on the left
 */
export default function SplitImageLayout({
  image,
  alt = 'Image',
  title,
  text,
  reverse = false,
}) {
  return (
    <div
      className={clsx(
        styles.splitContainer,
        reverse && styles.splitReverse
      )}
    >
      {/* Image Side */}
      <div className={styles.splitImage}>
        <img src={image} alt={alt} className={styles.splitImg} />
      </div>

      {/* Text Side */}
      <div className={styles.splitContent}>
        <h2 className={styles.splitTitle}>{title}</h2>
        <p className={styles.splitText}>{text}</p>
      </div>
    </div>
  );
}
