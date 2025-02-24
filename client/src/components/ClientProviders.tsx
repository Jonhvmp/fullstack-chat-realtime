'use client';

import React from 'react';
import { useAuth } from "@/contexts/auth/AuthContext";
import { SocketProvider } from "@/contexts/socket/SocketContext";
import { ChatProvider } from "@/contexts/chat/ChatContext";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <SocketProvider userId={user?._id}>
      <ChatProvider>
        {children}
      </ChatProvider>
    </SocketProvider>
  );
}
