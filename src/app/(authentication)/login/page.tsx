"use client"
import { useAppData } from "@/app/contexts/appDataContext";
import { useCurrentUserContext } from "@/app/contexts/currentUserContext";
import LogoWithClouds from "@/components/logoWithClouds";
import PageLoader from "@/components/pageLoader";
import { getUserOnboardingAnswerByUserId } from "@/server-actions/crudUserOnboarding";
import { OctagonX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Page() {
    const [userEmail, setUserEmail] = useState("")
    const [userPass, setUserPass] = useState("")
    const [error, setError] = useState("")
    const {setCurrentUser, setUserOnboarding} = useCurrentUserContext()
    const {users} = useAppData()
    const [isSuccess, stIsSuccess] = useState(false)
    

    console.log(users, 'users')
    async function login() {
        if (!userEmail || !userPass) {
            setError('Invalid credentials')
            return
        }
        const userData = users.find(u => userEmail === u.email || userEmail === u.username);


        if (!userData) {
            setError('Invalid credentials')
            return
        }

        if (userData.password != userPass) {
            setError('Invalid credentials')
            return
        }
        
             
        
        setCurrentUser(userData)
        const {data} = await getUserOnboardingAnswerByUserId(userData.id)
            console.log(data, 'getUserOnboardingAnswerByUserId')
            if(data){
                setUserOnboarding(data)
            }
        stIsSuccess(true)
        setError("")
        return
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