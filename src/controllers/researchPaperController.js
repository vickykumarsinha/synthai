import ResearchPaper from "../models/ResearchPaper.js";
import User from "../models/User.js";



// export const addResearchPaper = async (req, res) => {
//     try {
//       const userId = req.params.id;
//       const { title, abstract, introduction, methodology, results, references } = req.body;
  
//       // Check if user exists
//       const user = await User.findById(userId);
//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }
  
//       // Create new research paper
//       const newPaper = new ResearchPaper({
//         user: userId,
//         title,
//         abstract,
//         introduction,
//         methodology,
//         results,
//         references,
//       });
  
//       // Save paper to DB
//       const savedPaper = await newPaper.save();
  
//       // Add paper to user's papers list
//       user.papers.push(savedPaper._id);
//       await user.save(); // Save updated user document
  
//       res.status(201).json(savedPaper);
//     } catch (error) {
//       console.error("Error creating research paper:", error);
//       res.status(500).json({ message: "Server error" });
//     }
// };

export const addResearchPaper = async (req, res) => {
  try {
    const { userId, title, section, content } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user already has a research paper
    let paper = await ResearchPaper.findOne({ user: userId });

    if (!paper) {
      // Create new paper if it doesn't exist
      paper = new ResearchPaper({
        user: userId,
        title,
        sections: { [section]: content }, // Save section content
      });
    } else {
      // Update the existing paper's section
      paper.sections[section] = content;
    }

    // Save paper
    const savedPaper = await paper.save();
    res.status(201).json(savedPaper);
  } catch (error) {
    console.error("Error saving research paper:", error);
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

