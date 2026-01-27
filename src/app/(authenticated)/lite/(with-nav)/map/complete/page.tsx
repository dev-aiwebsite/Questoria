"use client"
import { Link } from "@/app/contexts/appRouter";
import Image from "next/image";

export default function Page() {
    
    return (
        <div className="p-mobile bg-primary height-with-nav pb-[100px] overflow-auto">
            <div className="gap-4 text-center flex flex-col flex-nowrap justify-center h-full min-h-fit">
                <h1 className="header1 text-center mb-6">Congratulations!</h1>
                <p>You’ve completed all the checkpoints in Cranbourne Botanical Garden</p>
                <div>

                    <Image
                        className="mx-auto"
                        src="/images/mascot-eaten-foods.png"
                        width={200}
                        height={200}
                        alt=""
                    />
                    <h2 className="!mt-8 header2 text-center">Summary - Forage Finds</h2>
                    <div className="grid grid-cols-1 grid-rows-2 gap-2">
                        <div className="border-3 border-black flex flex-row flex-nowrap gap-2 py-2 px-4 bg-white rounded-lg font-bold text-lg justify-center items-center">
                            <span>Worms</span>
                            <span className="border-gray-400 border-y border-1 border-dashed flex-1 h-[1px]"></span>
                            <span>x10</span>
                            <div
                                className="worm"
                            ></div>


                        </div>
                        <div className="border-3 border-black flex flex-row flex-nowrap gap-2 py-2 px-4 bg-white rounded-lg font-bold text-lg justify-center items-center">
                            <span>Total Time</span>
                            <span className="border-gray-400 border-y border-1 border-dashed flex-1 h-[1px]"></span>
                            <span>5hrs</span>
                            <Image
                            className="h-10 object-contain"
                            src="/images/IconClock.png"
                            width={60}
                            height={30}
                            alt=""
                            />

                        </div>
                    </div>
                    <p className="my-10">Enjoyed this Quest? <Link
                    className="font-bold underline"
                    href="/lite/map/complete/feedback">Leave Feedback</Link></p>

                        <Link
                    className="btn primary"
                    href={"/lite/map"}
                >
                    Return to Map
                </Link>

                </div>

            </div>
        </div>
    );
}