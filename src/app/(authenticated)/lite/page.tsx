"use client"

import Clouds from "@/components/clouds";
import Link from "next/link";

export default function Page() {

    return (
        <div className="relative isolate flex flex-col bg-primary h-screen overflow-hidden p-5">
            <div className="absolute top-0 mt-10 -z-2">
                <Clouds />
            </div>
            <div className="bg-white rounded-2xl border-3 border-black prose space-y-6 text-base p-10 my-auto overflow-auto">
                <h2 className="p-2 rounded-xl text-3xl font-medium uppercase !mb-10 font-serif">Welcome to QUESTORIA</h2>
                
                    <p>
                        <strong>A game made for curious explorers.</strong>
                    </p>

                    <p>
                        Our first quest lives at <strong>Royal Botanic Gardens, Cranbourne</strong>.
                        <br />
                        Full of winding paths, hidden details, and moments worth stopping for.
                    </p>

                    <p>
                        <strong>Meet your guide, a Southern Brown Bandicoot</strong>
                        <br />
                        These shy foragers help keep gardens healthy as they search for food and turn over soil.
                    </p>

                    <p>
                        As you explore, you’ll collect the foods bandicoots look for in the wild.
                        <br />
                        Each find adds to your progress and helps your bandicoot along the way.
                    </p>

                    <p>
                        <strong>Did you know?</strong>
                        <br />
                        Southern Brown Bandicoots are native to this part of Victoria and rely on safe,
                        well-cared-for habitats to survive.
                    </p>

                    <p>
                        You can play while you’re here, or explore from home.
                        <br />
                        Take your time. Wander. See what you find.
                    </p>
                


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