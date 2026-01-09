"use client"
import { IconLogo } from "@/lib/icons/icons";
import Clouds from "./clouds";
export default function LogoWithClouds() {
    return (
       <Clouds>
        <IconLogo className="-z-3 w-[50%] h-auto absolute top-[10px] left-1/2 -translate-x-[45%]" />
       </Clouds>
    );
}