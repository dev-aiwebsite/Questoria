"use client";

import PageLoader from "@/components/pageLoader";
import NextLink from "next/link";
import type { LinkProps } from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import React, { createContext, useContext, useState, useEffect, SetStateAction, ReactNode } from "react";
import { useAppData } from "./appDataContext";

type AppRouterContextType = {
  isRouting: boolean;
  setIsRouting: React.Dispatch<SetStateAction<boolean>>;
  push: (href: string) => void;
};

type Props = LinkProps & {
  className?:string;
  children: ReactNode;
};


const AppRouterContext = createContext<AppRouterContextType | undefined>(undefined);

export function AppRouterProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const {imagesLoaded} = useAppData()
  
  const [isRouting, setIsRouting] = useState(false);

  useEffect(() => {
    if(!imagesLoaded){
      queueMicrotask(()=> setIsRouting(true))
      return
    }
    queueMicrotask(()=> setIsRouting(false))
  }, [pathname, searchParams, imagesLoaded]);


  function push(href: string) {
    if (href !== pathname) {
        setIsRouting(true);
        router.push(href);
    }
  }

  return (
    <AppRouterContext.Provider value={{ isRouting, setIsRouting, push }}>
      {isRouting && <PageLoader />}
      {children}
    </AppRouterContext.Provider>
  );
}

// 4. Renamed hook as requested
export function useAppRouter() {
  const context = useContext(AppRouterContext);
  if (!context) {
    throw new Error("useAppRouter must be used inside AppRouterProvider");
  }
  return context;
}

export function Link({ children, ...props }: Props) {
const {setIsRouting} = useAppRouter()
return <NextLink
onClick={() => setIsRouting(true)}
 {...props} >{children}</NextLink>

}
