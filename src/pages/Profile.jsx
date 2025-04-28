import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

function Profile() {
  const { id } = useParams(); 
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
        const userRes = await fetch(`http://localhost:5000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();
        setUser(userData);

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
  }, [id, navigate]);

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;

  return (
    <div className="flex flex-col pt-24 min-h-screen bg-gray-100 p-6 space-y-8">
      
      {/* Profile Section */}
      <div className="bg-white shadow-lg rounded-2xl p-8 flex w-full items-center">
        {/* Profile Picture */}
        <div className="flex-shrink-0">
          <FaUserCircle className="text-gray-400 text-[8rem]" />
        </div>

        {/* Profile Details */}
        <div className="ml-8 flex flex-col">
          <h2 className="text-3xl font-bold text-gray-800">{user?.name || "User"}</h2>
          <p className="text-gray-600 text-lg">{user?.email}</p>

          <div className="flex flex-wrap mt-4 text-gray-700 text-base gap-8">
            <div><strong>Location:</strong> {user?.location || "India"}</div>
            <div><strong>University:</strong> {user?.university || "N/A"}</div>
            <div><strong>Total Papers:</strong> {user?.papers?.length || 0}</div>
          </div>

          <button
            className="mt-6 bg-blue-500 hover:bg-blue-600 transition-colors text-white font-semibold px-6 py-2 rounded-full w-max"
            onClick={() => navigate("/edit-profile")}
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Co-Authors Section */}
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Co-Authors</h3>

        {user?.coAuthors && user.coAuthors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.coAuthors.map((author, index) => (
              <div 
                key={index} 
                className="flex items-center p-4 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <FaUserCircle className="text-gray-300 text-5xl" />
                <div className="ml-4">
                  <div className="font-semibold text-gray-800">{author.name}</div>
                  <div className="text-sm text-gray-500">{author.email}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No co-authors added yet.</p>
        )}
      </div>

    </div>
  );
}

export default Profile;
