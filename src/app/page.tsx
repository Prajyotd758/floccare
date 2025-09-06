"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import HomeScreen from "../components/HomeScreen";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const saveBlogs = async () => {
    try {
      const res = await fetch("/chat/blog", {
        method: "POST",
        body: JSON.stringify({
          userId: session?.user?.name,
          prompts: [],
          responses: [],
        }),
      });

      const data = await res.json();
      router.replace(`/chat/${data.data._id}`);
    } catch (error) {}
  };

  useEffect(() => {
    if (status === "authenticated") {
      saveBlogs();
      return;
    }
  }, [status, router]);

  if (status === "loading") {
    return null;
  }
  return <HomeScreen />;
}
