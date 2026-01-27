import { getAuthToken } from '@/lib/getAuthToken';
import { NextRequest, NextResponse } from 'next/server';


export async function proxy(req: NextRequest) {
  const token = await getAuthToken(req);
  const isTestMode = process.env.TEST_MODE === "true";

  if (!isTestMode) {

    const pathname = req.nextUrl.pathname;

    if (
      pathname.startsWith("/manifest.webmanifest") ||
      pathname.startsWith("/favicon") ||
      pathname.startsWith("/apple-touch-icon") ||
      pathname.startsWith("/_next") ||
      pathname.startsWith("/assets") // if you have images/assets
    ) {
      return NextResponse.next();
    }

    const isAuthPage = ["/login", "/signup", "/password-reset"].some(p => pathname.startsWith(p));
    const isHome = pathname === "/";
    const isUnrestrictedPage = ["/embed"].some(p => pathname.startsWith(p));
    const isOnboardingPage = pathname.startsWith("/lite/start");
    const isProtectedPage = !isAuthPage && !isUnrestrictedPage;

    if (!token) {
      if (isProtectedPage) return NextResponse.redirect(new URL("/login", req.url));
      return NextResponse.next();
    }

    if (!isAuthPage && !isUnrestrictedPage) {
      if (!token.onboarding && !isOnboardingPage) {
        return NextResponse.redirect(new URL("/lite/start", req.url));
      }

      if (token.onboarding && isOnboardingPage) {
        return NextResponse.redirect(new URL("/lite", req.url));
      }
    }

    if (isHome || isAuthPage) {
      return NextResponse.redirect(new URL("/lite", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|.*\\.png$|.*\\.svg$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|public|sw\\.js).*)",
};