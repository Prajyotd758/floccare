import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  userId: { type: String, required: true, ref: "user" },
  prompts: [String],
  responses: [String],
});

export const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);
