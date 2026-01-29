import { SessionProvider } from "next-auth/react";
import { CurrentUserProvider } from "../../contexts/currentUserContext";

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>
        <SessionProvider>
            
                <CurrentUserProvider>
                    {children}
                </CurrentUserProvider>
            
        </SessionProvider>
    </>
}