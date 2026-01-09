import { Map, maps } from "@/lib/dummy";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
    return (
        <div className="p-mobile space-y-8">
            {maps.map(m => <MapCard key={m.id} map={m} />)}
        </div>
    );
}


function MapCard({map}:{map:Map}) {
    return <div>
        <h2 className="header2">{map.title} {!map.released && "- Coming soon..."}</h2>
        <Link
        href={`/maps/${map.id}`}
        className="overflow-hidden flex flex-col flex-nowrap app-container bg-app-blue-600">
            <div className="p-4 flex flex-row">
                <div className="w-1/2">
                    <Image
                        className="brightness-[1000%] mb-1"
                        width={130}
                        height={60}
                        src={map.logo}
                        alt=""
                    />
                    <span className="lineheight-1 text-[8px] text-white">{map.description}</span>
                </div>
                <div className="my-auto flex-1 grid grid-cols-3">
                    {map.images.length > 0 && 
                    map.images.map((img, index) => 
                         <Image key={map.id + index}
                        className="border-2 border-white object-cover aspect-square h-auto"
                        width={50}
                        height={100}
                        src={img}
                        alt=""
                    />
                    )}
                </div>

            </div>
            <div className="py-3 px-4 mt-auto bg-white">
                <div className="flex flex-row gap-2 items-center text-xs font-bold">
                    <Image
                        width={20}
                        height={29}
                        src="/images/IconStar.png"
                        alt=""
                    />
                <span>{map.ratings}</span>
                <span>({map.ratings_count} Ratings)</span>
                </div>
            </div>
        </Link>
    </div>
}