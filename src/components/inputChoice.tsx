import { ReactNode } from "react";

export default function InputChoice({
  id,
  isMultiple,
  name,
  checked,
  onChange,
  text
}: {
  id:string;
  isMultiple: boolean;
  name: string;
  checked: boolean;
  text:ReactNode;
  onChange: () => void;
}) {
  return (
    <label
      htmlFor={id}
      className="bg-white block cursor-pointer rounded-2xl border border-black p-4 has-checked:bg-yellow-50 has-checked:font-bold has-checked:border-current has-checked:text-yellow-600"
    >
      <input
        id={id}
        type={isMultiple ? "checkbox" : "radio"}
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      {text}
    </label>
  );
}
