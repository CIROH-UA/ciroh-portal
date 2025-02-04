import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";

export default function GitHubStars({ repoUrl }) {
  const [stars, setStars] = useState(null);

  useEffect(() => {
    // Extract owner and repo name from the provided repo URL
    const [, owner, repo] = new URL(repoUrl).pathname.split("/");

    // GitHub API call to fetch repository details
    fetch(`https://api.github.com/repos/${owner}/${repo}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.stargazers_count) {
          setStars(data.stargazers_count);
        }
      })
      .catch(() => setStars(null)); // Handle errors gracefully
  }, [repoUrl]);

  return (
    <div className={styles.githubButtonContainer}>
      <a
        href={repoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.githubBtn}
      >
        <span className={styles.githubIcon}></span>
        <span className={styles.githubText}>Star</span>
      </a>
      <a
        href={`${repoUrl}/stargazers`}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.githubCount}
      >
        {stars !== null ? stars.toLocaleString() : "..."}
      </a>
    </div>
  );
}
