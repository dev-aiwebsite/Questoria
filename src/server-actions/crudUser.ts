"use server";

import pool from "@/lib/db";
import { PsqlError } from "@/types/psql";
import { nanoid } from "nanoid";

type Result<T> = {
  code?: string;
  success: boolean;
  message: string;
  data?: T;
};

export type User = {
  id: string;
  username:string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  avatar: string | null;
  xp: number | null;
  gems: number | null;
  onboarding: boolean;
  created_at: string;
};

export type UserForm = Omit<User, "id" | "created_at">;

export async function createUser(data: UserForm): Promise<Result<User>> {
  try {
    const id = nanoid(10);

    const result = await pool.query(
      `
      INSERT INTO public.users
        (id, username, firstname, lastname, email, password, avatar, xp, gems, onboarding)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
      `,
      [
        id,
        data.username ?? "",
        data.firstname ?? null,
        data.lastname ?? null,
        data.email ?? null,
        data.password ?? null,
        data.avatar ?? null,
        data.xp ?? 0,
        data.gems ?? 0,
        data.onboarding ?? false,
      ]
    );

    return {
      success: true,
      message: "User created successfully",
      data: result.rows[0] as User,
    };
  } catch (error: unknown) {
    
    return {
      code: error instanceof Error ? (error as unknown as PsqlError).code : "UNKNOWN_ERROR",
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getUsers(): Promise<Result<User[]>> {
  try {
    const result = await pool.query(`SELECT * FROM public.users ORDER BY created_at DESC`);
    return { success: true, message: "Users fetched successfully", data: result.rows as User[] };
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getUserById(id: string): Promise<Result<User>> {
  try {
    const result = await pool.query(`SELECT * FROM public.users WHERE id = $1`, [id]);
    if (!result.rows[0]) return { success: false, message: `User ${id} not found` };

    return { success: true, message: "User fetched successfully", data: result.rows[0] as User };
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
export async function getUserByEmail(email: string): Promise<Result<User>> {
  try {
    const result = await pool.query(`SELECT * FROM public.users WHERE email = $1`, [email]);
    if (!result.rows[0]) return { success: false, message: `User ${email} not found` };

    return { success: true, message: "User fetched successfully", data: result.rows[0] as User };
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateUser(
  id: string,
  data: Partial<Omit<User, "id" | "created_at">>
): Promise<Result<User>> {
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
      UPDATE public.users
      SET ${fields.join(", ")}, created_at = created_at
      WHERE id = $${i}
      RETURNING *;
      `,
      values
    );

    if (!result.rows[0]) return { success: false, message: `User ${id} not found` };

    return { success: true, message: "User updated successfully", data: result.rows[0] as User };
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deleteUser(id: string): Promise<Result<User>> {
  try {
    const result = await pool.query(`DELETE FROM public.users WHERE id = $1 RETURNING *`, [id]);
    if (!result.rows[0]) return { success: false, message: `User ${id} not found` };

    return { success: true, message: "User deleted successfully", data: result.rows[0] as User };
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
