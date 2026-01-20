"use client"

import ARCamera from "@/components/ARCamera";
import { IconCameraAdd } from "@/lib/icons/icons";
import Image from "next/image";
import { useState } from "react";

export default function Page() {
    const [openCamera, setOpenCamera] = useState(false)
    const [ARImage, setARImage] = useState("")
    return (
        <div className="p-mobile bg-primary height-with-nav overflow-auto">
            <div className="gap-4 text-center flex flex-col flex-nowrap justify-center h-full min-h-fit">

            
            <h2 className="text-2xl font-serif text-center mb-6">Capture the right moment</h2>
            <div className="cursor-pointer overflow-hidden bg-white rounded-xl border border-black w-full h-[250] flex items-center justify-center">
                {ARImage ?
                    <Image
                        className="w-full h-auto object-cover"
                        width={300}
                        height={250}
                        src={ARImage}
                        alt="" />
                    :
                    <button onClick={() => setOpenCamera(true)}>
                        <IconCameraAdd />
                    </button>

                }
                {openCamera &&
                    <div className="flex bg-white w-screen h-screen absolute z-[999999] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <ARCamera onClose={(v) => {
                            if (v) {
                                setARImage(v)
                                const link = document.createElement("a");
                                link.href = v;
                                link.download = `questoria-postcard.png`;
                                link.click();
                            }
                            setOpenCamera(false)
                        }} />
                    </div>

                }
            </div>
            <p>Tap to open Camera</p>
            </div>
        </div>
    );
}