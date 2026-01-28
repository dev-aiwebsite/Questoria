import { MapActivityProvider } from "@/contexts/mapActivityContext";
import { ReactNode } from "react";

export default function Layout({children}:{children:ReactNode}) {
    return (
        <MapActivityProvider >
            {children}
        </MapActivityProvider>
    );
}