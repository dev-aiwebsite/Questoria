import { Settings, SquarePen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
    return (
        <div className="p-mobile">
            <h2 className="header2 text-center !mb-6">Profile</h2>
            <div className="mb-4">
                <div className="text-xxs">
                    <span className="font-bold">Complete your profile</span><span className="float-right font-bold">60% complete</span>
                </div>
                <div className="border border-black w-full h-2.5 bg-gray-200 relative">
                    <div className="border-r black absolute top-0 left-0 h-full w-[60%] bg-yellow-400"></div>
                </div>
            </div>
            <div className="border-3 border-black bg-white rounded-xl p-6">
                <div className="flex flex-row flex-nowrap items-center mb-6">
                    <Image
                        className="rounded-full aspect-square object-cover h-auto border-1 border-white mr-4"
                        src="https://ucarecdn.com/dece9b56-f8b8-4bda-aeeb-1bf2614c1f73/-/preview/286x479/"
                        width={60}
                        height={60}
                        alt=""

                    />
                    <div>
                        <p className="font-bold">Changler Bing</p>
                        <p className="text-sm">email@gmail.com</p>
                    </div>
                    <div className="ml-auto text-xs space-y-2">
                        <Link
                            className="flex flex-row flex-nowrap gap-1 items-center p-1 border border-black"
                            href="#">
                            <SquarePen size={12} /><span>Edit Profile</span>
                        </Link>
                        <Link
                            className="flex flex-row flex-nowrap gap-1 items-center p-1 border border-black"
                            href="#">
                            <Settings size={12} /><span>Settings</span>
                        </Link>
                    </div>
                </div>
                <div className="block w-full h-[2px] bg-black/50"></div>
                <div className="pb-0 p-4 flex flex-row flex-nowrap items-center justify-center gap-4">
                    <div className="space-x-2">
                        <span>Following</span>
                        <span>0</span>
                    </div>
                    <div className="space-x-2">
                        <span>Followers</span>
                        <span>0</span>
                    </div>
                </div>
            </div>

            <div className="mt-6 space-y-2">
                <h2 className="header2 text-center !mb-6">Quest Gallery</h2>
                <div className="grid grid-cols-4 gap-2">
                    <Image
                        className="w-full aspect-square h-auto object-cover border-2 border-black"
                        src="/images/img11.jpg"
                        height={60}
                        width={60}
                        alt=""
                    />
                    <Image
                        className="w-full aspect-square h-auto object-cover border-2 border-black"
                        src="/images/img12.jpg"
                        height={60}
                        width={60}
                        alt=""
                    />
                    <Image
                        className="w-full aspect-square h-auto object-cover border-2 border-black"
                        src="/images/img13.jpg"
                        height={60}
                        width={60}
                        alt=""
                    />
                    <Image
                        className="w-full aspect-square h-auto object-cover border-2 border-black"
                        src="/images/img14.jpg"
                        height={60}
                        width={60}
                        alt=""
                    />
                </div>
                <div className="grid grid-cols-4 gap-2">
                    <Image
                        className="w-full aspect-square h-auto object-cover border-2 border-black"
                        src="/images/img11.jpg"
                        height={60}
                        width={60}
                        alt=""
                    />
                    <Image
                        className="w-full aspect-square h-auto object-cover border-2 border-black"
                        src="/images/img12.jpg"
                        height={60}
                        width={60}
                        alt=""
                    />
                    <Image
                        className="w-full aspect-square h-auto object-cover border-2 border-black"
                        src="/images/img13.jpg"
                        height={60}
                        width={60}
                        alt=""
                    />
                    <Image
                        className="w-full aspect-square h-auto object-cover border-2 border-black"
                        src="/images/img14.jpg"
                        height={60}
                        width={60}
                        alt=""
                    />
                </div>
                <div className="grid grid-cols-4 gap-2">
                    <Image
                        className="w-full aspect-square h-auto object-cover border-2 border-black"
                        src="/images/img11.jpg"
                        height={60}
                        width={60}
                        alt=""
                    />
                    <Image
                        className="w-full aspect-square h-auto object-cover border-2 border-black"
                        src="/images/img12.jpg"
                        height={60}
                        width={60}
                        alt=""
                    />
                    <Image
                        className="w-full aspect-square h-auto object-cover border-2 border-black"
                        src="/images/img13.jpg"
                        height={60}
                        width={60}
                        alt=""
                    />
                    <Image
                        className="w-full aspect-square h-auto object-cover border-2 border-black"
                        src="/images/img14.jpg"
                        height={60}
                        width={60}
                        alt=""
                    />
                </div>
            </div>
        </div>
    );
}
