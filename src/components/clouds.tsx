"use client"
import { cn } from "@/lib/helper";
import { IconCloud, IconCloud2 } from "@/lib/icons/icons";
import { motion } from "framer-motion";

export default function Clouds({children, className}:{children?:React.ReactNode, className?:string;}) {
    return (
        <div className={cn("-z-2 relative h-[360px] w-screen", className)}>
            <div className="relative h-full w-full">
                <motion.div
                    className="absolute top-0 left-0 w-[75%]"
                    initial={{ x: "-45%" }}   // start at center
                    animate={{ x: "-500%" }}        // end at natural position
                    transition={{
                        duration: 1000,
                        ease: "linear",
                        repeat: Infinity,
                    }}
                >
                    <IconCloud strokeWidth={0.3} className="w-full h-auto" />
                </motion.div>
                <motion.div
                    className="absolute top-[130px] w-[50%]"
                    initial={{ x: "120%" }}   // start off-screen right
                    animate={{ x: "-140%" }}   // move past left edge     // end at natural position
                    transition={{
                        duration: 200,
                        ease: "linear",
                        repeat: Infinity,
                    }}
                >
                    <IconCloud strokeWidth={0.3} className="w-full h-auto" />
                </motion.div>


                <motion.div
                    className="absolute bottom-0"
                    initial={{ x: "100vw" }}   // start off-screen right
                    animate={{ x: "-140%" }}   // move past left edge
                    transition={{
                        duration: 30,
                        ease: "linear",
                        repeat: Infinity,
                    }}
                >
                    <IconCloud2 />
                </motion.div>
            </div>
            {children}
        </div>
    );
}