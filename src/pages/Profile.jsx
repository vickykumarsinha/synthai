import { use, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

function Profile() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [papers, setPapers] = useState([]);
  const [coAuth, setCoAuth] = useState(null);
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

        if (!userRes.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userPapersRes = await fetch(`http://localhost:5000/api/users/${id}/getpapers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userPapersData = await userPapersRes.json();
        console.log(userPapersData);
        setPapers(userPapersData);


        if(userData.coauthors && userData.coauthors.length > 0) {
          //const coAuthIDs = userData.coauthors;
          
          const coauthorRes = await fetch(`http://localhost:5000/api/users/${id}/getcoauthors`, {
            headers: { Authorization: `Bearer ${token}`},
          });
          
          const coauthorData = await coauthorRes.json();
          //console.log(coauthorData);
          setCoAuth(coauthorData);
        }

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
            
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Co-Authors Section */}
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Co-Authors</h3>

        {coAuth && coAuth.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coAuth.map((author, index) => (
              <div 
                key={index} 
                className="flex items-center p-4 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition"
                onClick={() => navigate(`/user/${author.id}/profile`)} // Navigate to co-author's profile
              >
                <FaUserCircle className="text-gray-300 text-7xl" />
                <div className="ml-4">
                  <div className="font-bold text-xl text-gray-800">{author.name}</div>
                  <div className="text-l text-gray-500">{author.university}</div>
                  <div className="text-l text-gray-500">{author.location}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No co-authors added yet.</p>
        )}
      </div>

      {/* Published Papers Section */}
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Published paper</h3>

        {papers && papers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {papers
            .filter((paper) => paper.status === "Published")
            .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date descending
            .map((paper, index) => (
              <div 
                key={index} 
                className="flex items-center p-4 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <div className="ml-4">
                  <div className="font-bold text-xl text-gray-800">{paper.title}</div>
                  <div className="text-l text-gray-500 font-bold">{paper.authors?.map(author => author.name).join(", ")}</div>
                  <div className="text-l text-gray-500">{paper.introduction?.slice(0, 100)}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No Papers published yet.</p>
        )}
      </div>

    </div>
  );
}

export default Profile;
