import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function getAuthToken(req: NextRequest) {
  const isLocalhost = process.env.NODE_ENV !== "production";
  return getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    ...(isLocalhost
      ? {}
      : { cookieName: "__Secure-authjs.session-token", secureCookie: true }),
  });
}
