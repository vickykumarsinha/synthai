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
        "title": "Leveraging AI for Early Diagnosis in Healthcare",
        "authors": [
          {
            "name": "Emily Clark",
            "email": "emily.clark@medai.com"
          }
        ],
        "university": "Harvard Medical School",
        "abstract": "This paper explores AI-driven tools for early diagnosis of chronic illnesses.",
        "introduction": "Chronic diseases require early detection for effective treatment...",
        "literature": "Several AI models have been developed for diagnostic accuracy...",
        "methodology": "We analyzed 500 patient records using a neural network model...",
        "results": "The AI model identified symptoms with 87% accuracy...",
        "conclusion": "AI has the potential to revolutionize preventative healthcare...",
        "futurework": "Integrate AI tools with wearable health devices...",
        "citation": "Clark, E. (2025). Leveraging AI for Early Diagnosis in Healthcare.",
        "status": "Draft",
        "lastEdited": "2025-04-08T13:45:00.000Z",
        "createdAt": "2025-04-07T15:30:00.000Z",
        "updatedAt": "2025-04-08T13:45:00.000Z"
      },
      {
        "title": "Using AI to Combat Climate Change",
        "authors": [
          {
            "name": "Raj Patel",
            "email": "raj.patel@climateai.org"
          },
          {
            "name": "Linda Gomez",
            "email": "linda.gomez@climateai.org"
          }
        ],
        "university": "MIT",
        "abstract": "AI can help monitor and mitigate the effects of climate change...",
        "introduction": "Climate change is one of the biggest threats facing humanity...",
        "literature": "AI applications in environmental science have increased recently...",
        "methodology": "We implemented a prediction model using satellite data...",
        "results": "The model accurately forecasted temperature trends over 5 years...",
        "conclusion": "AI enables proactive climate action through data modeling...",
        "futurework": "Develop AI tools for carbon capture optimization...",
        "citation": "Patel, R., & Gomez, L. (2025). Using AI to Combat Climate Change.",
        "status": "Completed",
        "lastEdited": "2025-04-08T13:50:00.000Z",
        "createdAt": "2025-04-06T10:00:00.000Z",
        "updatedAt": "2025-04-08T13:50:00.000Z"
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
