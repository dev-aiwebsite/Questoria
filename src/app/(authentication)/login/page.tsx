"use client"
import { useCurrentUserContext } from "@/app/contexts/currentUserContext";
import LogoWithClouds from "@/components/logoWithClouds";
import { users } from "@/lib/dummy";
import { OctagonX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
    const router = useRouter()
    const [userEmail, setUserEmail] = useState("")
    const [userPass, setUserPass] = useState("")
    const [error, setError] = useState("")
    const {currentUser, setCurrentUser} = useCurrentUserContext()

    useEffect(()=>{
        if(currentUser){
            router.push("/home")
        }
    },[currentUser])
    
    function login() {
        if (!userEmail || !userPass) {
            setError('Invalid credentials')
            return
        }
        const userData = users.find(u => u.email == userEmail)

        if (!userData) {
            setError('Invalid credentials')
            return
        }

        if (userData.password != userPass) {
            setError('Invalid credentials')
            return
        }
        setCurrentUser(userData)
        setError("")
    }

    return (
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
                        className="w-full" type="email" placeholder="Email address..."
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
    );
}