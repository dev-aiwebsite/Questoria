import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { AuthenticateUser } from "./server-actions/authenticateUser";



export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        pass: {},
      },
      authorize: async (credentials) => {

        const user = await AuthenticateUser(credentials as {
          email: string;
          password: string;
          viaadmin?: boolean;
        })

        
        if (!user) return null
        return user

      },
    }),
  ], callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
      
        token.firstname = user.firstname;
        token.lastname = user.lastname;
        token.email = user.email;
        token.avatar = user.avatar ?? null;

        token.user_id = user.id;

        // Default to false until checked
        token.onboarding = user?.onboarding ?? false;
      }

     if (trigger === "update" && session) { 
        if (session.onboarding !== undefined) token.onboarding = session.onboarding;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
       
        session.user.id = token.id
        session.user.firstname = token.firstname
        session.user.lastname = token.lastname
        session.user.email = token.email
        session.user.avatar = token.avatar
        session.user.onboarding = token.onboarding
      }
      return session;
    }

  }
})