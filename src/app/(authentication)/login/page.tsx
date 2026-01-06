import LogoWithClouds from "@/components/logoWithClouds";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
    return (
        <div className="relative isolate flex flex-col bg-primary h-screen overflow-hidden">
            <div className="mt-10 -z-2">
               <LogoWithClouds />
            </div>
            <Image
                className="-z-1 absolute top-[300px] left-1/2 -translate-x-1/2"
                width={400}
                height={400}
                src="/images/mascot_world.gif"
                alt="mascot world"
            />
            <div className="mt-auto mb-10 space-y-4 mx-auto w-[300px] max-w-[95vw]">
                <input className="w-full" type="email" placeholder="Email address..." />
                <input className="w-full" type="password" placeholder="Password..." />
                <button className="w-full font-bold input primary">START QUEST</button>
                <div className="justify-center flex gap-4 flex-row font-bold">
                    <Link
                        className="underline flex-1 text-end"
                        href="#">
                        Can&apos;t Login?
                    </Link>
                    |
                    <Link
                        className="underline flex-1"
                        href="#">
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
}