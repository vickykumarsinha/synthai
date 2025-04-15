import ResearchPaper from "../models/ResearchPaper.js";
import User from "../models/User.js";

// CREATE NEW PAPER
export const addResearchPaper = async (req, res) => {
  const { title, content, authorDetails, university, userId } = req.body;
  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  try {
    let paper = await ResearchPaper.findOne({ userId });

    if (paper) {
      // Update existing paper
      paper.title = title;
      paper.content = content;
      paper.authorDetails = authorDetails;
      paper.university = university;
      await paper.save();
      return res.status(200).json({ message: "Paper updated successfully!", _id: paper._id });
    } else {
      // Create new paper
      paper = new ResearchPaper({ userId, title, content, authorDetails, university });
      await paper.save();
      return res.status(201).json({ message: "Paper saved successfully!", _id: paper._id });
    }
  } catch (error) {
    console.error("Error saving research paper:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// EDIT PAPER
export const saveChanges = async (req, res) => {
  const { title, content, authorDetails, university } = req.body;
  const userId = req.params.id;
  const paperId = req.params.paperId;

  try {
    const user = await User.findById(userId);

    const hasPaper = user.papers.some(p => p.toString() === paperId);
    if (!hasPaper) {
      user.papers.push(paperId);
      await user.save();
      return res.status(403).json({ message: "Paper does not belong to this user" });
    }

    const paper = await ResearchPaper.findOne({ _id: paperId });
    if (!paper) {
      return res.status(404).json({ message: "Paper not found" });
    }

    if (paper.title !== title) {
      paper.title = title;
    }

    if (JSON.stringify(paper.authorDetails) !== JSON.stringify(authorDetails)) {
      paper.authorDetails = authorDetails;
    }

    if (paper.university !== university) {
      paper.university = university;
    }

    paper.lastEdited = Date.now();
    await paper.save();
    return res.status(200).json({ message: "Paper updated successfully!", _id: paper._id });

  } catch (error) {
    console.error("Error saving research paper:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ALL PAPERS OF USER
export const getUserPapers = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate("papers");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.papers || user.papers.length === 0) {
      return res.status(404).json({ message: "No research papers found." });
    }

    res.status(200).json(user.papers);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET SPECIFIC PAPER
export const getPaper = async (req, res) => {
  try {
    const userId = req.params.id;
    const paperId = req.params.paperId;

    // Check if user exists
    const user = await User.findById(userId);

    const hasPaper = user.papers.some(paper => paper.toString() === paperId);
    if (!hasPaper) {
      return res.status(403).json({ message: "This paper does not belong to the user" });
    }

    // Check if the paper exists and belongs to the user
    const paper = await ResearchPaper.findOne({ _id: paperId });
    if (!paper) {
      return res.status(404).json({ message: "Paper not found or does not belong to this user" });
    }

    res.status(200).json(paper);
  } catch (error) {
    console.error("Error getting paper:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE PAPER
export const deletePaper = async (req, res) => {
  try {
    const { id, paperId } = req.params;

    // Remove the paper reference from the user's papers list
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if the paper exists in user's papers list
    const paperIndex = user.papers.indexOf(paperId);
    if (paperIndex === -1) {
      return res.status(404).json({ message: 'Paper not found in user papers' });
    }

    user.papers.splice(paperIndex, 1); // Remove paperId from user's papers list
    await user.save();

    // Delete the paper from ResearchPaper collection
    await ResearchPaper.findByIdAndDelete(paperId);

    res.status(200).json({ message: 'Paper deleted successfully' });
  } catch (error) {
    console.error('Error deleting paper:', error);
    res.status(500).json({ message: 'Server error' });
  }
};