import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import Counter from "../StatsSection/Counter";
import { SiAmazon , SiGooglecloud } from "react-icons/si";
import { LuServer } from "react-icons/lu";
import { PiGlobeHemisphereEastBold } from "react-icons/pi";
import HeroSection from "@site/src/components/HeroSection";

const SERVICES = [
  {
    id: "aws",
    title: "Amazon Web Services",
    projects: 24,
    users: 69,
    Icon: SiAmazon ,
    accent: "#4bc1d3",
  },
  {
    id: "gcp",
    title: "GCP and JupyterHub",
    projects: 63,
    users: 183,
    Icon: SiGooglecloud,
    accent: "#4bc1d3",
  },
  {
    id: "hpc",
    title: "On-premise HPC",
    projects: 57,
    users: 78,
    Icon: LuServer,
    accent: "#4bc1d3",
  },
  {
    id: "nsf",
    title: "NSF ACCESS Allocations",
    projects: 7,
    users: 75,
    Icon: PiGlobeHemisphereEastBold,
    accent: "#4bc1d3",
  },
];

function usePrefersReducedMotion() {
  const [prefers, setPrefers] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;

    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (event) => setPrefers(event.matches);

    setPrefers(query.matches);
    if (query.addEventListener) {
      query.addEventListener("change", handleChange);
    } else if (query.addListener) {
      query.addListener(handleChange);
    }

    return () => {
      if (query.removeEventListener) {
        query.removeEventListener("change", handleChange);
      } else if (query.removeListener) {
        query.removeListener(handleChange);
      }
    };
  }, []);

  return prefers;
}

export default function Services() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setVisible(true);
      return undefined;
    }

    const node = sectionRef.current;
    if (!node || typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.35 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  return (
    <HeroSection 
      description="We are committed to providing infrastructure support to CIROH consortium partners and members to advance their research. Our impact spans across various cloud platforms and resources."
      background="secondary">

    <section ref={sectionRef} className={styles.servicesSection} aria-labelledby="services-heading">
      <div className={styles.servicesGrid}>
        {SERVICES.map(({ id, title, projects, users, Icon, accent }, index) => (
          <article
            key={id}
            className={clsx(styles.serviceCard, visible && styles.serviceCardVisible)}
            style={{ "--accent": accent, "--delay": index }}
          >
            <div className={styles.cardHeading}>
              <span className={styles.iconOrb} aria-hidden="true">
                <Icon size={36} />
              </span>
              <h3>{title}</h3>
            </div>

            <dl className={styles.metrics}>
              <div className={styles.metricBlock}>
                <dt>Ongoing projects</dt>
                <dd>
                  <Counter target={projects} start={visible} duration={900} format={(n) => n.toLocaleString()} />
                </dd>
              </div>
              <div className={styles.metricBlock}>
                <dt>Active users</dt>
                <dd>
                  <Counter target={users} start={visible} duration={1100} format={(n) => n.toLocaleString()} />
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  </HeroSection>
  );
}
