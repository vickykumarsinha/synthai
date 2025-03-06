import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to test Gemini API
const testGemini = async () => {
  try {
    // Get the correct model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Send a test query
    const result = await model.generateContent(["Hello, how are you?"]);
    const response = await result.response.text(); // Extract text response

    console.log("Gemini Response:", response);

  } catch (error) {
    console.error("Error in Gemini API:", error);
  }
};

testGemini();
