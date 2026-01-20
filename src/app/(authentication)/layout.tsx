"use client"

import PageLoader from "@/components/pageLoader";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useCurrentUserContext } from "../contexts/currentUserContext";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { currentUser, userOnboarding, isFetching } = useCurrentUserContext();

  console.log(isFetching, 'isFetching from layout')
  useEffect(() => {
    
        if(!currentUser){
          return
        }
      
        if (currentUser && !userOnboarding) {
          router.push("/lite/start");
          return
        }

       if (currentUser && userOnboarding) {
          router.push("/lite/map");
          return
        } 

   
  }, [currentUser]);

  return <>
    {isFetching ?
      <PageLoader /> :
      <div className="bg-primary">{children}</div>

    }</>

}