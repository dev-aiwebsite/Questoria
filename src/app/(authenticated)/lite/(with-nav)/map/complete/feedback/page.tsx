"use client"
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Page() {
    
    const [isSuccess, setIsSuccess] = useState(false)
    function handleFormSubmit() {
        setIsSuccess(true)
    }
    return (
        <div className="p-mobile bg-primary height-with-nav overflow-auto">
            {isSuccess ? <ThankYouPage /> : 
            <div className="gap-4 text-center flex flex-col flex-nowrap justify-center h-full min-h-fit">
                <h1 className="header1 text-center mb-6">Questoria Feedback Form</h1>
                <p>Overall, how would you rate your adventure experience? </p>
                <form 
                onSubmit={(e) => {
                    e.preventDefault()
                    handleFormSubmit()}}
                className="space-y-10">
                    <div className="flex flex-row flex-nowrap items-center justify-center gap-2">
                        <Star
                            className="h-[50px] w-auto aspect-square"
                            size={24} />
                        <Star
                            className="h-[50px] w-auto aspect-square"
                            size={24} />
                        <Star
                            className="h-[50px] w-auto aspect-square"
                            size={24} />
                        <Star
                            className="h-[50px] w-auto aspect-square"
                            size={24} />
                        <Star
                            className="h-[50px] w-auto aspect-square"
                            size={24} />



                    </div>
                      <p >Any feedback you’d like to share to the Questoria team?</p>
                    <textarea
                        className="w-full bg-white input"
                        name="feedback-message" id="" placeholder="Enter your message here..." rows={6}></textarea>
                    <button
                    type="submit"
                        className="w-full btn primary"
                    >
                        Submit
                    </button>
                </form>

                  
            </div>
}
        </div>
    );
}

function ThankYouPage(){
    return <>
     <div className="p-mobile bg-primary height-with-nav overflow-auto">
            <div className="gap-4 text-center flex flex-col flex-nowrap justify-center h-full min-h-fit">
                <h1 className="header1 text-center mb-6">Thank you for your Feedback </h1>
                                    <Image
                                        className="mx-auto"
                                        src="/images/mascot-byebye.png"
                                        width={200}
                                        height={200}
                                        alt=""
                                    />
                <p>Follow us on social media</p>
                <div className="flex flex-row flex-nowrap gap-3 items-center justify-center">
                    <div className="w-14 social linkedin"></div>
                    <div className="w-14 social fb"></div>
                    <div className="w-14 social insta"></div>
                    <div className="w-14 social tiktok"></div>

                </div>
                   <Link
                   
                    href="/lite/map"
                        className="!mt-10 w-full btn primary"
                    >
                        Return to Map
                    </Link>
            </div>
        </div>
    </>
}