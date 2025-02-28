import mongoose from "mongoose";

const ResearchPaperSchema = new mongoose.Schema(
  {   
    title: {
      type: String,
      required: true,
    },
    abstract: {
      type: String,
    },
    introduction: {
      type: String,
    },
    methodology: {
      type: String,
    },
    results: {
      type: String,
    },
    references: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Draft", "In Progress", "Completed"],
      default: "Draft",
    },
    lastEdited: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const ResearchPaper = mongoose.model("ResearchPaper", ResearchPaperSchema);
export default ResearchPaper;
