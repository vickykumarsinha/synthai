import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function PaperSearch() {
  const query = useQuery().get("query");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchPapers = async () => {
      const res = await fetch(`https://core.ac.uk:443/api-v2/search/${query}?apiKey=kePOZQhYfrpCtWuVJnqD20dSxTzs1aL8`);
      const data = await res.json();
      setResults(data.data || []);
    };

    if (query) fetchPapers();
  }, [query]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Results for "{query}"</h2>
      <ul>
        {results.map((paper, idx) => (
          <li key={idx} className="mb-4 border p-4 rounded">
            <h3 className="font-bold">{paper.title}</h3>
            <p>{paper.description}</p>
            <a href={paper.downloadUrl || paper.fullTextUrl || paper.url} target="_blank" className="text-blue-600 underline">
              View Full Paper
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PaperSearch;
