import type { Metadata } from "next";
import { Bayon, Inter } from "next/font/google";
import "./globals.css";
import { AppRouterProvider } from "./contexts/appRouter";
import { Suspense } from "react";
import PageLoader from "@/components/pageLoader";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
const bayon = Bayon({
  subsets: ["latin"],
  variable: "--font-bayon",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Questoria",
  description: "mvp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${bayon.variable} antialiased bg-primary`}>
        <Suspense fallback={<PageLoader />}>
        <AppRouterProvider>
            {children}
        </AppRouterProvider>
        </Suspense>
      </body>
    </html>
  );
}
