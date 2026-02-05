"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader
} from "../shadcn/ui/alert-dialog";

import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";
import { Ellipsis, SquarePlus } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { IconIosShare, LongArrowDown } from "@/lib/icons/icons";
import { cn } from "@/lib/helper";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

declare global {
  interface Window {
    MSStream?: unknown;
  }
}
export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    queueMicrotask(()=> {
        const nextPromptDate = localStorage.getItem("questoria-install-prompt");
    let isNeedToPrompt = false;

    if (nextPromptDate) {
      isNeedToPrompt = Date.now() > +nextPromptDate;
    } else {
      isNeedToPrompt = true;
    }

    console.log(isNeedToPrompt, nextPromptDate, 'install prompt')
    if (!isNeedToPrompt) return;

    const nextPromptMs = Date.now() + 5 * 60 * 60 * 1000; // 5 hours later
    localStorage.setItem(
      "questoria-install-prompt",
      String(nextPromptMs)
    );

    const userAgent = navigator.userAgent
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
   

    const  isBrowserIOSChrome =  userAgent.match(/CriOS/)
     const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(userAgent) && !isBrowserIOSChrome;

    setIsIOS(isIOSDevice);
    setIsSafari(isSafariBrowser);
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

  
    // If Safari (iOS or macOS), show custom install popup
    if (isSafariBrowser || isIOSDevice) {
      setOpen(true);
    }

      const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setOpen(true);
    };
    
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
    })
    
    
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setOpen(false);
  };

  if (isStandalone) {
    return null;
  }


  const handleCancel = () => {
    const nextPromptMs = Date.now() + 5 * 60 * 60 * 1000; // 5 hours later
    localStorage.setItem(
      "questoria-install-prompt",
      String(nextPromptMs)
    );
    setOpen(false)
  }

  
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="sm:max-w-sm space-y-4 rounded-xl z-[99999999]"
      overlayClassName="bg-black/90 z-[9999999]">
        <AlertDialogHeader>
          <Image
          className="ios-app-icon !mt-[-60px]"
          src="/icons/icon-512x512.png"
          width={80}
          height={80}
          alt="elevate app"
          />
          <AlertDialogTitle className="text-center">
            <span>Install Questoria</span>
            </AlertDialogTitle>
        </AlertDialogHeader>

          <div className="mt-2 text-foreground">
            {isIOS && isSafari && (
              <div className="leading-[2] text-start text-lg">
                <ol className="space-y-3">
                  <li className="items-start flex flex-row flex-nowrap gap-2">
                    <div className="mt-2 text-white aspect-square h-8 text-lg font-medium place-content-center-safe grid rounded-full bg-app-purple-300">
                      1
                    </div>
                    <span>
                      Tap 
                      <span className="text-base px-2 py-1 shadow-sm shadow-black/30 rounded-md inline-flex items-center gap-2 mx-4" >
                        <Ellipsis className="inline"/>
                      </span>
                      in the toolbar.
                    </span>
                  </li>
                  <li className="items-start flex flex-row flex-nowrap gap-2">
                    <div className="mt-2 text-white aspect-square h-8 text-lg font-medium place-content-center-safe grid rounded-full bg-app-purple-300">
                      2
                    </div>
                    <span>
                      Tap 
                      <span className="text-base px-2 py-1 pr-3 shadow-sm shadow-black/30 rounded-md inline-flex items-center gap-2 mx-4" >
                      <IconIosShare height={26} width={26} className="inline" /> Share
                      </span>
                      in the Menu.
                    </span>
                  </li>
                  <li className="items-start flex flex-row flex-nowrap gap-2">
                    <div className="mt-2 text-white aspect-square h-8 text-lg font-medium place-content-center-safe grid rounded-full bg-app-purple-300">
                      3
                    </div>
                    <span>
                      Tap 
                      <span className="text-base px-2 py-1 pr-4 shadow-sm shadow-black/30 rounded-md inline-flex items-center gap-2 mx-4" >
                      <Ellipsis className="p-1 bg-gray-200 rounded-full inline"/> More
                      </span>
                    </span>
                  </li>
                  <li className="items-start flex flex-row flex-nowrap gap-2">
                    <div className="mt-2 text-white aspect-square h-8 text-lg font-medium place-content-center-safe grid rounded-full bg-app-purple-300">
                      4
                    </div>
                    <span>
                      Select 
                      <span className="text-base px-2 py-1 pr-4 shadow-sm shadow-black/30 rounded-md inline-flex items-center gap-2 mx-4" >
                      <SquarePlus className="inline" strokeWidth={1}/> Add to Home Screen
                      </span>
                      from the Menu.
                    </span>
                  </li>
                </ol>
                <p className="mt-6 text-base">An icon will be added to your home screen so you can quickly access the app</p>
              </div>
            )}
            
            {isIOS && !isSafari && (
              <div className="leading-[2] text-start text-lg">
                <ol className="space-y-3">
                  <li className="items-start flex flex-row flex-nowrap gap-2">
                    <div className="mt-2 text-white aspect-square h-8 text-lg font-medium place-content-center-safe grid rounded-full bg-app-purple-300">
                      1
                    </div>
                    <span>
                      Tap the
                      <span className="text-base px-2 py-1 pr-3 shadow-sm shadow-black/30 rounded-md inline-flex items-center gap-2 mx-4" >
                      <IconIosShare height={26} width={26} className="inline" />
                      </span>
                      in the upper right corner.
                    </span>
                  </li>
                  <li className="items-start flex flex-row flex-nowrap gap-2">
                    <div className="mt-2 text-white aspect-square h-8 text-lg font-medium place-content-center-safe grid rounded-full bg-app-purple-300">
                      2
                    </div>
                    <span>
                      Tap 
                      <span className="text-base px-2 py-1 pr-4 shadow-sm shadow-black/30 rounded-md inline-flex items-center gap-2 mx-4" >
                      <Ellipsis className="p-1 bg-gray-200 rounded-full inline"/> More
                      </span>
                    </span>
                  </li>
                  <li className="items-start flex flex-row flex-nowrap gap-2">
                    <div className="mt-2 text-white aspect-square h-8 text-lg font-medium place-content-center-safe grid rounded-full bg-app-purple-300">
                      3
                    </div>
                    <span>
                      Select 
                      <span className="text-base px-2 py-1 pr-4 shadow-sm shadow-black/30 rounded-md inline-flex items-center gap-2 mx-4" >
                      <SquarePlus className="inline" strokeWidth={1}/> Add to Home Screen
                      </span>
                      from the Menu.
                    </span>
                  </li>
                </ol>
                <p className="mt-6 text-base">An icon will be added to your home screen so you can quickly access the app</p>
              </div>
            )}

            {!isIOS && (
              "Install this app to your device for a better experience."
            )}
          </div>

        <AlertDialogFooter className="flex justify-end gap-2">
          <AlertDialogCancel onClick={handleCancel}>
            Return
          </AlertDialogCancel>
          {!isIOS && deferredPrompt && (
            <AlertDialogAction onClick={handleInstallClick}>
              Add to Home Screen
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>

      {open && isIOS && !deferredPrompt &&
        <LongArrowDown className={cn("iphone install-app-arrow text-blue-500", isSafari ? 'safari' : 'chrome')} />
      }
    </AlertDialog>
  );
}