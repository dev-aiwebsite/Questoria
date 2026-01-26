// next-auth.d.ts
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      firstname: string;
      lastname: string;
      email: string;
      avatar: string | null;
      onboarding: boolean;
    };
  }

  interface User {
     id: string;
    firstname: string;
    lastname: string;
    email: string;
    avatar: string | null;
    onboarding: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
      firstname: string;
      lastname: string;
      email: string;
      avatar: string | null;
      onboarding: boolean;
  }
}
