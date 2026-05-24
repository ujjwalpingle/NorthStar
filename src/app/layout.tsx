import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { AppProvider } from "@/contexts/app-context";
import { AuthGuard } from "@/components/auth-guard";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NorthStar — Ujjwal's Personal Tracker",
  description: "Personal dashboard to track net worth and European migration journey.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full font-sans antialiased">
        <AuthGuard>
          <AppProvider>{children}</AppProvider>
        </AuthGuard>
      </body>
    </html>
  );
}
