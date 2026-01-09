import { OnboardingQuestionsChoices } from "@/lib/dummy";

export default function ChoiceInput({
  choice,
  type,
  name,
  checked,
  onChange,
}: {
  choice: OnboardingQuestionsChoices;
  type: "checkbox" | "radio";
  name: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      htmlFor={choice.id}
      className="bg-white block cursor-pointer rounded-2xl border border-black p-4 has-checked:bg-yellow-50 has-checked:font-bold has-checked:border-current has-checked:text-yellow-600"
    >
      <input
        id={choice.id}
        type={type}
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      {choice.text}
    </label>
  );
}
