"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth/AuthContext';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatBox } from '@/components/chat/ChatBox';
import { useChat } from '@/contexts/chat/ChatContext';
import { Button } from '@/components/ui/button';
import { List, X } from '@phosphor-icons/react';

export default function ChatPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { fetchUserChats, currentChat } = useChat();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

  useEffect(() => {
    if (currentChat && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [currentChat]);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex-1 relative flex overflow-hidden">
        {/* Sidebar */}
        <div
          className={`
            absolute md:relative w-full md:w-80 h-full
            transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0 z-10
          `}
        >
          <ChatSidebar />
        </div>

        <div className="flex-1 h-full relative">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden absolute top-2.5 left-4 z-30 h-8 w-8"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? (
              <X size={24} weight="light" className='h-5 w-5'/>
            ) : (
              <List size={24} weight="light" className='h-5 w-5' />
            )}
          </Button>
          <ChatBox />
        </div>

        {isSidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-0"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
