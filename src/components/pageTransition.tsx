"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import PageLoader from "./pageLoader";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const previousPath = useRef(pathname);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (previousPath.current !== pathname) {
      // route changed → start loading
      timer = setTimeout(() => {
        setIsLoading(true);
      }, 120); // delay prevents flicker

      previousPath.current = pathname;
    }

    return () => clearTimeout(timer);
  }, [pathname]);

  // stop loader after render commit
  useEffect(() => {
    if (isLoading) {
      const done = setTimeout(() => setIsLoading(false), 300);
      return () => clearTimeout(done);
    }
  }, [isLoading]);

  return (
    <>
      {isLoading && <PageLoader />}
      {children}
    </>
  );
}
