"use client"
import LogoWithClouds from "@/components/logoWithClouds";
import PageLoader from "@/components/pageLoader";
import { LoginUser } from "@/server-actions/loginLogout";
import { OctagonX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
    const [userEmail, setUserEmail] = useState("")
    const [userPass, setUserPass] = useState("")
    const [error, setError] = useState("")
    const [isSuccess, stIsSuccess] = useState(false)
    const router = useRouter()

    
    async function login() {
        setError("")
            async function login() {
                const authRes = await LoginUser({
                    email: userEmail,
                    pass: userPass,
                }, false)
                
                if(authRes){
                    stIsSuccess(true)
                    router.push(authRes?.redirectUrl)

                } else {
                    setError('Invalid credentials')
                }
                console.log(authRes, 'authres')
                }
            login()
    }

    return (<>{isSuccess ? <PageLoader /> : 
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
                        className="btn primary font-bold w-full"
                    >
                        START QUEST
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
        }
    </>
    );
}