"use client"

import { ReactNode, useEffect } from "react";
import { useCurrentUserContext } from "../contexts/currentUserContext";
import { useRouter } from "next/navigation";

export default function Layout({children}:{children:ReactNode}) {
 const router = useRouter();
   const { currentUser, userOnboarding} = useCurrentUserContext();
  console.log(userOnboarding, 'userOnboarding')
  console.log(currentUser, 'currentUser')
   useEffect(() => {
      if(currentUser && !userOnboarding){
        router.push("/lite/start");
        return
      }

     if (currentUser) {
       router.push("/lite");
     }
   }, [currentUser, router]);
 
   // Show loading state while redirecting
   return <>{children}</>;
}