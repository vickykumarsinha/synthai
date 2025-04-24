import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv"

dotenv.config();    

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });

export const gptSearch = async (req, res) => {
    try {
      const { message } = req.body;
  
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }
    // GEMINI API
    //   const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    //   const chat = model.startChat(); 
    //   const result = await chat.sendMessage(message);
    //   const response = result.response.text();

    // PERPLEXITY API
    const response = await fetch("https://api.perplexity.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "pplx-7b-chat",  // or another available model
          messages: [{ role: "user", content: message }],
        })
      });
  
      if (!response.ok) {
        throw new Error(`Perplexity API Error: ${response.statusText}`);
      }
  
      const data = await response.json();
      const reply = data.choices[0]?.message?.content || "No response from AI";
  
      res.json({ response: reply });

  
    } catch (error) {
      console.error("Error in Gemini API:", error);
      res.status(500).json({ error: "Failed to communicate with Gemini AI" });
    }
};
