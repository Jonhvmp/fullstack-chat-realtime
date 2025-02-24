import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import { AuthProvider } from "@/contexts/auth/AuthContext";
import { Navbar } from "@/components/navbar/navbar";
import { ClientProviders } from "@src/components/ClientProviders";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chat Realtime",
  description: "A realtime chat application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <AuthProvider>
          <ClientProviders>
              <div className="flex flex-col h-full">
                <Navbar />
                <main className="flex-1 overflow-hidden">{children}</main>
            </div>
              <Toaster richColors position="bottom-right" />
            </ClientProviders>
        </AuthProvider>
      </body>
    </html>
  );
}
