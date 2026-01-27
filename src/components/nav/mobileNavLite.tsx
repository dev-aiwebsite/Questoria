"use client"
import { IconBack, IconLogoText } from "@/lib/icons/icons";
import Image from "next/image";
import { Link } from "@/app/contexts/appRouter";
import { useRouter } from "next/navigation";
import MobileLogoDropdown from "../mobileLogoDropdown";

export default function MobileNavLite() {
    const router = useRouter()
    
    return (
        <div className="pb-4 z-[500] h-nav-h bg-white border-2 border-black grid grid-cols-3 pt-3">
            <button
            onClick={() => {
                router.back()
            }}
            >
                <span className="flex flex-col flex-nowrap items-center justify-center">
                    <IconBack
                    className="ml-auto mr-10"
                    strokeWidth={2}
                        width={60}
                        height={50}
                    />
                    <span className="sr-only text-xxs font-bold">Back</span>
                </span>
            </button>
            <div className="relative">
                <MobileLogoDropdown align="center" trigger={ <div className="cursor-pointer flex items-center justify-center aspect-square w-[120px] h-auto absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full border-black border-2 bg-primary">
                    <div className="border-4 border-white w-full h-full rounded-full items-center justify-center flex relative">
                    <span className="block absolute top-3.5 left-3.5 w-4.5 h-6.5 bg-white/40 rounded-[10px/60%] rotate-[32deg]"></span>
                    <IconLogoText className="text-white" />

                    </div>
                </div>}/>
               
            </div>
            <Link
                href="/lite/photos"
            >
                <span className="flex flex-col flex-nowrap items-center justify-center">
                    <Image
                        className="mr-auto ml-10"
                        width={60}
                        height={50}
                        src="/images/IconCamera.png"
                        alt="Maps"
                    />
                    <span className="sr-only text-xxs font-bold">Camera</span>
                </span>
            </Link>

        </div>
    );
}