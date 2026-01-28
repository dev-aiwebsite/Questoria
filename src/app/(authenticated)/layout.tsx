import { SessionProvider } from "next-auth/react";
import { AppDataProvider } from "../../contexts/appDataContext";
import { CurrentUserProvider } from "../../contexts/currentUserContext";

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>
        <SessionProvider>
            <AppDataProvider>
                <CurrentUserProvider>
                    {children}
                </CurrentUserProvider>
            </AppDataProvider>
        </SessionProvider>
    </>
}