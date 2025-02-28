import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Dashboard() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [papers, setPapers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch user details
        const userRes = await fetch(`http://localhost:5000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();
        setUser(userData);

        // Fetch research papers
        const paperRes = await fetch(`http://localhost:5000/api/users/${id}/getpapers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const paperData = await paperRes.json();
        setPapers(paperData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  // Function to delete a research paper
  const handleDelete = async (paperId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:5000/api/papers/${paperId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setPapers(papers.filter((paper) => paper._id !== paperId));
      }
    } catch (error) {
      console.error("Error deleting paper:", error);
    }
  };

  // Function to copy paper title
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  // Function to download paper as text file
  const handleDownload = (paper) => {
    const content = `Title: ${paper.title}\n\nAbstract: ${paper.abstract}\n\nMethodology: ${paper.methodology}`;
    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${paper.title}.txt`;
    link.click();
  };

  // Filter papers based on search query
  const filteredPapers = papers
    ? papers.filter(
        (paper) =>
          paper.title &&
          paper.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="max-w-6xl mt-20 mx-auto p-6 bg-white shadow-lg rounded-lg relative w-full">
      <h2 className="text-2xl font-bold text-center mb-6">
        Welcome, {user?.name || "Loading..."}!
      </h2>

      <Link
        to="/new-paper"
        className="fixed bottom-20 right-10 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition"
      >
        ➕ New Paper
      </Link>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search papers..."
        className="w-full p-2 border rounded mb-4"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {papers.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Your Research Papers</h3>
          <div className="bg-gray-100 p-4 rounded-lg shadow">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="border-b bg-gray-200">
                  <th className="text-left p-2 border">Title</th>
                  <th className="text-left p-2 border">Last Edited</th>
                  <th className="text-left p-2 border">Status</th>
                  <th className="text-left p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPapers.map((paper) => (
                  <tr key={paper._id} className="border-b">
                    <td className="p-2 border">{paper.title}</td>
                    <td className="p-2 border">{new Date(paper.lastEdited).toLocaleDateString()}</td>
                    <td className="p-2 border">{paper.status}</td>
                    <td className="p-2 border flex gap-4 items-center">
                      <Link to={`/edit-paper/${paper._id}`} className="text-blue-500">
                        ✏ Edit
                      </Link>
                      <button onClick={() => handleCopy(paper.title)} className="text-gray-500">
                        📋 Copy
                      </button>
                      <button onClick={() => handleDownload(paper)} className="text-green-500">
                        ⬇ Download
                      </button>
                      <button onClick={() => handleDelete(paper._id)} className="text-red-500">
                        ❌ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-gray-600 text-center mt-6">No research papers found. Click "New Paper" to create one.</p>
      )}
    </div>
  );
}

export default Dashboard;
