"use client"

import { ReactNode, useEffect } from "react";
import { useCurrentUserContext } from "../contexts/currentUserContext";
import { usePathname, useRouter } from "next/navigation";
import PageLoader from "@/components/pageLoader";

const protectedRoutes = ['/lite']

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathName = usePathname()
  const { currentUser, userOnboarding, isFetching } = useCurrentUserContext();
  
  
  useEffect(() => {
    if(isFetching) return

    if(pathName.startsWith('/lite') || protectedRoutes.includes(pathName)){
        if (!currentUser) {
          router.push("/login");
          return
        }

       if (currentUser && userOnboarding) {
          router.push("/lite/map");
          return
          
        } else {
           router.push("/lite/start");
          return
        }
    }

   
  }, [isFetching, currentUser, router, userOnboarding]);

  return <>
    {isFetching ?
      <PageLoader /> :
      <div className="bg-primary">{children}</div>

    }</>

}