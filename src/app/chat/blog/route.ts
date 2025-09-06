import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Blog } from "./Blogs";

await mongoose.connect(`${process.env.databaseURL}`);

export async function GET(req: Request) {
  const authHeader = req.headers.get("Authorization");

  const user = authHeader?.split(" ")[1];

  try {
    const res = await Blog.find({ userId: user });

    if (res) {
      return NextResponse.json({ message: "chats found", data: res });
    } else {
      return NextResponse.json({ message: "No chats found" });
    }
  } catch (error) {
    return NextResponse.json({ message: "No chats found" });
  }
}

export async function POST(req: Request) {
  const data = await req.json();

  try {
    const res = await Blog.create({
      ...data,
      prompts: [],
      responses: [],
    });

    if (res) {
      return NextResponse.json({ message: "Blog saved", data: res });
    } else {
      return NextResponse.json({
        message: "Error saving blog, dont worry server is running!",
      });
    }
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      message: "Some serious error ocurred!, not my fault!",
    });
  }
}

export async function PUT(req: Request) {
  const data = await req.json();

  try {
    const res = await Blog.findByIdAndUpdate(data.chatId, {
      $set: {
        prompts: data.prompts,
        responses: data.responses,
      },
    });

    if (res) {
      return NextResponse.json({ message: "Blog saved", data: res });
    } else {
      return NextResponse.json({
        message: "Error saving blog, dont worry server is running!",
      });
    }
  } catch (error) {
    return NextResponse.json({
      message: "Some serious error ocurred!, not my fault!",
    });
  }
}
