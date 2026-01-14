"use client"
import LogoWithClouds from "@/components/logoWithClouds";
import Link from "next/link";
import { useState } from "react";

export default function Page() {
    const [isSent, setIsSent] = useState(false)
    function handleSubmit(){
        setIsSent(true)
    }
    return (
        <div className="relative isolate flex flex-col bg-primary h-screen overflow-hidden">
            <div className="absolute top-0 mt-10 -z-2">
                <LogoWithClouds />
            </div>
           {!isSent && <div className="mt-auto mb-10 space-y-4 mx-auto w-[380px] max-w-[95vw] space-y-4">
                <h2 className="header2 !mb-6 text-center">Can’t remember the magic word?</h2>
                <p className="mb-30 text-sm text-center">No worries, every explorer needs a map now and then. Enter your email and we’ll help you back in.</p>
            
                <input className="w-full" type="email" name="forgotpassword_email" placeholder="Email" />
                <button
                className="text-xl btn primary font-bold w-full"
                onClick={()=> handleSubmit()}
                >
                    Send My Reset Link
                </button>


                <div className="justify-center text-center flex gap-4 flex-row font-bold">
                    <Link
                        className="underline flex-1"
                        href="/login">
                        Remember your password?
                    </Link>
                </div>
            </div>}
             {isSent && <div className="mt-auto mb-10 space-y-4 mx-auto w-[380px] max-w-[95vw] space-y-4">
                <h2 className="header2 !mb-6 text-left">Message Sent</h2>
                <p className="mb-50 text-sm text-left">A magic link is on its way to help you back into your adventure.</p>
            
                
                <Link href="/login" className="text-xl btn primary font-bold w-full">
                    Back to Login Page
                </Link>

            </div>}
        </div>
    );
}