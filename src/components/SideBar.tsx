"use client";

import { useGSAP } from "@gsap/react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

export default function SideBar() {
  const [toggle, setToggle] = useState<boolean>(true);
  const [prompts, setPrompts] = useState<Array<any>>([]);

  const router = useRouter();
  const { data: session, status } = useSession();

  const fetchChats = async () => {
    try {
      const res = await fetch(`/chat/blog`, {
        headers: {
          Authorization: `User ${session?.user?.name}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      setPrompts(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(max-width: 768px)", () => {
      toggle
        ? gsap.to(".slider", {
            width: "50%",
            duration: 0.8,
          })
        : gsap.to(".slider", {
            width: "12%",
            duration: 0.8,
          });
    });

    mm.add("(min-width: 768px)", () => {
      toggle
        ? gsap.to(".slider", {
            width: "25%",
            duration: 0.8,
          })
        : gsap.to(".slider", {
            width: "5%",
            duration: 0.8,
          });
    });
  }, [toggle]);

  useEffect(() => {
    if (session?.user) {
      fetchChats();
    }
  }, [session, status]);

  return (
    <div
      className={`slider ${
        toggle ? "" : "max-md:bg-transparent"
      } max-lg:absolute max-md:w-[50%] z-10 w-[25%] h-full bg-gray-800 rounded-l-lg text-white`}
    >
      <div className="text-2xl font-extrabold p-2 ">
        <button
          className="bg-blue-400 w-full rounded-lg"
          onClick={() => setToggle(!toggle)}
        >{`${toggle ? "←" : "→"}`}</button>
      </div>
      {toggle ? (
        <div className="">
          <div className="py-1 px-2">
            <button
              onClick={() => router.push(`/`)}
              className="w-full rounded-lg p-2 transition-all duration-200 hover:bg-gray-600"
            >
              New Chat
            </button>
          </div>

          <div className="py-1 px-2">
            <div className="w-full flex flex-col gap-4 rounded-lg p-2 text-start">
              History
              <hr />
              {session?.user ? (
                prompts && (
                  <ul>
                    {prompts
                      .slice()
                      .reverse()
                      .map((value, index) => {
                        return (
                          <li
                            className="my-2 w-full rounded-lg py-2 px-3 transition-all duration-200 hover:bg-gray-600 truncate"
                            key={"hello world" + index}
                            onClick={() => router.push(`/chat/${value._id}`)}
                          >
                            {value.prompts[0]}
                          </li>
                        );
                      })}
                  </ul>
                )
              ) : (
                <button>Log in to view history</button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
