import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Copilot — Ambient knowledge companion",
  description:
    "Copilot listens during meetings, lectures, and workshops and turns the conversation into structured notes in real time.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-canvas text-ink">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
