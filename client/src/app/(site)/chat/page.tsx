"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth/AuthContext';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatBox } from '@/components/chat/ChatBox';
import { useChat } from '@/contexts/chat/ChatContext';

export default function ChatPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { fetchUserChats } = useChat();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchUserChats(user._id);
    }
  }, [user, fetchUserChats]);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 grid grid-cols-[300px_1fr]">
        <ChatSidebar />
        <ChatBox />
      </div>
    </div>
  );
}
