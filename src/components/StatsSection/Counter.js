import React, { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";
import clsx from "clsx";

function usePrefersReducedMotion() {
  const [prefers, setPrefers] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (event) => setPrefers(event.matches);

    setPrefers(mediaQuery.matches);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return prefers;
}

export default function Counter({ target = 0, duration = 1200, start = true, format }) {
  const [value, setValue] = useState(0);
  const intervalRef = useRef(null);
  const fromValueRef = useRef(0);
  const prefersReducedMotion = usePrefersReducedMotion();
  const formatterRef = useRef(null);

  if (!formatterRef.current) {
    formatterRef.current = new Intl.NumberFormat();
  }

  useEffect(() => {
    fromValueRef.current = value;
  }, [value]);

  useEffect(() => {
    const parsedTarget = Number(target);
    const safeTarget = Number.isFinite(parsedTarget) ? parsedTarget : 0;

    if (typeof window === "undefined") {
      setValue(safeTarget);
      fromValueRef.current = safeTarget;
      return undefined;
    }

    if (!start) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return undefined;
    }

    if (prefersReducedMotion) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setValue(safeTarget);
      fromValueRef.current = safeTarget;
      return undefined;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const from = fromValueRef.current;
    const range = safeTarget - from;
    const distance = Math.abs(range);

    if (distance === 0) {
      setValue(safeTarget);
      fromValueRef.current = safeTarget;
      return undefined;
    }

    const direction = range > 0 ? 1 : -1;
    const parsedDuration = Number(duration);
    const safeDuration = Number.isFinite(parsedDuration) ? parsedDuration : 2500;
    const rawInterval = distance === 0 ? 0 : Math.floor(Math.abs(safeDuration) / distance);
    const tickInterval = Math.max(16, rawInterval || 0);
    let current = from;

    setValue(current);

    intervalRef.current = window.setInterval(() => {
      current += direction;

      if ((direction === 1 && current >= safeTarget) || (direction === -1 && current <= safeTarget)) {
        current = safeTarget;
        setValue(current);
        fromValueRef.current = current;
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        return;
      }

      setValue(current);
    }, tickInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [target, duration, start, prefersReducedMotion]);

  const renderer = format ?? formatterRef.current.format;
  const displayValue = renderer(value);

  return <span className={clsx(styles.counter)}>{displayValue}</span>;
}
