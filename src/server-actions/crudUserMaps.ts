"use server";

import pool from "@/lib/db";
import { nanoid } from "nanoid";

type Result<T> = {
  success: boolean;
  message: string;
  data?: T;
};

export type UserMap = {
  id: string;
  user_id: string;
  map_id: string;
  is_completed: boolean | null;
  completion_time_seconds: number;
  created_at: string;
};

export type UserMapForm = Omit<UserMap, "id" | "created_at">;

// CREATE
export async function createUserMap(data: UserMapForm): Promise<Result<UserMap>> {
  try {
    const id = nanoid(10);

    const result = await pool.query(
      `
      INSERT INTO public.user_maps
        (id, user_id, map_id, is_completed, completion_time_seconds)
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING *;
      `,
      [
        id,
        data.user_id,
        data.map_id,
        data.is_completed ?? false,
        data.completion_time_seconds ?? 0,
      ]
    );

    return {
      success: true,
      message: "User map entry created successfully",
      data: result.rows[0] as UserMap,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// READ ALL
export async function getUserMaps(): Promise<Result<UserMap[]>> {
  try {
    const result = await pool.query(`SELECT * FROM public.user_maps ORDER BY created_at DESC`);
    return { 
      success: true, 
      message: "User maps fetched successfully", 
      data: result.rows as UserMap[] 
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// READ BY ID
export async function getUserMapById(id: string): Promise<Result<UserMap>> {
  try {
    const result = await pool.query(`SELECT * FROM public.user_maps WHERE id = $1`, [id]);
    if (!result.rows[0]) return { success: false, message: `Map record ${id} not found` };

    return { 
      success: true, 
      message: "User map fetched successfully", 
      data: result.rows[0] as UserMap 
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// READ BY USER (Helpful for fetching a user's progress)
export async function getUserMapsByUserId(userId: string): Promise<Result<UserMap[]>> {
  try {
    const result = await pool.query(
      `SELECT * FROM public.user_maps WHERE user_id = $1 ORDER BY created_at DESC`, 
      [userId]
    );
    return { 
      success: true, 
      message: "User's maps fetched successfully", 
      data: result.rows as UserMap[] 
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// UPDATE
export async function updateUserMap(
  id: string,
  data: Partial<UserMapForm>
): Promise<Result<UserMap>> {
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
      UPDATE public.user_maps
      SET ${fields.join(", ")}
      WHERE id = $${i}
      RETURNING *;
      `,
      values
    );

    if (!result.rows[0]) return { success: false, message: `Map record ${id} not found` };

    return { 
      success: true, 
      message: "User map updated successfully", 
      data: result.rows[0] as UserMap 
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// DELETE
export async function deleteUserMap(id: string): Promise<Result<UserMap>> {
  try {
    const result = await pool.query(`DELETE FROM public.user_maps WHERE id = $1 RETURNING *`, [id]);
    if (!result.rows[0]) return { success: false, message: `Map record ${id} not found` };

    return { 
      success: true, 
      message: "User map deleted successfully", 
      data: result.rows[0] as UserMap 
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}