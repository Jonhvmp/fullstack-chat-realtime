'use client'

import { useAuth } from '@src/contexts/auth/AuthContext';
import Link from 'next/link';
import React from 'react';

function AuthButtons() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (isAuthenticated) {
    return <Link href="/chat" className="bg-green-500 hover:bg-green-700 text-center text-white font-bold py-2 px-4 rounded">Entrar no Chat</Link>;
  }

  return <Link href="/login" className="bg-blue-500 hover:bg-blue-700 text-center text-white font-bold py-2 px-4 rounded">Login</Link>;
}

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl font-bold text-center">Bem vindo ao Chat RealTime</h1>

      <div className="flex items-center justify-center">
        <AuthButtons />
      </div>
    </div>
  );
}
