import type { Metadata } from "next";
import { Bayon, Inter } from "next/font/google";
import "./globals.css";
import { CurrentUserProvider } from "./contexts/currentUserContext";
import { AppDataProvider } from "./contexts/appDataContext";


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
      <body
        className={`${inter.variable} ${bayon.variable} antialiased`}
      >
        <AppDataProvider>
          <CurrentUserProvider>
            {children}
          </CurrentUserProvider>
        </AppDataProvider>
      </body>
    </html>
  );
}
