"use client"


import ARCamera from "@/components/ARCamera";
import HappinessRating from "@/components/HappinessRating";
import InputChoices from "@/components/inputChoices";
import { CheckpointQuizData, checkpoints } from "@/lib/dummy";
import { isCheckpointQuiz } from "@/lib/helper";
import { IconCameraAdd } from "@/lib/icons/icons";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function Page() {
    const [openQuiz, setOpenQuiz] = useState(false)
    const [quizAnswer, setQuizAnswer] = useState("")
    const [ARImage, setARImage] = useState("")
    const [openCamera, setOpenCamera] = useState(false)
    const { checkpointId } = useParams<{ checkpointId: string }>();
    const checkpointData = checkpoints.find(c => c.id == checkpointId)
    const challengesData = checkpointData?.challenges

    const challenge = challengesData?.[1];

    const isQuizAnswerCorrect =
        challenge && isCheckpointQuiz(challenge)
            ? quizAnswer === challenge.correct_answer
            : false;

    return (
        <div className="p-mobile space-y-8">
            {!challengesData || challengesData.length == 0 ? <>This map has no challenges available.</> :
                <>
                    <h3 className="header3 text-center !mb-8">3 Ways to clear this checkpoint (optional)</h3>
                    <div className="space-y-4">
                        <p className="text-sm">1. <span dangerouslySetInnerHTML={{ __html: challengesData[0].description }}></span>
                        </p>
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
                                        if (v) {
                                            setARImage(v)
                                        }
                                        setOpenCamera(false)
                                    }} />
                                </div>

                            }
                        </div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-sm">2. <span dangerouslySetInnerHTML={{ __html: challengesData[1].description }}></span></p>
                        <button
                            disabled={isQuizAnswerCorrect}
                            onClick={() => setOpenQuiz(true)} className="btn primary w-full !border-1 ">{isQuizAnswerCorrect ? "Passed 100%" : "Begin Quiz"}</button>

                        {openQuiz &&
                            <Quiz
                                quizData={challengesData[1] as CheckpointQuizData}
                                onSubmit={(e) => {
                                    setQuizAnswer(e[0])
                                    setOpenQuiz(false)
                                }} />
                        }
                    </div>

                    <div className="space-y-4">
                        <p className="text-sm">3. <span dangerouslySetInnerHTML={{ __html: challengesData[2].description }}></span></p>
                        <HappinessRating />
                    </div>

                    <div className="flex flex-row flex-nowrap items-center justify-end gap-6">
                        <Link
                        className="text-lg font-bold underline"
                        href="#"

                        >Skip</Link>
                        <button className="btn primary float-right text-lg w-[120px]">Submit</button>

                    </div>
                </>}
        </div>
    );
}

function Quiz({ quizData, onSubmit }: { quizData: CheckpointQuizData, onSubmit: (e: string[]) => void }) {
    const [selected, setSelected] = useState([""])
    const choices = quizData.choices;

    function handleSubmit() {
        if (onSubmit) {
            onSubmit(selected)
        }
    }
    return <div className="flex p-mobile w-screen h-screen backdrop-blur-[2px] bg-black/10 absolute z-[999999] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="p-10 min-h-fit h-[70vh] flex flex-col flex-nowrap justify-center bg-white rounded-xl border border-black m-auto">
            <h3 className="header3">{quizData.question}</h3>
            <div>
                <InputChoices
                    name="challenge_quiz"
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