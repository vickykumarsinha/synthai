import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaSearch } from "react-icons/fa";


function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  const userId = user ? user._id : null;

  // Close dropdown when clicking outside
  const dropdownRef = useRef();
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth/login");
  };

  const handlePaperSearch = async () => {
    // if (searchQuery.trim()) {
    const rawQuery = searchQuery.trim(); // e.g., "deep learning"
    const query = `title:"${rawQuery}"`;

    try {
      setShowDropdown(true);

      const response = await fetch(
        `https://api.core.ac.uk/v3/search/works/?q=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer kePOZQhYfrpCtWuVJnqD20dSxTzs1aL8`,
          },
        }
      );
      console.log(response)
      if (!response.ok) {
        throw new Error('Error fetching data');
      }

      const data = await response.json();
      setSearchResults(data.results || []); // Check if the response has the right data field
    } catch (error) {
      console.error("Error fetching data from API:", error);
    }
    //}
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-sm p-4 text-gray-800 z-50 flex justify-between items-center">
      <Link to={isLoggedIn ? `/user/${userId}` : `/`} className="text-2xl font-bold text-blue-700">
        SynthAI
      </Link>

      <div className="hidden md:flex space-x-8 text-2xl font-semibold ">
        {["home", "features", "help"].map((id) => (
          <a
            key={id}
            href={`#${id}`}
            className="hover:text-blue-600 hover:scale-105 transition-all duration-300"
          >
            {id.charAt(0).toUpperCase() + id.slice(1)}
          </a>
        ))}
      </div>
      {/* Search Bar */}


      {/* Profile/Login Buttons */}
      <div className="flex items-center gap-4">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search research papers..."
            className="w-full pl-4 pr-10 py-2 rounded-full border-2 border-blue-600 focus:outline-none hover:bg-blue-100 transition-all text-blue-600 placeholder-blue-600"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handlePaperSearch();
              }
            }}
          />
          <button
            onClick={handlePaperSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
          >
            <FaSearch className="text-blue-600" />
          </button>

          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute mt-2 w-full bg-white shadow-lg rounded-lg max-h-72 overflow-auto z-50"
            >
              {searchResults.length > 0 ? (
                searchResults.map((paper, index) => (
                  <div
                    key={index}
                    className="p-3 text-black hover:bg-gray-100 cursor-pointer border-b"
                  >
                    <h4 className="font-semibold">{paper.title}</h4>
                    {paper.publishedDate && (
                      <p className="text-sm text-gray-500">
                        <strong>Published:</strong>{" "}
                        {new Date(paper.publishedDate).toLocaleDateString()}
                      </p>
                    )}
                    {paper.citationCount != null && (
                      <p className="text-sm text-gray-500">
                        <strong>Citations:</strong> {paper.citationCount}
                      </p>
                    )}
                    {paper.downloadUrl ? (
                      <a
                        href={paper.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Download Full Paper
                      </a>
                    ) : paper.doi ? (
                      <a
                        href={`https://doi.org/${paper.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View DOI
                      </a>
                    ) : (
                      <p className="text-sm italic text-gray-400">No full text available</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="p-2 text-gray-500">No results found.</p>
              )}
            </div>
          )}
        </div>
        {isLoggedIn ? (
          <>
            <button
              onClick={handleLogout}
              className="border-2 border-red-600 text-red-600 px-6 py-2 rounded-full font-medium hover:bg-red-100 hover:scale-105 transition-all duration-300"
            >
              Logout
            </button>
            <button
              onClick={() => navigate(`/user/${userId}/profile`)}
              className="text-white text-3xl"
            >
              <FaUserCircle className="text-blue-700 text-4xl" />
            </button>
          </>
        ) : (
          <></>
        )}
      </div>
    </nav >
  );
}

export default Navbar;
