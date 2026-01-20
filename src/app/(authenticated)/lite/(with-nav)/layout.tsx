import MobileNavLite from "@/components/nav/mobileNavLite";
import { ReactNode } from "react";

export default function Layout({children}:{children:ReactNode}) {
    return (
        <div className="flex flex-col flex-nowrap h-screen max-h-screen max-screen max-w-screen overflow-hidden">
            <div className="flex-1">
                {children}
            </div>
            <MobileNavLite />
        </div>
    );
}