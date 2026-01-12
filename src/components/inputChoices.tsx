"use client";

import { useState, ReactNode } from "react";
import InputChoice from "./inputChoice";


export type Choice = {
  id: string;
  text: ReactNode;
};

type InputChoicesProps = {
  name: string;
  isMultiple?: boolean;
  choices: Choice[];
  onChange?: (selectedIds: string[]) => void;
};

export default function InputChoices({
  name,
  isMultiple = false,
  choices,
  onChange,
}: InputChoicesProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleChange = (id: string) => {
    let updated: string[] = [];

    if (isMultiple) {
      if (selectedIds.includes(id)) {
        updated = selectedIds.filter((s) => s !== id);
      } else {
        updated = [...selectedIds, id];
      }
    } else {
      updated = [id];
    }

    setSelectedIds(updated);
    onChange?.(updated);
  };

  return (
    <div className="space-y-4">
      {choices.map((choice) => (
        <InputChoice
          key={choice.id}
          id={choice.id}
          name={name}
          isMultiple={isMultiple}
          checked={selectedIds.includes(choice.id)}
          onChange={() => handleChange(choice.id)}
          text={choice.text}
        />
      ))}
    </div>
  );
}
