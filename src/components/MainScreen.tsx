"use client";
import SideBar from "../components/SideBar";
import { SessionProvider } from "next-auth/react";

export default function MainScreen({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="relative h-[100vh] w-[100vw] flex p-1 bg-black">
        <SideBar />
        {children}
      </div>
    </SessionProvider>
  );
}
