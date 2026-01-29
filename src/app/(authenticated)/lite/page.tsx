"use client"

import { Link } from "@/contexts/appRouter";
import Clouds from "@/components/clouds";
import Image from "next/image";

export default function Page() {
    return (
        <div className="relative isolate flex flex-col bg-primary h-screen overflow-hidden p-5">
            <div className="absolute top-0 mt-10 -z-2">
                <Clouds />
            </div>
            <div className="bg-white rounded-2xl border-3 border-black prose space-y-4 text-base p-10 my-auto overflow-auto">
                <h1>WELCOME TO QUESTORIA</h1>
                
                    <p>
                        <strong>A game made for curious explorers.</strong>
                    </p>
                   
                    <p>
                        Our first quest begins in the living landscapes of the <strong>Royal Botanic Gardens, Cranbourne, Victoria, Australia.</strong> It&apos;s full of winding paths and hidden details; you can play while you visit or explore from home.
                    </p>

                     <Image
                     className="mx-auto -translate-x-[10%]"
                    src="/images/mascot-with-basket.png"
                    alt=""
                    width={200}
                    height={200}
                    />

                    <p><strong>Meet your guide, a Southern Brown Bandicoot!</strong> These shy foragers help keep gardens healthy as they search for food and turn over soil. As you explore, you’ll collect the foods bandicoots look for in the wild.
                    </p>

                <Link
                    className="btn primary mt-10"
                    href={"/lite/map"}
                >
                    Start Exploring
                </Link>
            </div>
        </div>
    );

}