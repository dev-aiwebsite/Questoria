"use client"


import { useCurrentUserContext } from "@/app/contexts/currentUserContext";
import ARCamera from "@/components/ARCamera";
import HappinessRating from "@/components/HappinessRating";
import InputChoices from "@/components/inputChoices";
import { CheckpointQuizData, checkpoints, currentUserId } from "@/lib/dummy";
import { isCheckpointQuiz } from "@/lib/helper";
import { IconCameraAdd } from "@/lib/icons/icons";
import { CircleCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function Page() {
    const { id: mapId } = useParams<{ id: string }>();
    const { checkpointId } = useParams<{ checkpointId: string }>();
    const {setCheckpoints, checkpoints:user_checkpoints} = useCurrentUserContext()
    const currentUserCheckpoints = user_checkpoints?.filter(uc => uc.user_id === currentUserId)
    const currentUserCheckpoint = currentUserCheckpoints?.find(c => c.checkpoint_id === checkpointId)
    const currentUserChallenges = currentUserCheckpoint?.challenges
    const currentUserChallengesAnswers = currentUserChallenges ? Object.values(currentUserChallenges).filter(Boolean) : []

    const [ARImage, setARImage] = useState(currentUserChallenges?.selfie || "")
    const [quizAnswer, setQuizAnswer] = useState(currentUserChallenges?.quiz || "")
    const [happinessVal, setHappinessVal] = useState<number | undefined>(currentUserChallenges?.happiness)
    const [isCleared, setIsCleared] = useState(currentUserChallengesAnswers.length >= 3)
    const [openQuiz, setOpenQuiz] = useState(false)
    const [openCamera, setOpenCamera] = useState(false)


    const checkpointData = checkpoints.find(c => c.id == checkpointId)
    const challengesData = checkpointData?.challenges


    const challenge = challengesData?.[1];

    const isQuizAnswerCorrect =
        challenge && isCheckpointQuiz(challenge)
            ? quizAnswer === challenge.correct_answer
            : false;


    function handleSubmit() {
        // check data
        // add logic for saving to database
        if(currentUserCheckpoints){
            const currentCheckpointIndex = currentUserCheckpoints.findIndex(c => c.checkpoint_id == checkpointId)
            if(currentCheckpointIndex !== -1 && user_checkpoints){
                const newValue = [...user_checkpoints]
                newValue[currentCheckpointIndex].challenges.selfie = ARImage
                newValue[currentCheckpointIndex].challenges.quiz = quizAnswer
                newValue[currentCheckpointIndex].challenges.happiness = happinessVal || 0
                setCheckpoints(newValue)
            }

        }

        if (!ARImage || !quizAnswer || !happinessVal) {
            setIsCleared(false)
        } else {
            setIsCleared(true)
        }

    }

    return (
        <>
            {!challengesData || challengesData.length == 0 ? <>This map has no challenges available.</> :
                <>
                    {!isCleared ? <div className="p-mobile space-y-8">
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
                            <HappinessRating value={happinessVal} onChange={(v) => setHappinessVal(v)} />
                        </div>

                        <div className="flex flex-row flex-nowrap items-center justify-end gap-6">
                            <Link
                                className="text-lg font-bold underline"
                                href="#"

                            >Skip</Link>
                            <button onClick={handleSubmit} className="btn primary float-right text-lg w-[120px]">Submit</button>

                        </div>
                    </div>
                        : <div className="p-mobile height-with-header-nav flex w-full h-full flex-col items-center justify-between">
                            <div></div>
                            <div>
                                <h2 className="header2 text-center">Checkpoint Cleared!</h2>
                                <CircleCheck className="fill-yellow-400 mb-10" size={250} strokeWidth={1} />
                            </div>
                            <Link
                                href={`/maps/${mapId}/checkpoints/`}
                                className="btn primary ml-auto text-lg w-[120px]">Next</Link>
                        </div>
                    }
                </>}
        </>

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