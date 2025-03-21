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
    <html lang="en" className="min-h-screen">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
      >
        <AuthProvider>
          <ClientProviders>
            <Navbar />
            <main>{children}</main>
            <Toaster richColors position="bottom-right" />
          </ClientProviders>
        </AuthProvider>
      </body>
    </html>
  );
}
