import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import IEEELatex from "./../paper-template/IEEETemplate";

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
    <div className="max-w-6xl mt-20 mx-auto p-6 bg-white shadow-lg rounded-lg relative w-full">
      <h2 className="text-2xl font-bold text-center mb-6">
        Welcome, {user?.name || "Loading..."}!
      </h2>

      <button
        onClick={handleCreate}
        className="fixed bottom-20 right-10 bg-blue-500 text-white p-5 px-8 rounded-full shadow-lg hover:bg-blue-600 transition items-center flex" 
      >
        
        <span className="text-white text-xl font-semibold">New Paper</span>
      </button>

      <input
        type="text"
        placeholder="Search Papers..."
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
                {allPapers.map((paper) => (
                  <tr key={paper._id} className="border-b">
                    <td className="p-2 border">{paper.title}</td>
                    <td className="p-2 border">{new Date(paper.lastEdited).toLocaleDateString()}</td>
                    <td className="p-2 border">{paper.status}</td>
                    <td className="p-2 border flex gap-4 items-center">
                      <Link to={`/user/${id}/edit/${paper._id}`} className="text-blue-500 font-semibold">
                        ✏ Edit
                      </Link>
                      <button onClick={() => handleCopy(paper.title)} className="text-gray-500 font-semibold">
                        📋 Copy
                      </button>
                      <button onClick={() => handleDownload(paper)} className="text-green-500 font-semibold">
                        ⬇ Download
                      </button>
                      <button onClick={() => handleDelete(paper._id)} className="text-red-500 font-semibold">
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
