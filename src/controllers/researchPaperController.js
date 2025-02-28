import ResearchPaper from "../models/ResearchPaper.js";
import User from "../models/User.js";


// Create a new research paper
// export const createPaper = async (req, res) => {
//   try {
//     const { title } = req.body;

//     if (!title) {
//       return res.status(400).json({ message: "Title is required" });
//     }

//     const paper = new ResearchPaper({
//       user: req.user.id, // Link paper to logged-in user
//       title,
//     });

//     await paper.save();
//     res.status(201).json(paper);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const addResearchPaper = async (req, res) => {
    try {
      const userId = req.params.id;
      const { title, abstract, introduction, methodology, results, references } = req.body;
  
      // Check if user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Create new research paper
      const newPaper = new ResearchPaper({
        user: userId,
        title,
        abstract,
        introduction,
        methodology,
        results,
        references,
      });
  
      // Save paper to DB
      const savedPaper = await newPaper.save();
  
      // Add paper to user's papers list
      user.papers.push(savedPaper._id);
      await user.save(); // Save updated user document
  
      res.status(201).json(savedPaper);
    } catch (error) {
      console.error("Error creating research paper:", error);
      res.status(500).json({ message: "Server error" });
    }
};
  

// Fetch all research papers for a user
export const getUserPapers = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate({
      path: "papers",
      model: "ResearchPaper",
    });
    //const user = await User.findById(userId).populate("papers");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.papers || user.papers.length === 0) {
      return res.status(404).json({ message: "No research papers found." });
    }
    const papers = await ResearchPaper.find({ _id: { $in: user.papers } });

    res.status(200).json(user.papers);

  } catch (error) {
    console.error("Error fetching papers:", error);
    res.status(500).json({ message: "Server error" });
  }
};

