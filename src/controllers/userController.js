import User from '../models/User.js';
import ResearchPaper from '../models/ResearchPaper.js';

const getUserById = async (req, res) => {
    const user = await User.findById(req.params.id);
  
    if (user) res.json(user);
    else res.status(404).json({ message: "Cannot find User" });
};

const getCoAuthors = async (req, res) => {
    
    try{

        const userId = req.params.id;
        const user = await User.findById(userId);
        const coAuthIDs = user.coauthors || [];
        const coauthors = await User.find({
            _id: { $in: coAuthIDs },
          });

        const coauthorDetails = coauthors.map(user => ({
            id: user._id,
            name: user.name,
            email: user.email,
            university: user.university || "N/A",
            location: user.location,
            totalPapers: user.papers?.length || 0,
          }));
        res.json(coauthorDetails);
    }
    catch (error) {
        console.error("Error fetching co-authors:", error);
        res.status(500).json({ message: "Internal server error" });
    }
    
};
  
export {getUserById, getCoAuthors};