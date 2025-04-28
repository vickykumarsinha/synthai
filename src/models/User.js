import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    papers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ResearchPaper",
        default: [],
      },
    ],
    university: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    coauthors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
