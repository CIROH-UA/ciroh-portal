// Publications

import React, { useState, useEffect } from 'react';
import Zotero from 'zotero-api-client';
import PublicationCard from './PublicationCard';
import styles from './Publications.module.css'; // optional CSS module for styling

export default function Publications({ apiKey, groupId }) {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPublications() {
      setLoading(true);
      setError(null);

      try {
        // Initialize Zotero client
        const client = new Zotero(apiKey);

        // For a Group Library, use the library method with type 'group'
        const itemsResponse = await client.library('group', groupId).items().top().get();
        // Alternatively, for a User Library:
        // const itemsResponse = await client.library('user', userId).items().top().get();

        const items_list = itemsResponse.getData();
        console.log(items_list);
        setPublications(items_list);
      } catch (err) {
        setError(err.message || 'Error fetching publications');
      } finally {
        setLoading(false);
      }
    }

    fetchPublications();
  }, [apiKey, groupId]);

  if (loading) {
    return <p>Loading publications...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className={styles.publicationsContainer}>
      {publications.map((pub, index) => (
        <PublicationCard key={pub.key || index} publication={pub} />
      ))}
    </div>
  );
}
