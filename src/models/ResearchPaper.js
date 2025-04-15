import mongoose from "mongoose";

const ResearchPaperSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    authors: [
      {
        name: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
        },
      },
    ],
    university: {
      type: String,
      required: false,
    },
    abstract: String,
    introduction: String,
    literature: String,
    methodology: String,
    results: String,
    conclusion: String,
    futurework: String,
    citation: String,
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
