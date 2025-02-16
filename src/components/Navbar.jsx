import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Navbar({ user, logout }) {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["Home", "Features", "Help", "Contact us"];
      let currentSection = "Home";

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

  return (
    <nav className="fixed top-0 left-0 w-full bg-blue-500 p-4 text-white shadow-lg flex justify-between items-center z-50">
      <Link to="/" className="text-xl font-bold">SynthAI</Link>

      {/* Centered Navigation Links */}
      <div className="flex gap-8">
        {["home", "features", "help", "contact"].map((id) => (
          <button
            key={id}
            onClick={() => scrollToSection(id)}
            className={`hover:underline transition duration-300 ${
              activeSection === id ? "font-bold border-b-2 border-white" : ""
            }`}
          >
            {id.charAt(0).toUpperCase() + id.slice(1)}
          </button>
        ))}
      </div>

      <div>
        {user ? (
          <button onClick={logout} className="bg-red-500 px-4 py-2 rounded hover:bg-red-700">
            Logout
          </button>
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
