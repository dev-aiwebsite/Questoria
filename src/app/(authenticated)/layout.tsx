import { SessionProvider } from "next-auth/react";
import { CurrentUserProvider } from "../../contexts/currentUserContext";
import InstallPrompt from "@/components/popups/installPrompt";

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>
    <InstallPrompt />
        <SessionProvider>
            
                <CurrentUserProvider>
                    {children}
                </CurrentUserProvider>
            
        </SessionProvider>
    </>
}