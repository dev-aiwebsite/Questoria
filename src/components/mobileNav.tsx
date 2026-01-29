import Image from "@/components/optimizeImage";
import Link from "next/link";

export default function MobileNav() {
    return (
        <div className="z-[500] h-nav-h bg-white border-3 border-black grid grid-cols-5 pt-3">
            <Link
            href="/maps"
            >
                <span className="flex flex-col flex-nowrap items-center justify-center">
                <Image 
                width={40}
                height={40}
                src="/images/IconMaps.png"
                alt="Maps"
                />
                <span className="text-xxs font-bold">Maps</span>
                </span>
            </Link>
            <Link
            href="/leaderboard"
            >
                <span className="flex flex-col flex-nowrap items-center justify-center">
                <Image 
                width={40}
                height={40}
                src="/images/IconLeaderBoards.png"
                alt="Maps"
                />
                <span className="text-xxs font-bold">Leaderboard</span>
                </span>
            </Link>
            <Link
            href="/home"
            >
                <span className="flex flex-col flex-nowrap items-center justify-center">
                <Image 
                width={40}
                height={40}
                src="/images/IconHome2.png"
                alt="Maps"
                />
                <span className="text-xxs font-bold">Home</span>
                </span>
            </Link>
            <Link
            href="/rewards"
            >
                <span className="flex flex-col flex-nowrap items-center justify-center">
                <Image 
                className="p-[2px]"
                width={40}
                height={40}
                src="/images/IconRewards.png"
                alt="Maps"
                />
                <span className="text-xxs font-bold">Rewards</span>
                </span>
            </Link>
            <Link
            href="/account"
            >
                <span className="flex flex-col flex-nowrap items-center justify-center">
                <Image 
                className="rounded-full border-2 object-cover aspect-square h-auto"
                width={40}
                height={40}
                src="/images/img5.jpg"
                alt="Maps"
                />
                <span className="text-xxs font-bold">Profile</span>
                </span>
            </Link>
        </div>
    );
}