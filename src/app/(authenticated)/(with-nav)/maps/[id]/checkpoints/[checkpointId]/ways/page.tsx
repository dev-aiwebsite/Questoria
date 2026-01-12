"use client"


import ARCamera from "@/components/ARCamera";
import HappinessRatingSlider from "@/components/happinessRatingSlider";
import InputChoices from "@/components/inputChoices";
import { IconCameraAdd } from "@/lib/icons/icons";
import Image from "next/image";
import { useState } from "react";

export default function Page() {
    const [openQuiz, setOpenQuiz] = useState(false)
    const [quizAnswer, setQuizAnswer] = useState("")
    const [ARImage, setARImage] = useState("")
    const [openCamera, setOpenCamera] = useState(false)

    const isQuizAnswerCorrect = quizAnswer === "c2"
    return (
        <div className="p-mobile space-y-8">
            <h3 className="header3 text-center !mb-8">3 Ways to clear this checkpoint (optional)</h3>
            <div className="space-y-4">
                <p className="text-sm">1. Snap a magical moment! Capture a selfie or photo of the Visitor Centre to earn <span className="font-bold">1 Star</span> on your quest.</p>
                <div className="overflow-hidden bg-stone-300 rounded-xl border border-black w-full h-[250] flex items-center justify-center">
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
                                if(v){
                                    setARImage(v)
                                }
                                setOpenCamera(false)
                                }} />
                        </div>

                    }
                </div>
            </div>

            <div className="space-y-4">
                <p className="text-sm">2. Answer the quiz <span className="font-bold">(1 Star)</span></p>
                <button
                    disabled={isQuizAnswerCorrect}
                    onClick={() => setOpenQuiz(true)} className="btn primary w-full !border-1 ">{isQuizAnswerCorrect ? "Passed 100%" : "Begin Quiz"}</button>

                {openQuiz &&
                    <Quiz onSubmit={(e) => {
                        setQuizAnswer(e[0])
                        setOpenQuiz(false)
                    }} />
                }
            </div>

            <div className="space-y-4">
                <p className="text-sm">3. Tell us what you like about the Visitor Centre<span className="font-bold">(1 Star)</span></p>
                <HappinessRatingSlider />
            </div>

            <button className="btn primary float-right text-lg w-[120px]">Submit</button>

        </div>
    );
}

function Quiz({ onSubmit }: { onSubmit: (e: string[]) => void }) {
    const [selected, setSelected] = useState([""])
    const choices = [
        { id: "c1", text: "1820" },
        { id: "c2", text: "1846" },
        { id: "c3", text: "1901" },
        { id: "c4", text: "1988" },
    ];

    function handleSubmit() {
        if (onSubmit) {
            onSubmit(selected)
        }
    }
    return <div className="flex p-mobile w-screen h-screen backdrop-blur-[2px] bg-black/10 absolute z-[999999] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="p-10 min-h-fit h-[70vh] flex flex-col flex-nowrap justify-center bg-white rounded-xl border border-black m-auto">
            <h3 className="header3">When was the Victoria Botanical Gardens originally founded?</h3>
            <div>
                <InputChoices
                    name="ways_quiz"
                    choices={choices}
                    onChange={(e) => setSelected(e)}
                />

            </div>
            <div className="flex flex-row items-center mt-8">
                <span className="text-xs underline flex-1">The question is too hard. Skip.</span>
                <button onClick={handleSubmit} className="btn primary font-bold">Submit</button>
            </div>

        </div>
    </div>
}