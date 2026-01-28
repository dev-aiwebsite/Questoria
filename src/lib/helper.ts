
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

export function formatSeconds(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  // pad with zeros if needed
  const h = hours.toString().padStart(2, '0');
  const m = minutes.toString().padStart(2, '0');
  const s = seconds.toString().padStart(2, '0');

  return `${h}:${m}:${s}`;
}