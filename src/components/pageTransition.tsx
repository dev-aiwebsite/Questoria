"use client";

import { useNavigation } from "next/navigation";
import { useEffect, useState } from "react";
import PageLoader from "./pageLoader";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (navigation.state === "loading") {
      timer = setTimeout(() => setIsLoading(true), 120); // delay to prevent flicker
    } else {
      setIsLoading(false);
    }

    return () => clearTimeout(timer);
  }, [navigation.state]);

  return (
    <>
      {isLoading && <PageLoader />}
      {children}
    </>
  );
}
