import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./src/routes/auth.js";
import userRoutes from "./src/routes/userRoutes.js";
import gptRoutes from "./src/routes/gptRoutes.js";



const app = express();
dotenv.config();
app.use(bodyParser.json());

// Middleware
app.use(express.json());
app.use(
  cors({
    origin:  ["http://localhost:5173", "https://synthai-lac.vercel.app"], 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, 
  })
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api", gptRoutes);

const PORT = process.env.PORT ;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
