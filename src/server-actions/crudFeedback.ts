"use server";

import pool from "@/lib/db"; // Adjust path if necessary
import { nanoid } from "nanoid";

type Result<T> = {
  success: boolean;
  message: string;
  data?: T;
};

export type Feedback = {
  id: string;
  user_id: string;
  rating: number;
  message: string;
  created_at: string;
};

export type FeedbackForm = Omit<Feedback, "id" | "created_at">;

// --- CREATE ---
export async function createFeedback(data: FeedbackForm): Promise<Result<Feedback>> {
  try {
    const id = nanoid(10);
    
    // Simple validation
    if (!data.rating || data.rating < 1 || data.rating > 5) {
      return { success: false, message: "Rating must be between 1 and 5" };
    }

    const result = await pool.query(
      `
      INSERT INTO public.feedbacks
        (id, user_id, rating, message)
      VALUES
        ($1, $2, $3, $4)
      RETURNING *;
      `,
      [
        id,
        data.user_id,
        data.rating,
        data.message ?? "",
      ]
    );

    return {
      success: true,
      message: "Feedback submitted successfully",
      data: result.rows[0] as Feedback,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// --- READ (All) ---
export async function getFeedbacks(): Promise<Result<Feedback[]>> {
  try {
    const result = await pool.query(`SELECT * FROM public.feedbacks ORDER BY created_at DESC`);
    return { success: true, message: "Feedbacks fetched successfully", data: result.rows as Feedback[] };
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// --- READ (One) ---
export async function getFeedbackById(id: string): Promise<Result<Feedback>> {
  try {
    const result = await pool.query(`SELECT * FROM public.feedbacks WHERE id = $1`, [id]);
    if (!result.rows[0]) return { success: false, message: `Feedback ${id} not found` };

    return { success: true, message: "Feedback fetched successfully", data: result.rows[0] as Feedback };
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// --- UPDATE ---
export async function updateFeedback(
  id: string,
  data: Partial<Omit<Feedback, "id" | "created_at">>
): Promise<Result<Feedback>> {
  try {
    const fields: string[] = [];
    const values: unknown[] = [];
    let i = 1;

    for (const [key, value] of Object.entries(data)) {
      if (key === "id" || key === "created_at") continue;
      fields.push(`${key} = $${i++}`);
      values.push(value);
    }

    values.push(id);

    const result = await pool.query(
      `
      UPDATE public.feedbacks
      SET ${fields.join(", ")}
      WHERE id = $${i}
      RETURNING *;
      `,
      values
    );

    if (!result.rows[0]) return { success: false, message: `Feedback ${id} not found` };

    return { success: true, message: "Feedback updated successfully", data: result.rows[0] as Feedback };
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// --- DELETE ---
export async function deleteFeedback(id: string): Promise<Result<Feedback>> {
  try {
    const result = await pool.query(`DELETE FROM public.feedbacks WHERE id = $1 RETURNING *`, [id]);
    if (!result.rows[0]) return { success: false, message: `Feedback ${id} not found` };

    return { success: true, message: "Feedback deleted successfully", data: result.rows[0] as Feedback };
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}