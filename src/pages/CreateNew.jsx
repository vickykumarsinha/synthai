import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";

const sections = [
  "Title",
  "Abstract",
  "Introduction",
  "Literature Review",
  "Methodology",
  "Results & Discussion",
  "Conclusion",
  "Future Work",
  "Citations",
];

const contentType = [
  "title",
  "abstract",
  "introduction",
  "literature",
  "methodology",
  "results",
  "conclusion",
  "futurework",
  "citation",
];

function CreateNewPaper() {
  const { id } = useParams();
  const [selectedSection, setSelectedSection] = useState(sections[0]);
  const [content, setContent] = useState({});
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const handleContentChange = (e) => {
    setContent({ ...content, [selectedSection]: e.target.value });
  };

  const handleSave = async () => {
    if (!content) {
      alert("Please enter content before saving.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}/savepapers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: id,
          title: content["Title"],
          abstract: content["Abstract"] || "",
          introduction: content["Introduction"] || "",
          literature: content["Literature"] || "",
          methodology: content["Methodology"] || "",
          results: content["Results"] || "",
          conclusion: content["Conclusion"] || "",
          futurework: content["FutureWork"] || "",
          citations: content["Citation"] || "",
        }),
      });

      if (response.ok) {
        alert("Paper saved successfully!");
      }
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = { sender: "user", text: message };
    setMessages([...messages, userMessage]);
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
        setMessages([...messages, userMessage, botMessage]);
      } else {
        console.error("Error from AI:", data.error);
      }
    } catch (error) {
      console.error("Error communicating with AI:", error);
    }
  };

  return (
    <div className="flex mt-16 h-screen">
      {/* Left Sidebar */}
      <div className="w-1/5 bg-gray-800 text-white p-4">
        <h2 className="text-lg font-bold mb-4">Sections</h2>
        {sections.map((section) => (
          <button
            key={section}
            className={`w-full p-2 mb-2 rounded text-left ${
              selectedSection === section ? "bg-blue-500" : "hover:bg-gray-700"
            }`}
            onClick={() => setSelectedSection(section)}
          >
            {section}
          </button>
        ))}
      </div>

      {/* Main Editor */}
      <div className="flex-1 p-6 bg-gray-200" onClick={() => setShowChat(false)}>
        <h2 className="text-xl font-semibold mb-4">{selectedSection}</h2>
        <textarea
          className="w-full h-[50vh] border p-2 rounded-xl"
          placeholder={`Write your ${selectedSection} here...`}
          value={content[selectedSection] || ""}
          onChange={handleContentChange}
        />
        <div className="mt-4 flex justify-between">
          <Link to="/user/" className="text-blue-500">
            ← Back to Dashboard
          </Link>
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Save Paper
          </button>
        </div>
      </div>

      {/* AI Chat Sidebar */}
      <div className="relative">
        <button
          className="fixed top-20 right-5 bg-blue-600 text-white p-3 rounded-full shadow-lg"
          onClick={() => setShowChat(true)}
        >
          <FaRobot size={35} />
        </button>

        {showChat && (
          <div className="fixed top-20 right-5 rounded-2xl w-96 h-[90vh] bg-white shadow-lg p-4 border-l flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold">AI Assistant</h2>
              <button onClick={() => setShowChat(false)} className="text-red-500">
                <FaTimes size={20} />
              </button>
            </div>

            {/* Chat Display */}
            <div className="flex-1 overflow-y-auto border p-2 rounded bg-gray-100">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 my-1 rounded-md ${
                    msg.sender === "user" ? "bg-blue-200 text-right" : "bg-gray-300 text-left"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Input Field */}
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

export default CreateNewPaper;
