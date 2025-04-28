import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  const userId = user ? user._id : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-blue-500 p-4 text-white shadow-lg flex justify-between items-center z-50">
      {isLoggedIn ? (
        <Link to={`/user/${userId}`} className="text-2xl font-bold">
          SynthAI
        </Link>
      ) : (
        <Link to="/" className="text-2xl font-bold">SynthAI</Link>
      )}

      <div className="flex gap-10 text-xl font-bold">
        {["home", "features", "help", "contact"].map((id) => (
          <a key={id} href={`#${id}`} className="hover:underline">
            {id.charAt(0).toUpperCase() + id.slice(1)}
          </a>
        ))}
      </div>

      <div>
        {isLoggedIn ? (
          <>
            {/* Profile Icon */}
            <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded hover:bg-red-700">
              Logout
            </button>
            <button
              onClick={() => navigate(`/user/${userId}/profile`)}
              className="text-white text-4xl px-5 align-middle "
            >
              <FaUserCircle />
            </button>
          </>
        ) : (
          <Link to="/auth/login" className="bg-green-500 px-4 py-2 rounded hover:bg-green-700">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
