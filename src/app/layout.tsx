import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CurrentUserProvider } from "./contexts/currentUserContext";

const fontFace = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
      <body
        className={`${fontFace.variable} antialiased`}
      >
        <CurrentUserProvider>
          {children}
        </CurrentUserProvider>
      </body>
    </html>
  );
}
