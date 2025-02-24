'use client';

import { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import api from '@/services/api';

interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Message {
  _id: string;
  chat: string;
  sender: User;
  content: string;
  createdAt: string;
}

interface Chat {
  _id: string;
  members: User[];
  createdAt: string;
  updatedAt: string;
}

interface ChatContextData {
  currentChat: Chat | null;
  messages: Message[];
  setCurrentChat: (chat: Chat | null) => void;
  userChats: Chat[];
  fetchUserChats: (userId: string) => Promise<void>;
  sendMessage: (chatId: string, senderId: string, content: string) => Promise<void>;
  fetchMessages: (chatId: string) => Promise<void>;
  markMessagesAsRead: (chatId: string, userId: string) => Promise<void>;
}

interface ChatProviderProps {
  children: ReactNode;
}

const ChatContext = createContext<ChatContextData>({} as ChatContextData);

export function ChatProvider({ children }: ChatProviderProps) {
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userChats, setUserChats] = useState<Chat[]>([]);

  const fetchUserChats = useCallback(async (userId: string) => {
    try {
      const response = await api.get(`/chat/users/${userId}`);
      setUserChats(response.data);
    } catch (error) {
      console.error('Erro ao buscar chats do usuário:', error);
    }
  }, []);

  const fetchMessages = useCallback(async (chatId: string) => {
    try {
      console.log("Fazendo fetch das mensagens para o chat:", chatId);
      const response = await api.get(`/message/${chatId}`);
      console.log("Mensagens recebidas:", response.data);
      setMessages(response.data); // Atualiza o estado com todas as mensagens
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
    }
  }, []);

  const sendMessage = useCallback(async (chatId: string, senderId: string, content: string) => {
    try {
      const response = await api.post('/message', {
        chat: chatId,
        sender: senderId,
        content
      });
      setMessages(prev => [...prev, response.data]);

      return response.data;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      throw error;
    }
  }, []);

  const markMessagesAsRead = useCallback(async (chatId: string, userId: string) => {
    try {
      await api.post(`/message/${chatId}/read`, { userId });
      // Atualizar o estado local após marcar como lido
      const updatedChats = await api.get(`/chat/users/${userId}`);
      setUserChats(updatedChats.data);
    } catch (error) {
      console.error('Erro ao marcar mensagens como lidas:', error);
    }
  }, []);

  return (
    <ChatContext.Provider
      value={{
        currentChat,
        setCurrentChat,
        messages,
        userChats,
        fetchUserChats,
        sendMessage,
        fetchMessages,
        markMessagesAsRead
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat(): ChatContextData {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat deve ser usado dentro de um ChatProvider');
  }
  return context;
}
