import { OnboardingQuestions } from "@/lib/dummy";
import InputChoices from "../inputChoices";
import React from "react";

export default function QuestionWrapper({
    count,
    onSubmit,
    question,
    currentStep,
    value,
    onChange,
}: {
    count:number;
    onSubmit: () => void;
    question: OnboardingQuestions;
    currentStep: number;
    value?: string | string[];
    onChange: (value: string | string[]) => void;
}) {


    function handleSubmit() {
        if (onSubmit) {
            onSubmit()
        }
    }

    const isAnswered =
        question.type === "radio"
            ? typeof value === "string" && value.trim() !== ""
            : Array.isArray(value) && value.length > 0;

    return <div className="flex flex-col flex-nowrap justify-center p-mobile pb-[3rem] relative mt-mobile h-screen">
        <div className="w-full h-fit max-h-screen overflow-auto">

            <h1 className="header1">{question.question}</h1>
            <div className="h-[100px] flex flex-row flex-nowrap items-center gap-2">
                {Array.from({ length: count }).map((_, index) => (
                <React.Fragment key={index}>
                    {/* Step circle */}
                    <span className="rounded-full block w-6 h-6 bg-white flex items-center justify-center">
                    {currentStep > index && (
                        <span className="h-3 w-3 bg-yellow-400 rounded-full"></span>
                    )}
                    </span>

                    {/* Connector (not after last step) */}
                    {index < count - 1 && (
                    <span className="block flex-1 h-1 mt-1 border-t-1 border-dashed border-white"></span>
                    )}
                </React.Fragment>
                ))}

            </div>
            <div className="space-y-4">
                <h3 className="header3 max-w-[300px]">{question.description}</h3>
                <InputChoices
                    name={`question-${currentStep}`}
                    isMultiple={question.type !== "radio"}
                    choices={question.choices}
                    onChange={(selectedIds) => {
                        if (question.type === "radio") {
                            onChange(selectedIds[0]); // radio → only first selected
                        } else {
                            onChange(selectedIds); // checkbox → array of selected
                        }
                    }}
                />

            </div>
            <button
                onClick={handleSubmit}
                disabled={!isAnswered}
                className="w-fit mt-4 ml-auto font-bold min-w-[100px] primary input disabled:!bg-stone-300 disabled:cursor-not-allowed"
            >
                {isAnswered ? question.cta.active : question.cta.idle}
            </button>
        </div>
    </div>
}