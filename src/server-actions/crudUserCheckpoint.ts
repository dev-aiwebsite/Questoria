"use server";

import pool from "@/lib/db";
import { nanoid } from "nanoid";

type Result<T> = {
  success: boolean;
  message: string;
  data?: T;
};

export type UserCheckpoint = {
  id: string;
  user_id: string;
  checkpoint_id: string;
  is_visited: boolean;
  selfie: string;
  quiz: string; 
  happiness: number;
  gems_collected: number;
};

// Form type omits 'id' since it's generated server-side
export type UserCheckpointForm = Omit<UserCheckpoint, "id">;

// --- CREATE ---
export async function createUserCheckpoint(data: UserCheckpointForm): Promise<Result<UserCheckpoint>> {
  try {
    const id = nanoid(10);

    const result = await pool.query(
      `
      INSERT INTO public.user_checkpoints
        (id, user_id, checkpoint_id, is_visited, selfie, quiz, happiness, gems_collected)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
      `,
      [
        id,
        data.user_id,
        data.checkpoint_id,
        data.is_visited ?? false,
        data.selfie ?? null,
        data.quiz ?? null,
        data.happiness ?? 0,
        data.gems_collected ?? 0,
      ]
    );

    return {
      success: true,
      message: "User Checkpoint created successfully",
      data: result.rows[0] as UserCheckpoint,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// --- READ (All) ---
export async function getUserCheckpoints(): Promise<Result<UserCheckpoint[]>> {
  try {
    const result = await pool.query(`SELECT * FROM public.user_checkpoints`);
    return {
      success: true,
      message: "User Checkpoints fetched successfully",
      data: result.rows as UserCheckpoint[],
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// --- READ (By ID) ---
export async function getUserCheckpointById(id: string): Promise<Result<UserCheckpoint>> {
  try {
    const result = await pool.query(`SELECT * FROM public.user_checkpoints WHERE id = $1`, [id]);
    
    if (!result.rows[0]) {
        return { success: false, message: `User Checkpoint ${id} not found` };
    }

    return {
      success: true,
      message: "User Checkpoint fetched successfully",
      data: result.rows[0] as UserCheckpoint,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// --- READ (By User ID) ---
// Helpful for fetching all checkpoints for a specific user
export async function getUserCheckpointsByUserId(userId: string): Promise<Result<UserCheckpoint[]>> {
  try {
    const result = await pool.query(
        `SELECT * FROM public.user_checkpoints WHERE user_id = $1`, 
        [userId]
    );
    
    return {
      success: true,
      message: "User Checkpoints fetched successfully",
      data: result.rows as UserCheckpoint[],
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// --- UPDATE ---
export async function updateUserCheckpoint(
  id: string,
  data: Partial<UserCheckpointForm>
): Promise<Result<UserCheckpoint>> {
  try {
    const fields: string[] = [];
    const values: unknown[] = [];
    let i = 1;

    for (const [key, value] of Object.entries(data)) {
      if (key === "id") continue; // Skip ID in update fields
      fields.push(`${key} = $${i++}`);
      values.push(value);
    }

    // If no data to update, return early
    if (fields.length === 0) {
        return { success: false, message: "No data provided for update" };
    }

    values.push(id);

    const result = await pool.query(
      `
      UPDATE public.user_checkpoints
      SET ${fields.join(", ")}
      WHERE id = $${i}
      RETURNING *;
      `,
      values
    );

    if (!result.rows[0]) {
        return { success: false, message: `User Checkpoint ${id} not found` };
    }

    return {
      success: true,
      message: "User Checkpoint updated successfully",
      data: result.rows[0] as UserCheckpoint,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// --- DELETE ---
export async function deleteUserCheckpoint(id: string): Promise<Result<UserCheckpoint>> {
  try {
    const result = await pool.query(
        `DELETE FROM public.user_checkpoints WHERE id = $1 RETURNING *`, 
        [id]
    );
    
    if (!result.rows[0]) {
        return { success: false, message: `User Checkpoint ${id} not found` };
    }

    return {
      success: true,
      message: "User Checkpoint deleted successfully",
      data: result.rows[0] as UserCheckpoint,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}