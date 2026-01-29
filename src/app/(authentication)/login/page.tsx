"use client"
import { useAppRouter } from "@/contexts/appRouter";
import LogoWithClouds from "@/components/logoWithClouds";
import { LoginUser } from "@/server-actions/loginLogout";
import { LoaderCircle, OctagonX } from "lucide-react";
import Image from "@/components/optimizeImage";
import Link from "next/link";
import { useState } from "react";

export default function Page() {
    const [userEmail, setUserEmail] = useState("")
    const [userPass, setUserPass] = useState("")
    const [error, setError] = useState("")
    const [isSuccess, stIsSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useAppRouter()
    
    async function login() {
        setError("")
        setIsLoading(true)
            async function login() {
                const authRes = await LoginUser({
                    email: userEmail,
                    pass: userPass,
                }, false)
                
                if(authRes){
                    stIsSuccess(true)
                    setIsLoading(false)
                    router.push('/lite')

                } else {
                    setError('Invalid credentials')
                    stIsSuccess(false)
                    setIsLoading(false)
                }
                
                }
            login()
    }

    return (<>
        <div className="relative isolate flex flex-col bg-primary h-screen overflow-hidden">
            <div className="mt-10 -z-2">
                <LogoWithClouds />
            </div>
            <Image
                className="-z-1 absolute top-[300px] left-1/2 -translate-x-1/2"
                width={400}
                height={400}
                src="/images/mascot_world.gif"
                alt="mascot world"
            />
            <div className="mt-auto space-y-4 mb-10 mx-auto w-[300px] max-w-[95vw]">
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        login()
                    }}
                    className="space-y-4">
                         {error &&
                    <div className="bg-white rounded p-2 text-red-500">
                        <OctagonX className="inline" /> {error}
                    </div>
                }
                    <input
                        className="w-full" type="text" placeholder="Username or Email address"
                        onChange={(e) => setUserEmail(e.target.value)}
                        value={userEmail}
                    />
                    <input
                        className="w-full" type="password" placeholder="Password..."
                        onChange={(e) => setUserPass(e.target.value)}
                        value={userPass}
                    />
                    <button
                        type="submit"
                        className="btn primary font-bold w-full !flex flex-row items-center justify-center gap-2"
                        disabled={isLoading}
                    >
                        {isSuccess ? "ENTERING..." : <>
                        {isLoading && <LoaderCircle className="animate-spin" />}
                        START QUEST</>}
                    </button>
                </form>

                <div className="justify-center flex gap-4 flex-row font-bold">
                    <Link
                        className="underline flex-1 text-end"
                        href="/forgot-password">
                        Can&apos;t Login?
                    </Link>
                    |
                    <Link
                        className="underline flex-1"
                        href="/signup">
                        Register
                    </Link>
                </div>
            </div>
        </div>
 
    </>
    );
}