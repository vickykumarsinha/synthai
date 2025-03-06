import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/User.js";
import ResearchPaper from "./src/models/ResearchPaper.js";

dotenv.config();
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const seedDatabase = async () => {
  try {
    const papers = [
      {
        "title": "Hydrogen Fuel Cells: A Sustainable Energy Solution",
        "abstract": "This study explores the principles, applications, and challenges of hydrogen fuel cells as an alternative energy source.",
        "introduction": "The growing demand for clean energy has led to increased interest in hydrogen fuel cells, which offer high efficiency and minimal emissions.",
        "literature": "Several studies have explored hydrogen fuel cell efficiency, with recent advancements improving cost-effectiveness and sustainability.",
        "methodology": "A comparative analysis of existing fuel cell technologies and experimental testing of hydrogen storage methods.",
        "results": "The study found that proton-exchange membrane fuel cells (PEMFC) offer the best efficiency for commercial applications.",
        "conclusion": "Hydrogen fuel cells hold great promise for the future of energy, but further research is needed to overcome storage and cost challenges.",
        "futurework": "Future studies should focus on improving hydrogen production methods and reducing the cost of fuel cell components.",
        "citation": "Doe, J. (2024). Advances in Hydrogen Fuel Cell Technology. Renewable Energy Journal, 12(3), 45-60.",
        "status": "In Progress",
        "lastEdited": "2025-02-28T12:34:56.789Z"
      },
      {
        "title": "Artificial Intelligence in Healthcare: Transforming Patient Care",
        "abstract": "This research paper examines the role of artificial intelligence (AI) in improving diagnostics, treatment plans, and patient management.",
        "introduction": "AI is revolutionizing healthcare by enabling predictive analytics, personalized medicine, and automated diagnostics.",
        "literature": "Prior research indicates that AI-powered diagnostics can outperform human radiologists in detecting certain diseases.",
        "methodology": "A systematic review of AI applications in healthcare, including case studies of machine learning models.",
        "results": "AI-driven diagnostic tools reduced misdiagnosis rates by 30% and improved patient outcomes.",
        "conclusion": "AI has the potential to enhance healthcare services, but ethical considerations and data privacy concerns must be addressed.",
        "futurework": "Further research should focus on AI explainability, bias reduction, and integration into clinical workflows.",
        "citation": "Smith, A. (2023). The Future of AI in Medicine. Journal of Healthcare Innovations, 18(4), 78-95.",
        "status": "Completed",
        "lastEdited": "2025-02-27T09:15:30.567Z"
      },
      {
        "title": "Blockchain for Secure Online Transactions",
        "abstract": "This study explores how blockchain technology enhances security and transparency in financial transactions.",
        "introduction": "Blockchain provides a decentralized approach to online transactions, reducing fraud and improving efficiency.",
        "literature": "Studies have shown that blockchain significantly enhances trust in digital payments by eliminating intermediaries.",
        "methodology": "A case study analysis of blockchain implementations in banking and e-commerce.",
        "results": "Blockchain-based systems improved transaction speed by 50% and reduced fraud cases.",
        "conclusion": "Blockchain offers a promising future for secure digital transactions, but scalability remains a challenge.",
        "futurework": "Future research should address the scalability of blockchain networks and regulatory compliance.",
        "citation": "Lee, K. (2024). Blockchain and Financial Security. Digital Transactions Review, 10(2), 34-50.",
        "status": "Draft",
        "lastEdited": "2025-02-26T15:48:22.123Z"
      }
    ];
    

    await ResearchPaper.insertMany(papers);

    console.log("Database seeded successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding database:", error);
    mongoose.connection.close();
  }
};

seedDatabase();
