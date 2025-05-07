import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import IEEELatex from "./../paper-template/IEEETemplate";
import { Plus } from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
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

        if (Array.isArray(paperData)) {
          setPapers(paperData);
        } else {
          setPapers([]);
        }
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

      const response = await fetch(`http://localhost:5000/api/users/${id}/delete/${paperId}`, {
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
    const latexContent = IEEELatex({
      Title: paper.title,
      Abstract: paper.abstract,
      Introduction: paper.introduction,
      "Literature Review": paper.literature,
      Methodology: paper.methodology,
      "Results & Discussion": paper.results,
      Conclusion: paper.conclusion,
      "Future Work": paper.futurework,
      Citations: paper.citation,
    });

    const blob = new Blob([latexContent], { type: "application/x-latex" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${paper.title || "research-paper"}.tex`;
    link.click();
  };

  // Search feature
  const allPapers = papers.filter((paper) =>
    paper?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to create a new paper
  const handleCreate = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}/create-new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authors: [
            {
              name: user.name || "Anonymous",
              email: user.email || "unknown@example.com",
            }
          ]
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate(`new-paper/${data._id}`);
      } else {
        console.error("Error creating paper:", data.message);
      }
    } catch (err) {
      console.error("Server error:", err);
    }
  };

  return (
    <div className="max-w-full mx-28 mt-24 px-6 py-12 bg-white rounded-2xl shadow-xl relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <h2 className="text-3xl font-bold text-gray-800">
          Welcome, {user?.name || "Loading..."} 👋
        </h2>

        <input
          type="text"
          placeholder="Search your papers..."
          className="w-full md:w-96 px-4 py-2 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table or message */}
      {papers.length > 0 ? (
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-gray-700">Your Research Papers</h3>

          <div className="overflow-x-auto rounded-md border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50 text-gray-700 font-semibold text-xl">
                <tr>
                  <th className="px-4 py-3 text-left ">Title</th>
                  <th className="px-4 py-3 text-left ">Last Edited</th>
                  <th className="px-4 py-3 text-left ">Status</th>
                  <th className="px-4 py-3 text-left ">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white text-lg font-medium">
                {allPapers.map((paper) => (
                  <tr key={paper._id}>
                    <td className="px-4 py-3">{paper.title}</td>
                    <td className="px-4 py-3">{new Date(paper.lastEdited).toLocaleDateString()}</td>
                    <td className="px-4 py-3 capitalize">{paper.status}</td>
                    <td className="px-4 py-3 flex flex-wrap gap-4 text-lg">
                      <Link to={`/user/${id}/edit/${paper._id}`} className="text-blue-600 ">
                        ✏ Edit
                      </Link>
                      <button onClick={() => handleCopy(paper.title)} className="text-gray-600 ">
                        📋 Copy
                      </button>
                      <button onClick={() => handleDownload(paper)} className="text-green-600 ">
                        ⬇ Download
                      </button>
                      <button onClick={() => handleDelete(paper._id)} className="text-red-500 :underline">
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
        <div className="text-center py-10 text-gray-600">
          <p>No research papers found.</p>
          <p className="text-sm mt-2">Click the ➕ button below to get started.</p>
        </div>
      )}

      {/* Floating New Paper Button */}
      <button
        onClick={handleCreate}
        className="fixed bottom-20 right-10 bg-blue-600 hover:bg-blue-700 text-white p-5 rounded-full shadow-xl transition-all flex items-center justify-center font-semibold"
        aria-label="Create new paper"
      >
        <Plus className="w-6 h-6 text-white" />
        <p className="pl-3 text-xl">Create New Paper</p>
      </button>
    </div>

  );
}

export default Dashboard;
