
import { twMerge } from "tailwind-merge"
import { checkpointChallenges, CheckpointQuizData } from "./dummy";

export type ClassValue = string | number | bigint | boolean | null | undefined | ClassDictionary | ClassValue[];
export interface ClassDictionary { [key: string]: boolean | null | undefined }
export const clsx = (...args: ClassValue[]): string =>
  args.flatMap(a =>
    !a ? [] :
    typeof a === "string" || typeof a === "number" || typeof a === "bigint" ? [String(a)] :
    Array.isArray(a) ? clsx(...a).split(" ") :
    typeof a === "object" ? Object.entries(a).filter(([,v])=>v).map(([k])=>k) :
    []
  ).join(" ");
export default clsx;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isCheckpointQuiz(
  challenge: checkpointChallenges
): challenge is CheckpointQuizData {
  return "choices" in challenge;
}