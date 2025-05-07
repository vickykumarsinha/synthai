import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";
import latex from "../paper-template/IEEETemplate";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const sections = [
  "Title", "Abstract", "Introduction", "Literature Review", "Methodology", "Results & Discussion", "Conclusion", "Future Work", "Citations"
];

function CreateNewPaper() {
  const { id, paperId } = useParams();
  const [selectedSection, setSelectedSection] = useState(sections[0]);
  const [content, setContent] = useState({});
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [authorDetails, setAuthorDetails] = useState([{ name: "", email: "" }]);
  const [university, setUniversity] = useState("");

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
  }, [id]);

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


      const response = await fetch(`http://localhost:5000/api/users/${id}/savechanges/${paperId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Paper saved successfully!");
      } else {
        console.error("Error saving research paper:", data);
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

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
    <div className="flex pt-16 h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/5 bg-blue-100 p-6 border-r-2 border-none">
        <h2 className="text-xl font-bold mb-6">Sections</h2>
        {sections.map((section) => (
          <button
            key={section}
            className={`w-full py-3 px-4 mb-3 rounded-xl text-left font-medium transition-all duration-200 ${selectedSection === section
                ? "bg-blue-600 text-white shadow-md"
                : "hover:bg-blue-200"
              }`}
            onClick={() => setSelectedSection(section)}
          >
            {section}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto relative bg-gray-100">
        {/* AI Chat Button */}
        <button
          className="fixed bottom-10 right-10 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-xl"
          onClick={() => setShowChat(true)}
        >
          <FaRobot size={28} />
        </button>

        {selectedSection === "Title" ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Paper Title</h2>
            <input
              type="text"
              className="w-full p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter paper title"
              value={content.Title || ""}
              onChange={(e) => setContent({ ...content, Title: e.target.value })}
            />

            <h2 className="text-2xl font-bold text-gray-800">Authors</h2>
            {authorDetails.map((author, index) => (
              <div key={index} className="flex gap-4 items-center mb-3">
                <input
                  type="text"
                  className="p-3 border-2 border-gray-300 rounded-xl w-1/2"
                  placeholder="Author Name"
                  value={author.name}
                  onChange={(e) =>
                    handleAuthorChange(index, "name", e.target.value)
                  }
                />
                <input
                  type="email"
                  className="p-3 border-2 border-gray-300 rounded-xl w-1/2"
                  placeholder="Author Email"
                  value={author.email}
                  onChange={(e) =>
                    handleAuthorChange(index, "email", e.target.value)
                  }
                />
                <button
                  onClick={() => handleRemoveAuthor(index, author.email)}
                  className="bg-white hover:bg-red-200 border-2 border-red-600 text-red-600 font-bold px-4 py-2 rounded-xl"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              className="bg-white hover:bg-blue-100 border-2 border-blue-600 text-blue-600 px-5 py-2 rounded-xl"
              onClick={addAuthor}
            >
              + Add Author
            </button>

            <h2 className="text-2xl font-bold text-gray-800">University (Optional)</h2>
            <input
              type="text"
              className="w-full p-3 border-2 border-gray-300 rounded-xl"
              placeholder="University Name"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">{selectedSection}</h2>
            <ReactQuill
              theme="snow"
              value={content[selectedSection] || ""}
              onChange={handleContentChange}
              className="bg-white border-2 border-gray-300 rounded-xl min-h-[250px]"
            />
          </div>
        )}

        {/* Save & Back Buttons */}
        <div className="mt-8 flex justify-between items-center">
          <Link
            to={`/user/${id}`}
            className="text-blue-600 text-xl hover:underline font-medium"
          >
            ← Back to Dashboard
          </Link>
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2"
          >
            <FaPaperPlane />
            Save Paper
          </button>
        </div>

        {/* AI Chat Panel */}
        {showChat && (
          <div className="fixed top-20 right-5 rounded-2xl w-96 h-[90vh] bg-white shadow-2xl border-2 border-gray-300 p-4 flex flex-col z-50">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold text-gray-800">AI Assistant</h2>
              <button onClick={() => setShowChat(false)} className="text-red-600">
                <FaTimes size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-gray-100 rounded-xl p-3 space-y-2 border">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-md max-w-[80%] ${msg.sender === "user"
                      ? "bg-blue-100 self-end text-right"
                      : "bg-gray-300 self-start text-left"
                    }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center border rounded-xl overflow-hidden">
              <input
                type="text"
                className="flex-1 px-3 py-2 outline-none"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
              >
                <FaPaperPlane />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>

  );
}

export default CreateNewPaper;
