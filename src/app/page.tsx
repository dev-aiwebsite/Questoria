
"use client"

import { useCurrentUserContext } from "@/app/contexts/currentUserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { currentUser } = useCurrentUserContext();

  useEffect(() => {
    if (currentUser) {
      router.push("/lite");
    } else {
      router.push("/login");
    }
  }, [currentUser, router]);

  // Show loading state while redirecting
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div>Loading...</div>
    </div>
  );
}
