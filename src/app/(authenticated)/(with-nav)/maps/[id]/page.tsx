"use client"

import { maps } from "@/lib/dummy";
import { Calendar, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function Page() {
    const { id } = useParams<{ id: string }>();
    const map = maps.find(m => m.id == id)
    const valid = !!map && map.released

    return (
        <div className="p-mobile">
            {!valid ?
                <div className="w-full rounded-xl border-black border-3 bg-yellow-400 h-[167px] flex items-center justify-center">
                    <span className="font-bold">Sorry content not available.</span>
                </div>
                :
                <div className="space-y-6">
                    <div className="w-full rounded-xl border-3 border-black overflow-hidden relative">
                        <Image
                            className="w-full aspect-video"
                            src={map.featured_image}
                            height={100}
                            width={200}
                            alt={map.title}
                        />
                        <div className="absolute bottom-0 left-0 p-4 flex flex-row flex-nowrap items-center justify-between w-full bg-gradient-to-r from-black/80 to-black/20">
                            <Image
                                className="brightness-[1000%]"
                                width={140}
                                height={60}
                                src={map.logo}
                                alt=""
                            />
                            <div className="text-white flex flex-row gap-2 items-center text-sm font-bold">
                                <span>{map.ratings}</span>
                                <span>({map.ratings_count} Ratings)</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="font-bold mb-1">About</p>
                        <p className="text-sm">{map.description}</p>
                    </div>

                    <div>
                        <p className="font-bold mb-1">People & Places from the Quest</p>
                        <div className="grid grid-cols-4 gap-2">
                            <Image
                            className="w-full aspect-square h-auto object-cover border-2 border-black"
                            src="/images/img11.jpg"
                            height={60}
                            width={60}
                            alt={map.title}
                        />
                            <Image
                            className="w-full aspect-square h-auto object-cover border-2 border-black"
                            src="/images/img12.jpg"
                            height={60}
                            width={60}
                            alt={map.title}
                        />
                            <Image
                            className="w-full aspect-square h-auto object-cover border-2 border-black"
                            src="/images/img13.jpg"
                            height={60}
                            width={60}
                            alt={map.title}
                        />
                            <Image
                            className="w-full aspect-square h-auto object-cover border-2 border-black"
                            src="/images/img14.jpg"
                            height={60}
                            width={60}
                            alt={map.title}
                        />
                        </div>
                    </div>

                    <div className="font-bold text-xs flex flex-row flex-nowrap items-center">
                        <Calendar className="inline mb-1 mr-1" /> 
                        <span>Monday, Tuesday, Wednesday, Thursday, and Friday</span>
                    </div>
                    <div className="-mt-4 font-bold text-xs flex flex-row flex-nowrap items-center">
                        <Clock className="inline mb-1 mr-1" /> 
                        <span>Operation Hours <br/> 12AM-11PM</span>
                    </div>

                    <Link
                    className="text-center btn w-full font-bold text-lg input primary"
                    href={`/maps/${id}/start`}
                    >
                    Begin Quest
                    </Link>
                </div>}
        </div>
    );
}