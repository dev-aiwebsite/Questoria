"use client"
import { checkpoints } from "@/lib/dummy";
import { cn } from "@/lib/helper";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function Page() {
    const { id: mapId } = useParams<{ id: string }>();
    const mapCheckpoints_unsorted = checkpoints.filter(c => c.map_id == mapId)
    const mapCheckpoints = mapCheckpoints_unsorted.sort(
        (a, b) => a.order - b.order
    )

    return (
        <div className="p-mobile space-y-8">
            <div className="text-center">
                <h3 className="header3 !mb-6">Victoria Botanical Garden</h3>
                <Image
                    className="mb-4 border-3 border-black w-full object-cover object-center h-[250px] rounded-xl"
                    width={200}
                    height={200}
                    src="/images/maps/map-botanical-garden.png"
                    alt="Victoria Botanical Garden" />
                <Link
                    className="input btn primary "
                    href="./map">
                    Open map</Link>
            </div>

            <div className="text-center space-y-8">
                <h3 className="header3">Way points</h3>
                <p>Waypoints are key locations you’ll visit during your quest. Reach each one, complete the challenge, and continue onward. There’s no set order, follow the map, roam freely, and explore at your own pace. </p>
                <div className="space-y-4">
                    {mapCheckpoints.length > 0 &&
                        mapCheckpoints.map(c => {
                            const totalStars = 3;
                            const filledStars = Math.ceil((c.progress_percent / 100) * totalStars);
                            return <Link
                                key={c.id}
                                className={cn("bg-white rounded-xl border border-black px-4 py-3 text-sm flex flex-row flex-nowrap justify-between items-center", c.status === "open" && 'bg-green-700 text-white')}
                                href={`/maps/${mapId}/checkpoints/${c.id}`}
                            >
                                {c.title}


                                <span className="flex flex-row items-center gap-1">
                                    {Array.from({ length: totalStars }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className={
                                                i < filledStars
                                                    ? "text-yellow-400 fill-yellow-400"
                                                    : "text-muted-foreground"
                                            }
                                        />
                                    ))}
                                </span>
                            </Link>
                        })}
                </div>
            </div>

        </div>
    );
}

