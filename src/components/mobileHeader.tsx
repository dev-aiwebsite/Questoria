import { cn } from "@/lib/helper";
import { IconBell } from "@/lib/icons/icons";
import MobileLogoDropdown from "./mobileLogoDropdown";

export default function MobileHeader({ className }: { className?: string; }) {
    return (
        <div className={cn("z-[600] h-header-h gap-4 px-mobile flex flex-row flex-nowrap justify-center items-center pt-4 pb-2", className && className)}>
           <MobileLogoDropdown />
            <input
                className="flex-1"
                type="text" placeholder="Search quest and cities" />
            <IconBell strokeWidth={2} />
        </div>
    );
}