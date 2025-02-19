import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const isLoggedIn = !!localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "features", "help", "contact"];
      let currentSection = "home";

      for (let id of sections) {
        const section = document.getElementById(id);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = id;
            break;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth/login"); 
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-blue-500 p-4 text-white shadow-lg flex justify-between items-center z-50">
      <Link to="/" className="text-xl font-bold">SynthAI</Link>

      <div className="flex gap-8">
        {["home", "features", "help", "contact"].map((id) => (
          <a key={id} href={`#${id}`} className="hover:underline">
            {id.charAt(0).toUpperCase() + id.slice(1)}
          </a>
        ))}
      </div>

      <div>
        {isLoggedIn ? (
          <>
            <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded hover:bg-red-700">
              Logout
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
