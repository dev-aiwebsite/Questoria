import Clouds from "@/components/clouds";
import Link from "next/link";

export default function Page() {
    return (
        <div className="relative isolate flex flex-col bg-primary h-screen overflow-hidden">
            <div className="absolute top-0 mt-10 -z-2">
                <Clouds />
            </div>
            <div className="prose space-y-6 text-base p-20 my-auto">
                <h2 className="text-3xl font-medium uppercase !mb-10 font-serif">Welcome to QUESTORIA.</h2>
                <p>A game made for curious explorers.</p>
                <p>Our first quest lives at <strong className="underline">Royal Botanic Gardens Cranbourne.</strong> </p>
                <p>Full of winding paths, hidden details, and moments worth stopping for.</p>
                <p>You can play while you’re here, or explore from home.</p>
                <p>Take your time. Wander. See what you find.</p>

                <Link
                className="btn primary mt-10"
                href={"/lite/map"}
                >
                Enter Map
                </Link>

            </div>



        </div>
    );
}