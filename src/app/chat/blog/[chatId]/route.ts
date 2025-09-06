import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Blog } from "../Blogs";

await mongoose.connect(`${process.env.databaseURL}`);

export async function GET(
  req: Request,
  { params }: { params: Promise<{ chatId: string }> }
) {
  const authHeader = req.headers.get("Authorization");
  const { chatId } = await params;

  const userId = authHeader?.split(" ")[1];

  try {
    const res = await Blog.findById(chatId);

    if (res) {
      return NextResponse.json({ message: "chat found", data: res });
    } else {
      return NextResponse.json({ message: "No chat found" });
    }
  } catch (error) {
    return NextResponse.json({ message: "Error occured" });
  }
}
