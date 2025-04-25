import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateNewPaper from "./pages/CreateNew";
import Profile from "./pages/Profile";
import EditPaper from "./pages/EditPaper";
function App() {
  const [user, setUser] = useState(null);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50 ">
        <Navbar user={user} logout={logout} />
        
        <div className="w-full flex flex-col flex-grow py-15">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth">
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route path="/user/:id" element={<Dashboard />} />
              <Route path="/user/:id/new-paper/:paperId" element={<CreateNewPaper />} />
              <Route path="/user/:id/profile" element={<Profile />} />
              <Route path="/user/:id/edit/:paperId" element={<EditPaper />} />
            </Route>
            
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
