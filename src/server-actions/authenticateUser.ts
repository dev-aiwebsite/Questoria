"use server"

// import bcrypt from 'bcrypt';
import { getUserByEmail, User } from './crudUser';



export const AuthenticateUser = async (credentials: { email: string; pass: string; viaadmin?: boolean }): Promise<User | null> => {
  try {
    const res = await getUserByEmail(credentials.email);
    const user = res.data
      console.log(res, 'res AuthenticateUser')
      console.log(credentials, 'credentials AuthenticateUser')
    if (!user) return null;

    const viaAdmin = credentials?.viaadmin || false;
    if (!viaAdmin) {
      // const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
      console.log(user.password, credentials.pass)
      const isPasswordCorrect = credentials.pass === user.password

      if (!isPasswordCorrect) return null;
    }

    return user;
  } catch {
    return null;
  }
};