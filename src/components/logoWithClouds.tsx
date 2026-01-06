"use client"
import { IconCloud, IconCloud2, IconLogo } from "@/lib/icons/icons";
import { motion } from "framer-motion";
export default function LogoWithClouds() {
    return (
      <div className="-z-2 relative h-[360px] w-screen">
                <div className="relative h-full w-full">
                    {/* <IconCloud strokeWidth={0.3} className="absolute top-[90px] left-0 -translate-x-1/2 h-auto w-[75%]" /> */}
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
                <IconLogo className="-z-3 w-[50%] h-auto absolute top-[10px] left-1/2 -translate-x-[45%]" />
            </div>
    );
}