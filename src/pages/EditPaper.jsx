import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";
import latex from "../paper-template/IEEETemplate";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";


const sections = [
  "Title",
  "Abstract",
  "Introduction",
  "Literature",
  "Methodology",
  "Results",
  "Conclusion",
  "Futurework",
  "Citation"
];

function EditPaper() {
  const { id, paperId } = useParams();
  const [selectedSection, setSelectedSection] = useState(sections[0]);
  const [content, setContent] = useState({});
  const [authorDetails, setAuthorDetails] = useState([{ name: "", email: "" }]);
  const [university, setUniversity] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch the existing paper
  useEffect(() => {
    const fetchPaper = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${id}/getpapers/${paperId}`);
        if (response.ok) {
          const data = await response.json();

          setContent({
            Title: data.title || "",
            Abstract: data.abstract || "",
            Introduction: data.introduction || "",
            Literature: data.literature || "",
            Methodology: data.methodology || "",
            Results: data.results || "",
            Conclusion: data.conclusion || "",
            Futurework: data.futurework || "",
            Citation: data.citation || "",
          });

          setAuthorDetails(data.authors || [{ name: "", email: "" }]);
          setUniversity(data.university || "");
        }
      } catch (error) {
        console.error("Error loading paper:", error);
      }
    };

    fetchPaper();
  }, [id, paperId]);

  const handleContentChange = (value) => {
    setContent({ ...content, [selectedSection]: value });
  };

  const handleAuthorChange = (index, field, value) => {
    const updatedAuthors = [...authorDetails];
    updatedAuthors[index][field] = value;
    setAuthorDetails(updatedAuthors);
  };

  const addAuthor = () => {
    setAuthorDetails([...authorDetails, { name: "", email: "" }]);
  };

  const handleRemoveAuthor = (index, email) => {
    const updatedAuthors = [...authorDetails];
    updatedAuthors.splice(index, 1);
    setAuthorDetails(updatedAuthors);

    // Remove author from the database
    try {
      const res = fetch(`http://localhost:5000/api/users/${id}/remove-author/${paperId}`, {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
        body: JSON.stringify({ removedEmail: email }),
      })
    }catch (error) {
      console.error("Error removing author:", error);
    }
  }

  const handleSave = async () => {
    if (!content.Title || content.Title.trim() === "") {
      alert("Title is required");
      return;
    }

    try {
      const requestData = {
        userId: id,
        paperId,
        title: content.Title,
        authors: authorDetails,
        university,
        abstract: content.Abstract || "",
        introduction: content.Introduction || "",
        literature: content.Literature || "",
        methodology: content.Methodology || "",
        results: content.Results || "",
        conclusion: content.Conclusion || "",
        futurework: content.Futurework || "",
        citation: content.Citations || "",
      };

      console.log("Request Data:", requestData.authors); // Debugging line
      const response = await fetch(`http://localhost:5000/api/users/${id}/savechanges/${paperId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      
      if (response.ok) {
        alert("Paper updated successfully!");
      } else {
        const errorData = await response.json();
        console.log(errorData.message);
      }
    } catch (error) {
      console.error("Error saving paper:", error);
    }
  };
  
  // Communicate with AI
  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = { sender: "user", text: message };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      if (response.ok) {
        const botMessage = { sender: "bot", text: data.response };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } else {
        console.error("Error from AI:", data.error);
      }
    } catch (error) {
      console.error("Error communicating with AI:", error);
    }
  };

  return (
    <div className="flex mt-16 h-screen">
      {/* Sidebar */}
      <div className="w-1/5 bg-gray-800 text-white p-4">
        <h2 className="text-lg font-bold mb-4">Sections</h2>
        {sections.map((section) => (
          <button
            key={section}
            className={`w-full p-3 mb-2 rounded-xl text-left ${selectedSection === section ? "bg-blue-500" : "hover:bg-gray-700"
              }`}
            onClick={() => setSelectedSection(section)}
          >
            {section}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-200">
        {/* AI Chat Button */}
        <button
          className="fixed bottom-10 right-10 bg-blue-600 text-white p-3 rounded-full shadow-lg"
          onClick={() => setShowChat(true)}
        >
          <FaRobot size={55} />
        </button>

        {selectedSection === "Title" ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">Title</h2>
            <input
              type="text"
              className="w-full p-2 border rounded-xl mb-4"
              placeholder="Enter paper title"
              value={content.Title || ""}
              onChange={(e) =>
                setContent({ ...content, Title: e.target.value })
              }
            />

            <h2 className="text-xl font-semibold mb-4">Authors</h2>
            {authorDetails.map((author, index) => (
              <div key={index} className="mb-2 flex gap-2">
                <input
                  type="text"
                  className="p-2 border rounded-xl w-1/2"
                  placeholder="Author Name"
                  value={author.name}
                  onChange={(e) =>
                    handleAuthorChange(index, "name", e.target.value)
                  }
                />
                <input
                  type="email"
                  className="p-2 border rounded-xl w-1/2"
                  placeholder="Author Email"
                  value={author.email}
                  onChange={(e) =>
                    handleAuthorChange(index, "email", e.target.value)
                  }
                />
                <button
                  onClick={() => handleRemoveAuthor(index, author.email)}
                  className="text-white hover:bg-red-800 font-bold text-2xl ml-2 bg-red-600 px-4 rounded-xl"
                >
                  X
                </button>
              </div>
            ))}
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded mt-2"
              onClick={addAuthor}
            >
              Add Author
            </button>

            <h2 className="text-xl font-semibold mt-4 mb-2">
              University (Optional)
            </h2>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="University Name"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
            />
            
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-4">{selectedSection}</h2>
            <ReactQuill
              theme="snow"
              value={content[selectedSection] || ""}
              onChange={handleContentChange}
              className="bg-white p-2 rounded-xl"
            />
          </div>
        )}

        {/* Buttons */}
        <div className="mt-4 flex justify-between">
          <Link to={`/user/${id}`} className="text-blue-500">
            ← Back to Dashboard
          </Link>
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center gap-2"
          >
            <FaPaperPlane />
            Save Paper
          </button>
        </div>

        {showChat && (
          <div className="fixed top-20 right-5 rounded-2xl w-96 h-[90vh] bg-white shadow-lg p-4 border-l flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold">AI Assistant</h2>
              <button onClick={() => setShowChat(false)} className="text-red-500">
                <FaTimes size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto border p-2 rounded bg-gray-100">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 my-1 rounded-md ${msg.sender === "user" ? "bg-blue-200 text-right" : "bg-gray-300 text-left"
                    }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            <div className="flex items-center mt-2 border rounded-lg p-2">
              <input
                type="text"
                className="flex-1 p-2 border-none outline-none"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
              >
                <FaPaperPlane size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditPaper;