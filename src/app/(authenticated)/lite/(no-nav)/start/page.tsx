"use client";
import { useSession } from "next-auth/react";
import { useCurrentUserContext } from "@/app/contexts/currentUserContext";
import Clouds from "@/components/clouds";
import QuestionWrapper from "@/components/questions/questionWrapper";
import { onboardingQuestions } from "@/lib/dummy";
import { createUserOnboardingAnswer, updateUserOnboardingAnswer } from "@/server-actions/crudUserOnboarding";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { updateUser } from "@/server-actions/crudUser";
import { useAppRouter } from "@/app/contexts/appRouter";

type AnswerItem = {
  question_id: string;
  value: string | string[];
};

type AnswersState = AnswerItem[];

export default function Page() {
  const { update, data:session } = useSession();
  const { setCurrentUser, currentUser, setUserOnboarding, userOnboarding } = useCurrentUserContext();
  const [currentStep, setCurrentStep] = useState(1);

  // UI state (not DB state)
  const [answers, setAnswers] = useState<AnswersState>(
    userOnboarding?.answers ?? []
  );

  const questions = onboardingQuestions.filter(q => q.id !== "nm439s2");
  const questionCount = questions.length;
  const router = useAppRouter();

  async function handleSubmit(setIsSuccess: Dispatch<SetStateAction<boolean>>, setIsLoading: React.Dispatch<React.SetStateAction<boolean>>) {
    if(!currentUser) return
    const newStep = currentStep + 1;

    if (newStep > questionCount) {
      setIsLoading(true)
        try {
            const res = userOnboarding ? await updateUserOnboardingAnswer(userOnboarding.id, {...userOnboarding,answers}): await createUserOnboardingAnswer({answers, user_id: currentUser.id})
            
            if(!res.success) return
            
            const updateUserRes = await updateUser(currentUser.id, {onboarding: true})
            
            
            if(res.data && updateUserRes.data){
                setUserOnboarding(res.data)
                const resUpdateSession = await update({ onboarding: true });
                console.log(resUpdateSession, 'resUpdateSession')
                setCurrentUser(updateUserRes.data)

                setIsSuccess(true)
                router.push("/lite")
            }
            
        } catch (error) {
            console.log(error)
            setIsSuccess(false)
        } finally {
          setIsLoading(false)
        }  


    } else {
      setCurrentStep(newStep);
    }
  }

  const isCleared = session ? session.user.onboarding : false

  useEffect(() => {
    if (isCleared) {
      router.push(`/lite`);
    }
  }, [isCleared]);

  return (
    <div  className="bg-primary absolute top-0">
      <Clouds className="opacity-50 absolute -z-0" />
      
        {!isCleared && (
          <QuestionWrapper
            count={questionCount}
            onSubmit={handleSubmit}
            question={questions[currentStep - 1]}
            currentStep={currentStep}
            value={
              answers.find(a => a.question_id === questions[currentStep - 1].id)
                ?.value ?? ""
            }
            onChange={(value) => {
              const questionId = questions[currentStep - 1].id;

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
    
  );
}
