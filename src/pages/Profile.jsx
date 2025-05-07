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


        if (userData.coauthors && userData.coauthors.length > 0) {
          //const coAuthIDs = userData.coauthors;

          const coauthorRes = await fetch(`http://localhost:5000/api/users/${id}/getcoauthors`, {
            headers: { Authorization: `Bearer ${token}` },
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
    <div className="flex flex-col pt-24 min-h-screen bg-gray-100 px-6 space-y-12 max-w-full">

      {/* Profile Section */}
      <div className="bg-white shadow-xl rounded-2xl px-10 py-8 flex flex-col md:flex-row items-start md:items-center gap-8">
        {/* Profile Icon */}
        <FaUserCircle className="text-gray-400 text-[8rem]" />

        {/* Details */}
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold text-gray-800">{user?.name || "User"}</h2>
          <p className="text-gray-600 text-lg">{user?.email}</p>

          <div className="flex flex-wrap gap-6 mt-4 text-gray-700 text-base">
            <div><span className="font-semibold">Location:</span> {user?.location || "India"}</div>
            <div><span className="font-semibold">University:</span> {user?.university || "N/A"}</div>
            <div><span className="font-semibold">Total Papers:</span> {user?.papers?.length || 0}</div>
          </div>

          <button
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full transition"
          >
            ✏ Edit Profile
          </button>
        </div>
      </div>

      {/* Co-Authors Section */}
      <div className="bg-white shadow-xl rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Co-Authors</h3>

        {coAuth && coAuth.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coAuth.map((author, index) => (
              <div
                key={index}
                onClick={() => navigate(`/user/${author.id}/profile`)}
                className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl shadow hover:shadow-md cursor-pointer transition"
              >
                <FaUserCircle className="text-gray-300 text-6xl" />
                <div>
                  <div className="font-bold text-lg text-gray-800">{author.name}</div>
                  <div className="text-gray-600">{author.university}</div>
                  <div className="text-gray-500">{author.location}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No co-authors added yet.</p>
        )}
      </div>

      {/* Published Papers Section */}
      <div className="bg-white shadow-xl rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Published Papers</h3>

        {papers?.filter((p) => p.status === "Published").length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {papers
              .filter((paper) => paper.status === "Published")
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((paper, index) => (
                <div key={index} className="bg-gray-50 p-5 rounded-xl shadow hover:shadow-md transition">
                  <h4 className="font-bold text-xl text-gray-800 mb-2">{paper.title}</h4>
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    {paper.authors?.map((a) => a.name).join(", ")}
                  </p>
                  <p className="text-gray-500 text-sm">{paper.introduction?.slice(0, 100)}...</p>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-gray-500">No papers published yet.</p>
        )}
      </div>

    </div>

  );
}

export default Profile;
