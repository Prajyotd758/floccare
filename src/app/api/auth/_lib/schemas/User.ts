import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  useremail: { type: String, required: true, unique: true },
  password: String,
});

export const User =
  mongoose.models.users || mongoose.model("users", userSchema);
