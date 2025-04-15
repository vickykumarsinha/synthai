import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

function Profile() {
  const { userId } = useParams(); // Get user ID from URL
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/auth/login");
          return;
        }

        const response = await fetch(`http://localhost:5000/api/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, navigate]);

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96 text-center">
        <FaUserCircle className="text-gray-400 text-6xl mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">{user?.name || "User"}</h2>
        <p className="text-gray-600">{user?.email}</p>

        <div className="mt-4 text-gray-700 text-sm">
          <p><strong>Username:</strong> {user?.username || "N/A"}</p>
          <p><strong>Role:</strong> {user?.role || "Member"}</p>
          <p><strong>Joined:</strong> {new Date(user?.createdAt).toLocaleDateString()}</p>
        </div>

        <button
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => navigate("/edit-profile")}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}

export default Profile;
