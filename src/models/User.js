// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,  // Ensures no duplicate emails
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // This will automatically add createdAt and updatedAt fields
);

const User = mongoose.model('User', UserSchema);

export default User;
