import { OnboardingQuestions } from "@/lib/dummy";
import ChoiceInput from "./choiceInput";

export default function QuestionWrapper({
    onSubmit,
    question,
    currentStep,
    value,
    onChange,
}: {
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
            ? typeof value === "string"
            : Array.isArray(value) && value.length > 0;



    return <div className="flex flex-col flex-nowrap justify-center p-mobile relative mt-mobile h-screen">
        <h2 className="text-2xl font-bold">{question.question}</h2>
        <div className="h-[100px] flex flex-row flex-nowrap items-center gap-2">
            <span className="rounded-full block w-6 h-6 bg-white flex items-center justify-center">
                <span className="h-3 w-3 bg-yellow-400 rounded-full"></span>
            </span>
            <span className="block flex-1 h-1 mt-1 border-t-1 border-dashed border-white"></span>
            <span className="rounded-full block w-6 h-6 bg-white flex items-center justify-center">
                {currentStep > 1 &&
                    <span className="h-3 w-3 bg-yellow-400 rounded-full"></span>
                }
            </span>
            <span className="block flex-1 h-1 mt-1 border-t-1 border-dashed border-white"></span>
            <span className="rounded-full block w-6 h-6 bg-white flex items-center justify-center">
                {currentStep > 2 &&
                    <span className="h-3 w-3 bg-yellow-400 rounded-full"></span>
                }
            </span>
        </div>
        <div className="space-y-4">
            <h3 className="header3 max-w-[250px]">{question.description}</h3>
            {question.choices.map((c) => (
                <ChoiceInput
                    key={c.id}
                    choice={c}
                    type={question.type}
                    name={`question-${currentStep}`}
                    checked={
                        question.type === "radio"
                            ? value === c.id
                            : Array.isArray(value) && value.includes(c.id)
                    }
                    onChange={() => {
                        if (question.type === "radio") {
                            onChange(c.id);
                        } else {
                            const current = Array.isArray(value) ? value : [];
                            onChange(
                                current.includes(c.id)
                                    ? current.filter((v) => v !== c.id)
                                    : [...current, c.id]
                            );
                        }
                    }}
                />
            ))}

        </div>
        <button
            onClick={handleSubmit}
            disabled={!isAnswered}
            className="w-fit mt-4 ml-auto font-bold min-w-[100px] primary input disabled:!bg-stone-300 disabled:cursor-not-allowed"
        >
            {isAnswered ? question.cta.active : question.cta.idle}
        </button>
    </div>
}