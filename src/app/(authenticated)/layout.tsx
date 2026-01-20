"use client"

import { ReactNode, useEffect } from "react";
import { useCurrentUserContext } from "../contexts/currentUserContext";
import { useRouter } from "next/navigation";

export default function Layout({children}:{children:ReactNode}) {
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
   return <>{children}</>;
}