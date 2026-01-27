"use server";

import pool from "@/lib/db";
import { nanoid } from "nanoid";

type Result<T> = {
  success: boolean;
  message: string;
  data?: T;
};

export type OnboardingAnswerItem = {
  question_id: string;
  value: string | string[];
};

export type UserOnboardingAnswer = {
  id: string;
  user_id: string;
  answers: OnboardingAnswerItem[];
  created_at: string;
};

export type UserOnboardingAnswerForm = Omit<UserOnboardingAnswer, "id" | "created_at">;

export async function createUserOnboardingAnswer(
  data: UserOnboardingAnswerForm
): Promise<Result<UserOnboardingAnswer>> {
  try {
    const id = nanoid(10);

    const result = await pool.query(
      `
      INSERT INTO public.user_onboarding_answer
        (id, user_id, answers)
      VALUES
        ($1, $2, $3)
      RETURNING *;
      `,
      [
        id,
        data.user_id,
        JSON.stringify(data.answers ?? []),
      ]
    );

    return {
      success: true,
      message: "User onboarding answer created successfully",
      data: result.rows[0] as UserOnboardingAnswer,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getUserOnboardingAnswers(): Promise<Result<UserOnboardingAnswer[]>> {
  try {
    const result = await pool.query(
      `SELECT * FROM public.user_onboarding_answer ORDER BY created_at DESC`
    );
    return {
      success: true,
      message: "User onboarding answers fetched successfully",
      data: result.rows as UserOnboardingAnswer[],
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getUserOnboardingAnswerById(
  id: string
): Promise<Result<UserOnboardingAnswer>> {
  try {
    const result = await pool.query(
      `SELECT * FROM public.user_onboarding_answer WHERE id = $1`,
      [id]
    );

    if (!result.rows[0]) return { success: false, message: `Answer ${id} not found` };

    return {
      success: true,
      message: "User onboarding answer fetched successfully",
      data: result.rows[0] as UserOnboardingAnswer,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
export async function getUserOnboardingAnswerByUserId(
  user_id: string
): Promise<Result<UserOnboardingAnswer>> {
  try {
    const result = await pool.query(
      `SELECT * FROM public.user_onboarding_answer WHERE user_id = $1`,
      [user_id]
    );

    if (!result.rows[0]) return { success: false, message: `Answer ${user_id} not found` };

    return {
      success: true,
      message: "User onboarding answer fetched successfully",
      data: result.rows[0] as UserOnboardingAnswer,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateUserOnboardingAnswer(
  id: string,
  data: Partial<Omit<UserOnboardingAnswer, "id" | "created_at">>
): Promise<Result<UserOnboardingAnswer>> {
  try {
    const fields: string[] = [];
    const values: unknown[] = [];
    let i = 1;

    for (const [key, value] of Object.entries(data)) {
      if (key === "id" || key === "created_at") continue;
      fields.push(`${key} = $${i++}`);
      if(key == 'answers'){
        values.push(JSON.stringify(value));
      }else {

        values.push(value);
      }
    }

    values.push(id);

    const result = await pool.query(
      `
      UPDATE public.user_onboarding_answer
      SET ${fields.join(", ")}, created_at = created_at
      WHERE id = $${i}
      RETURNING *;
      `,
      values
    );

    if (!result.rows[0])
      return { success: false, message: `Answer ${id} not found` };

    return {
      success: true,
      message: "User onboarding answer updated successfully",
      data: result.rows[0] as UserOnboardingAnswer,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deleteUserOnboardingAnswer(
  id: string
): Promise<Result<UserOnboardingAnswer>> {
  try {
    const result = await pool.query(
      `DELETE FROM public.user_onboarding_answer WHERE id = $1 RETURNING *`,
      [id]
    );

    if (!result.rows[0])
      return { success: false, message: `Answer ${id} not found` };

    return {
      success: true,
      message: "User onboarding answer deleted successfully",
      data: result.rows[0] as UserOnboardingAnswer,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
