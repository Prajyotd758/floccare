"use client";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import gsap from "gsap";
import axios from "axios";
import { signOut } from "next-auth/react";
import ResponseBox from "./ResponseBox";
import { LoginForm } from "./LoginForm";
import ResponseBoxList from "./ResponseBoxList";

export default function HomeScreen({ chatId }: { chatId?: string }) {
  const [firstPrompt, setfirstPrompt] = useState<boolean>(true);
  const [prompt, setPrompt] = useState<string>("");
  const [ScrollIn, SetScrollIn] = useState<String>("");
  const [toggle, SetToggle] = useState<boolean>(true);
  const mm = gsap.matchMedia();

  const fetchedListLength = useRef<number>(0);

  const { data: session, status } = useSession();

  const [prompts, setPrompts] = useState<Array<string>>([]);
  const [responses, setResponses] = useState<Array<string>>([]);

  const fetchChats = async () => {
    try {
      const res = await fetch(`/chat/blog/${chatId}`, {
        headers: {
          Authorization: `User ${session?.user?.name}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      fetchedListLength.current = data.data.prompts.length;
      setPrompts(data.data.prompts);
      setResponses(data.data.responses);

      if (data.data.prompts.length > 0) {
        mm.add("(max-width: 768px)", () => {
          gsap.to(".inputBox", {
            top: "90%",
            duration: 0.8,
            stagger: 0.2,
            onComplete: () => {
              setfirstPrompt(false);
            },
          });
        });
        mm.add("(min-width: 768px)", () => {
          gsap.to(".inputBox", {
            top: 600,
            duration: 0.8,
            stagger: 0.2,
            onComplete: () => {
              setfirstPrompt(false);
            },
          });
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchChats();
    }
  }, [session, status]);

  const saveBlogs = async (
    prompts: Array<string>,
    responses: Array<string>
  ) => {
    try {
      const res = await axios.put("/chat/blog", {
        chatId,
        userId: session?.user?.name,
        prompts,
        responses,
      });
      const data = await res.data;
    } catch (error) {}
  };

  const Generate = async (e: any) => {
    e.preventDefault();

    if (!prompt || prompt === "") {
      alert("please enter prompt");
      return;
    }

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization:
              "Bearer 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",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "meta-llama/llama-3.3-8b-instruct:free",
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
          }),
        }
      );
      const data = await response.json();

      if (session?.user) {
        const newPrompts = [...prompts, prompt];
        const newResponses = [...responses, data.choices?.[0]?.message.content];
        await saveBlogs(newPrompts, newResponses);
      }

      setPrompts((prev) => [...prev, prompt]);
      setResponses((prev) => [...prev, data.choices?.[0]?.message.content]);

      if (firstPrompt) {
        mm.add("(max-width: 768px)", () => {
          gsap.to(".inputBox", {
            top: "90%",
            duration: 0.8,
            stagger: 0.2,
            onComplete: () => {
              setfirstPrompt(false);
            },
          });
        });
        mm.add("(min-width: 768px)", () => {
          gsap.to(".inputBox", {
            top: 600,
            duration: 0.8,
            stagger: 0.2,
            onComplete: () => {
              setfirstPrompt(false);
            },
          });
        });
      }
      setPrompt("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`bg-gray-700 flex justify-center items-center rounded-r-lg w-full h-[100%] overflow-y-auto overflow-x-hidden`}
    >
      {!session?.user ? (
        <button
          onClick={() => {
            toggle
              ? window.innerWidth > 800
                ? SetScrollIn("animate")
                : SetScrollIn("animate-mobile")
              : window.innerWidth > 800 ? SetScrollIn("animate-out") : SetScrollIn("animate-out-mobile");

            SetToggle(!toggle);
          }}
          className="absolute bg-white top-4 rounded-lg py-2 px-5 shadow-2xl right-5 cursor-pointer"
        >
          Log IN
        </button>
      ) : (
        <button
          onClick={async () => {
            await signOut({ redirect: false });

            document.cookie =
              "next-auth.session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie =
              "__Secure-next-auth.session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          }}
          className="absolute bg-white top-4 rounded-lg py-2 px-5 shadow-2xl right-5 cursor-pointer"
        >
          Log OUT
        </button>
      )}
      <div
        className={`inputBox absolute w-3xl max-lg:w-2xl max-md:w-[90%] ${
          firstPrompt ? "" : "top-[80%]"
        } bg-white rounded-4xl flex p-2 shadow-xl`}
      >
        <input
          className="bg-white text-center rounded-3xl focus:border-none focus:outline-none p-3 w-[90%]"
          type="text"
          placeholder="Enter prompt to generate blog"
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
          name="prompt"
          required
        />

        <button
          type="submit"
          className="bg-blue-400 text-white text-3xl font-extrabold rounded-full w-[10%]"
          onClick={(e) => Generate(e)}
        >
          ↑
        </button>
      </div>

      <LoginForm scrollin={ScrollIn} />

      <div className="w-3xl max-lg:w-2xl max-md:w-[90%] max-sm:mb-0 mb-18 h-[80%] rounded-2xl overflow-y-auto">
        {prompts &&
          prompts.length > 0 &&
          prompts.map((value, index) => {
            return (
              <div key={value + index}>
                {prompts.length === responses.length &&
                fetchedListLength.current <= index ? (
                  <ResponseBox
                    text={responses[index]}
                    prompt={value}
                    addResponse={setResponses}
                  />
                ) : (
                  <ResponseBoxList text={responses[index]} prompt={value} />
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
