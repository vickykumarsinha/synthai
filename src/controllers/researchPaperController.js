import ResearchPaper from "../models/ResearchPaper.js";
import User from "../models/User.js";


// CREATE NEW PAPER
export const createEmptyPaper = async (req, res) => {
  const userId = req.params.id;
  const { authors } = req.body;

  try {
    const paper = new ResearchPaper({
      title: "Enter your title here",
      authors: authors || [],
      university: "",
      abstract: "",
      introduction: "",
      literature: "",
      methodology: "",
      results: "",
      conclusion: "",
      futurework: "",
      citation: "",
      status: "Draft",
      lastEdited: Date.now(),
    });

    await paper.save();

    await User.findByIdAndUpdate(userId, { $push: { papers: paper._id } });

    res.status(201).json({ message: "Empty paper created", _id: paper._id });
  }
  catch (error) {
    console.error("Error creating research paper:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// EDIT PAPER
export const saveChanges = async (req, res) => {
  const {
    title,
    authors,
    university,
    abstract,
    introduction,
    literature,
    methodology,
    results,
    conclusion,
    futurework,
    citation,
  } = req.body;

  const userId = req.params.id;
  const paperId = req.params.paperId;
  
  try {
    const mainUser = await User.findById(userId);
    
    const hasPaper = mainUser.papers.some(p => p.toString() === paperId);
    if (!hasPaper) {
      mainUser.papers.push(paperId);
      await mainUser.save();
      return res.status(403).json({ message: "Paper does not belong to this user" });
    }

    const paper = await ResearchPaper.findOne({ _id: paperId });
    if (!paper) {
      return res.status(404).json({ message: "Paper not found" });
    }
    const authorsChanged = JSON.stringify(paper.authors) !== JSON.stringify(authors);
    if (authorsChanged){
      paper.authors = authors;

      if(authors && authors.length > 0) {
        await Promise.all(authors.map(async (author) => {
          const authorUser = await User.findOne({ email: author.email });
          if (authorUser) {
              if (!authorUser.papers.includes(paper._id)) {
                authorUser.papers.push(paper._id);
                await authorUser.save();
              }
          }
        }));
        const otherCoAuthorIDs = [];
        for (const author of authors) {
          
          const authorUser = await User.findOne({ email: author.email });
          if (authorUser && authorUser._id.toString() !== userId) {
            otherCoAuthorIDs.push(authorUser._id);
          }
        }
        const existingIds = new Set(mainUser.coauthors.map(id => id.toString()));
        const newIds = otherCoAuthorIDs.filter(id => !existingIds.has(id.toString()));
        if (newIds.length > 0) {
          mainUser.coauthors.push(...newIds);
          await mainUser.save();
        }
    }} 
    
    if (paper.title !== title) paper.title = title;
    if (paper.university !== university) paper.university = university;
    if (paper.abstract !== abstract) paper.abstract = abstract;
    if (paper.introduction !== introduction) paper.introduction = introduction;
    if (paper.literature !== literature) paper.literature = literature;
    if (paper.methodology !== methodology) paper.methodology = methodology;
    if (paper.results !== results) paper.results = results;
    if (paper.conclusion !== conclusion) paper.conclusion = conclusion;
    if (paper.futurework !== futurework) paper.futurework = futurework;
    if (paper.citation !== citation) paper.citation = citation;

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

    console.log("User papers:", user.papers);

    if (!user.papers || user.papers.length === 0) {
      return res.status(200).json({ message: "No research papers found.", papers: [] });
    }

    res.status(200).json( user.papers);

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

// Remove Authors from Paper  
export const removeAuthor = async (req, res) => {
  const {removedEmail} = req.body;
  const userId = req.params.id;
  const paperId = req.params.paperId;
  console.log("Removing author:", removedEmail);
  try{
    const mainPaper = await ResearchPaper.findById(paperId);
    if (!mainPaper) {
      return res.status(404).json({ message: "Paper not found" });
    }
    // Delete author from paper
    mainPaper.authors = mainPaper.authors.filter(a => a.email !== removedEmail);
    await mainPaper.save();
    
    // Remove paperId from the removed author's papers list
    const removedAuthor = await User.findOne({ email: removedEmail });
    if (removedAuthor) {
      removedAuthor.papers = removedAuthor.papers.filter(p => p.toString() !== paperId);
      await removedAuthor.save();
    }
    const mainUser = await User.findById(userId);
    mainUser.coauthors = mainUser.coauthors.filter(coauthor => coauthor.toString() !== removedAuthor._id.toString());
    await mainUser.save();
    res.status(200).json({ message: "Author removed" });
  }catch (error) {
    console.error("Error removing author:", error);
    res.status(500).json({ message: "Server error" });
  }
}