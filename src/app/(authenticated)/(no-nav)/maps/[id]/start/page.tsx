"use client"
import Clouds from "@/components/clouds";
import QuestionWrapper from "@/components/questions/questionWrapper";
import { onboardingQuestions } from "@/lib/dummy";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
type Answer = string | string[];
export default function Page() {
    const { id } = useParams<{ id: string }>();
    const [currentStep, setCurrentStep] = useState(1)
    
    const [answers, setAnswers] = useState<Record<number, Answer>>({});
    const questionCount = onboardingQuestions.length
    const router = useRouter()

    function handleSubmit() {
        const newStep = currentStep + 1
        if (newStep > questionCount) {
            router.push(`/maps/${id}/checkpoints`)
        } else {
            setCurrentStep(newStep)
        }
    }

    console.log(answers)

    return (<>
        <Clouds className="opacity-50 absolute -z-0" />
        <QuestionWrapper
            onSubmit={handleSubmit}
            question={onboardingQuestions[currentStep - 1]}
            currentStep={currentStep}
            value={answers[currentStep]}
            onChange={(value) =>
                setAnswers((prev) => ({
                    ...prev,
                    [currentStep]: value,
                }))
            }
        />

    </>
    );
}

