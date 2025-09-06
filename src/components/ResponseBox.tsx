"use client";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
export default function ResponseBox({
  text,
  prompt,
  addResponse,
}: {
  prompt: string;
  text: string;
  addResponse: Dispatch<SetStateAction<Array<string>>>;
}) {
  const [response, setResponse] = useState<string>("");

  useEffect(() => {
    if (!text) return;
    let i = 0;
    const interval = setInterval(() => {
      setResponse((prev) => prev + text[i]);
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 5);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <div className="w-full flex flex-col items-end">
      <div className="bg-gray-800 rounded-4xl w-fit text-white text-1xl text-end px-8 py-2.5">
        {prompt}
      </div>
      <div className="text-white my-2 p-6 overflow-auto rounded-2xl">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{response}</ReactMarkdown>
      </div>
    </div>
  );
}
