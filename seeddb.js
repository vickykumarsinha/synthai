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
        "_id": "67bab192ce86c164eb77ed3f",
        "user": "67bab192ce86c164eb77ed3f", 
        "title": "Machine Learning in Healthcare",
        "abstract": "This paper explores the impact of ML models in medical diagnosis.",
        "introduction": "Machine learning is transforming healthcare by enabling predictive analytics.",
        "methodology": "The study uses supervised learning models such as SVM and Random Forest.",
        "results": "The ML models achieved an accuracy of 92% in detecting diseases.",
        "references": "1. Nakamoto (2008), 2. Blockchain Research Journal (2022)",
        "status": "Completed",
        "lastEdited": "2024-02-28T10:30:00.123Z",
        "__v": 0
      },

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
