import React, { useEffect, useState } from "react";
import { getTopics } from "../services/documentApi";

function TopicsPage() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Temporary document ID for testing
  const documentId = 3;

  useEffect(() => {
    async function loadTopics() {
      try {
        const data = await getTopics(documentId);
        setTopics(data.topics || data);
      } catch (err) {
        setError("Failed to load topics.");
      } finally {
        setLoading(false);
      }
    }

    loadTopics();
  }, []);

  if (loading) {
    return <h2>Loading topics...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div>
      <h1>Topics</h1>

      {topics.length === 0 ? (
        <p>No topics found.</p>
      ) : (
        topics.map((topic) => (
          <div key={topic.id}>
            <h2>{topic.name}</h2>
            <p>{topic.description}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default TopicsPage;