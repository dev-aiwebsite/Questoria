import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
