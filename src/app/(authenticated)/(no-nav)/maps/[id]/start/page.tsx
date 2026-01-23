"use client"
import { useCurrentUserContext } from "@/app/contexts/currentUserContext";
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
    const { maps, setMaps } = useCurrentUserContext()

    const [answers, setAnswers] = useState<Answers>({ 1: "", 2: [], 3: "" });
    const questionCount = onboardingQuestions.length
    const router = useRouter()
    const currentMap = maps?.find(m => m.map_id == id)

    function handleSubmit() {
        const newStep = currentStep + 1
        if (newStep > questionCount) {
            if (maps && answers) {
                if (maps && answers) {
                    const newData = [...maps];
                    const mapIndex = newData.findIndex(m => m.map_id == id);
                    if (mapIndex != -1) {
                        newData[mapIndex].onboarding_questions.nm439s1 = answers[1] as string;
                        newData[mapIndex].onboarding_questions.nm439s2 = (answers[2] as string[]).join(",");
                        newData[mapIndex].onboarding_questions.nm439s3 = answers[3] as string;
                    }
                    setMaps(newData);
                }
            }

            router.push(`/maps/${id}/checkpoints`)
        } else {
            setCurrentStep(newStep as 1 | 2 | 3)
        }
    }


    const questionAnswers = currentMap ? Object.values(currentMap.onboarding_questions).filter(Boolean) : []
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

