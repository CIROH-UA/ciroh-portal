import React, { useState, useEffect } from 'react';
import styles from './header.module.css';


export default function TypewriterText({ texts, typingSpeed = 100, pauseDuration = 1500 }) {
    const [textIndex, setTextIndex] = useState(0);    // Which phrase in `texts` we're on
    const [subIndex, setSubIndex] = useState(0);      // Current character index
    const [isDeleting, setIsDeleting] = useState(false);
  
    useEffect(() => {
      if (textIndex >= texts.length) {
        // If reached the end, loop back to 0 (remove this if you want to stop at the end)
        setTextIndex(0);
      }
  
      const currentText = texts[textIndex] ?? '';
      let timeoutId;
  
      if (!isDeleting && subIndex < currentText.length) {
        // Typing forward
        timeoutId = setTimeout(() => {
          setSubIndex(subIndex + 1);
        }, typingSpeed);
      } else if (isDeleting && subIndex > 0) {
        // Deleting
        timeoutId = setTimeout(() => {
          setSubIndex(subIndex - 1);
        }, typingSpeed);
      } else if (!isDeleting && subIndex === currentText.length) {
        // Finished typing the current text, pause before deleting
        timeoutId = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      } else if (isDeleting && subIndex === 0) {
        // Finished deleting, move to next text
        setIsDeleting(false);
        setTextIndex(textIndex + 1);
      }
  
      // Cleanup the timeout on unmount or re-render
      return () => clearTimeout(timeoutId);
    }, [subIndex, isDeleting, textIndex, texts, typingSpeed, pauseDuration]);
  
    return (
      <span className="typewritter" style={{ whiteSpace: 'nowrap' }}>
        
        {texts[textIndex]?.substring(0, subIndex)}
        <span className={styles.cursor}/>
      </span>
    );
  }