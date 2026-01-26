"use server"

import bcrypt from 'bcrypt';
import { getUserByEmail, User } from './crudUser';



export const AuthenticateUser = async (credentials: { email: string; password: string; viaadmin?: boolean }): Promise<User | null> => {
  try {
    const { data: user } = await getUserByEmail(credentials?.email);
    if (!user) return null;

    const viaAdmin = credentials?.viaadmin || false;
    if (!viaAdmin) {
      const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
      if (!isPasswordCorrect) return null;
    }

    return user;
  } catch {
    return null;
  }
};