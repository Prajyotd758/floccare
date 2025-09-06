"use client";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
export default function ResponseBoxList({
  text,
  prompt,
}: {
  prompt: string;
  text: string;
}) {
  return (
    <div className="w-full flex flex-col items-end">
      <div className="bg-gray-800 rounded-4xl w-fit text-white text-1xl text-end px-8 py-2.5">
        {prompt}
      </div>
      <div className="text-white my-2 p-6 overflow-auto rounded-2xl">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
      </div>
    </div>
  );
}
