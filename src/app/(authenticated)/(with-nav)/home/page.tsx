import ImportantUpdatesCarousel from "@/components/importantUpdatesCarousel";
import Image from "next/image";

export default function Page() {
    return (
        
            <div className="px-mobile space-y-8">
                <div>
                    <h2 className="header2">Important Updates</h2>
                    <ImportantUpdatesCarousel />
                </div>

                <div>
                    <h2 className="header2">Top Questor</h2>
                    <div className="h-[167px] app-container bg-app-teal flex flex-row items-center justify-between gap-2 p-6">
                        <div className="flex flex-col flex-nowrap items-center">
                            <Image
                                className="rounded-full border-2 border-black aspect-square h-auto object-cover"
                                width={60}
                                height={100}
                                src="/images/img4.jpg"
                                alt=""
                            />
                            <span className="-mt-3 flex justify-center text-sm font-bold text-slate-600 items-center rounded-full aspect-square h-auto border-2 border-slate-600 bg-primary">2</span>
                            <span className="text-xs font-bold">Ross Geller</span>
                            <span className="text-xxs">6061XP</span>
                        </div>
                        <div className="flex flex-col flex-nowrap items-center">
                            <Image
                                className="rounded-full border-2 border-black aspect-square h-auto object-cover object-[50%_20%]"
                                width={90}
                                height={100}
                                src="/images/img5.jpg"
                                alt=""
                            />
                            <span className="-mt-5 flex justify-center text-lg font-bold text-slate-600 items-center rounded-full aspect-square h-auto border-2 border-slate-600 bg-yellow-400">1</span>
                            <span className="text-xs font-bold">Monica Geller</span>
                            <span className="text-xxs">8080XP</span>
                        </div>
                        <div className="flex flex-col flex-nowrap items-center">
                            <Image
                                className="rounded-full border-2 border-black aspect-square h-auto object-cover"
                                width={70}
                                height={100}
                                src="/images/img3.jpg"
                                alt=""
                            />
                            <span className="-mt-3 flex justify-center text-sm font-bold text-slate-600 items-center rounded-full aspect-square h-auto border-2 border-slate-600 bg-red-400">3</span>
                            <span className="text-xs font-bold">Rachel Green</span>
                            <span className="text-xxs">7810XP</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="header2">Continue your journey</h2>
                    <div className="overflow-hidden flex flex-col flex-nowrap app-container bg-app-blue-600">
                        <div className="p-4 flex flex-row">
                            <div className="w-1/2">
                             <Image
                                className="brightness-[1000%] mb-1"
                                width={130}
                                height={60}
                                src="/images/img8.png"
                                alt=""
                            />
                            <span className="lineheight-1 text-[8px] text-white">Royal Botanic Gardens Victoria is one of Australia’s most beloved botanical institutions, comprising two major garden sites, Melbourne Gardens and Cranbourne Gardens, each offering distinct plant experiences and landscapes.</span>
                            </div>
                            <div className="my-auto flex-1 grid grid-cols-3">
                                 <Image
                                 className="border-2 border-white object-cover aspect-square h-auto"
                                width={50}
                                height={100}
                                src="/images/img6.jpg"
                                alt=""
                            />
                             <Image
                             className="border-2 border-white object-cover aspect-square h-auto"
                                width={50}
                                height={100}
                                src="/images/img7.jpg"
                                alt=""
                            />
                             <Image
                             className="border-2 border-white object-cover aspect-square h-auto"
                                width={50}
                                height={100}
                                src="/images/img9.jpg"
                                alt=""
                            />
                            </div>
                            
                        </div>
                        <div className="p-4 mt-auto bg-white">
                            <div>
                                <div className="mb-1 text-xxs font-bold">
                                    <span>Progress</span>
                                    <span className="float-right">60% complete</span>
                                </div>
                                <div className="w-full relative overflow-hidden h-4 border-2 border-black">
                                    <div className="absolute bg-yellow-400 top-0 left-0 h-full w-[60%]">

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        
    );
}