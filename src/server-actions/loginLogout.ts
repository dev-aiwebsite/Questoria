"use server"

import { signIn, signOut } from "@/auth";

export const LoginUser = async (credentials: {useremail:string,userpass:string}, redirect: boolean = false) => {
    const { useremail, userpass } = credentials;
    try {
        const redirectUrl = await signIn('credentials', { useremail, userpass, redirectTo:"/dashboard", redirect: redirect });
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