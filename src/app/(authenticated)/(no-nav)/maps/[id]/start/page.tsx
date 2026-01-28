"use client"
import { useCurrentUserContext } from "@/contexts/currentUserContext";
import Clouds from "@/components/clouds";
import QuestionWrapper from "@/components/questions/questionWrapper";
import { onboardingQuestions } from "@/lib/dummy";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
type Answers = {
    1: string;
    2: string[];
    3: string
} | null

export default function Page() {
    const { id } = useParams<{ id: string }>();
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
    const { userMaps, setUserMaps, userOnboarding} = useCurrentUserContext()

    const [answers, setAnswers] = useState<Answers>({ 1: "", 2: [], 3: "" });
    const questionCount = onboardingQuestions.length
    const router = useRouter()
    const currentMap = userMaps?.find(m => m.map_id == id)

    function handleSubmit() {
        const newStep = currentStep + 1
        if (newStep > questionCount) {
            if (userMaps && answers) {
                if (userMaps && answers) {
                    const newData = [...userMaps];   
                    setUserMaps(newData);
                }
            }

            router.push(`/maps/${id}/checkpoints`)
        } else {
            setCurrentStep(newStep as 1 | 2 | 3)
        }
    }


    const questionAnswers = userOnboarding?.answers.map(a => a.value) ?? []
    const isCleared = questionAnswers.length >= 3

    useEffect(() => {
        if (isCleared) {
            router.push(`/maps/${id}/checkpoints`)
        }
    }, [])


    return (<>
        <Clouds className="opacity-50 absolute -z-0" />
        <div>
            {!isCleared && 
        <QuestionWrapper
            count={3}
            onSubmit={handleSubmit}
            question={onboardingQuestions[currentStep - 1]}
            currentStep={currentStep}
            value={answers ? answers[currentStep] : ""}
            onChange={(value) => {
                setAnswers((prev) => ({
                    // if prev is null, initialize with empty defaults
                    ...(prev || { 1: "", 2: [], 3: "" }),
                    [currentStep]: value, // dynamic key based on current step
                }));
            }}

        />
        }
        </div>

    </>
    );
}

