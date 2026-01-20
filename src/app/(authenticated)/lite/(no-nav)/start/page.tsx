"use client";

import { useCurrentUserContext } from "@/app/contexts/currentUserContext";
import Clouds from "@/components/clouds";
import QuestionWrapper from "@/components/questions/questionWrapper";
import { onboardingQuestions } from "@/lib/dummy";
import { createUserOnboardingAnswer, updateUserOnboardingAnswer } from "@/server-actions/crudUserOnboarding";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type AnswerItem = {
  question_id: string;
  value: string | string[];
};

type AnswersState = AnswerItem[];

export default function Page() {
  const { currentUser, setUserOnboarding, userOnboarding } = useCurrentUserContext();
  const [currentStep, setCurrentStep] = useState(1);

  // UI state (not DB state)
  const [answers, setAnswers] = useState<AnswersState>(
    userOnboarding?.answers ?? []
  );

  const questions = onboardingQuestions.filter(q => q.id !== "nm439s2");
  const questionCount = questions.length;
  const router = useRouter();

  async function handleSubmit() {
    if(!currentUser) return
    const newStep = currentStep + 1;

    if (newStep > questionCount) {
      // final submit logic here
        try {
            const res = userOnboarding ? await updateUserOnboardingAnswer(userOnboarding.id, {...userOnboarding,answers}): await createUserOnboardingAnswer({answers, user_id: currentUser?.id})
         
            if(res.data){
                setUserOnboarding(res.data)
                router.push("/lite")
            }
            
        } catch (error) {
            console.log(error)
        }  

    } else {
      setCurrentStep(newStep as 1 | 2 | 3);
    }
  }

  const questionAnswers = questions.map(q => {
    const found = answers.find(a => a.question_id === q.id);
    return found?.value ?? null;
  });

  const isCleared = questionAnswers.every(ans => ans !== null && ans !== "");

  useEffect(() => {
    if (currentUser?.onboarding) {
      router.push(`/lite`);
    }
  }, []);

  return (
    <>
      <Clouds className="opacity-50 absolute -z-0" />
      <div>
        {!isCleared && (
          <QuestionWrapper
            onSubmit={handleSubmit}
            question={onboardingQuestions[currentStep - 1]}
            currentStep={currentStep}
            value={
              answers.find(a => a.question_id === onboardingQuestions[currentStep - 1].id)
                ?.value ?? ""
            }
            onChange={(value) => {
              const questionId = onboardingQuestions[currentStep - 1].id;

              setAnswers(prev => {
                const existing = prev.findIndex(a => a.question_id === questionId);

                if (existing !== -1) {
                  const newArr = [...prev];
                  newArr[existing] = { question_id: questionId, value };
                  return newArr;
                }

                return [...prev, { question_id: questionId, value }];
              });
            }}
          />
        )}
      </div>
    </>
  );
}
