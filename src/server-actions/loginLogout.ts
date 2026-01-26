"use server"

import { signIn, signOut } from "@/auth";

export const LoginUser = async (credentials: {email:string,pass:string}, redirect: boolean = false) => {
    const { email, pass } = credentials;
    try {
        const redirectUrl = await signIn('credentials', { email, pass, redirectTo:"/lite", redirect: redirect });
        return {
            redirectUrl
        }

    } catch (error) {
        console.log(`${error}`, 'Error from LoginUser')
    }
};


export const LogoutUser = async () => {
   const res = await signOut()
   return res
   
}