"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
  useEffect,
} from "react";
import api from "@/services/api";
import { useSocket } from "@/contexts/socket/SocketContext";
import { useAuth } from "@/contexts/auth/AuthContext";

// -----------------------------------------
// Tipagens
// -----------------------------------------
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

// Representa o 'último recado' de cada chat, e o número de não-lidas
interface LastMessage {
  chatId: string;
  content: string;
  createdAt: string;
  unreadCount: number;
}

interface ChatContextData {
  currentChat: Chat | null;
  messages: Message[];
  setCurrentChat: (chat: Chat | null) => void;
  userChats: Chat[];
  fetchUserChats: (userId: string) => Promise<void>;
  sendMessage: (
    chatId: string,
    senderId: string,
    content: string
  ) => Promise<void>;
  fetchMessages: (chatId: string) => Promise<void>;
  markMessagesAsRead: (chatId: string, userId: string) => Promise<void>;

  // IDs e objetos de usuários online
  onlineUserIds: string[];
  onlineUsers: User[];

  // Criar (ou recuperar) chat
  createChatWithUser: (userId: string, currentUserId: string) => Promise<void>;

  // MAPA: chatId -> informação do último recado
  lastMessages: Record<string, LastMessage>;
}

interface ChatProviderProps {
  children: ReactNode;
}

const ChatContext = createContext<ChatContextData>({} as ChatContextData);

export function ChatProvider({ children }: ChatProviderProps) {
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userChats, setUserChats] = useState<Chat[]>([]);
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);

  // Armazena o "último recado" de cada chat
  const [lastMessages, setLastMessages] = useState<
    Record<string, LastMessage>
  >({});

  const { socket } = useSocket();
  const { user } = useAuth();

  // -------------------------
  // fetchUserChats
  // -------------------------
  const fetchUserChats = useCallback(async (userId: string) => {
    try {
      const response = await api.get(`/chat/users/${userId}`);
      setUserChats(response.data);
    } catch (error) {
      console.error("Erro ao buscar chats do usuário:", error);
    }
  }, []);

  // -------------------------
  // Efeitos de socket
  // -------------------------
  useEffect(() => {
    if (!socket) return;

    // Quando chega uma nova mensagem
    socket.on("messageReceived", (newMessage: Message) => {
      // Se é do chat atual, insere no estado de messages
      if (currentChat && newMessage.chat === currentChat._id) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    // Lista de IDs online
    socket.on("onlineUsers", (userIds: string[]) => {
      console.log("Usuários online recebidos:", userIds);
      setOnlineUserIds(userIds);
    });

    return () => {
      socket.off("messageReceived");
      socket.off("onlineUsers");
    };
  }, [socket, currentChat]);

  // Carrega infos de onlineUsers
  useEffect(() => {
    const loadOnlineUsers = async () => {
      try {
        if (onlineUserIds.length === 0) {
          setOnlineUsers([]);
          return;
        }
        const response = await api.post("/user/list", {
          userIds: onlineUserIds,
        });
        setOnlineUsers(response.data);
      } catch (error) {
        console.error("Erro ao buscar usuários online:", error);
      }
    };

    loadOnlineUsers();
  }, [onlineUserIds]);

  // Entra na sala do chat atual
  useEffect(() => {
    if (socket && currentChat) {
      socket.emit("joinChat", currentChat._id);
      console.log(`Entrou na sala do chat: ${currentChat._id}`);
    }
  }, [socket, currentChat]);

  // Escuta 'chatUpdated' => recarrega os chats
  useEffect(() => {
    if (!socket) return;

    const handleChatUpdated = async (payload: { chatId: string; lastMessage: string }) => {
      console.log("chatUpdated:", payload);
      if (user?._id) {
        await fetchUserChats(user._id);
      }
    };

    socket.on("chatUpdated", handleChatUpdated);

    return () => {
      socket.off("chatUpdated", handleChatUpdated);
    };
  }, [socket, user?._id, fetchUserChats]);

  // -------------------------
  // lastMessages - Sempre que userChats mudar, recarrega
  // -------------------------
  useEffect(() => {
    // Se não tem user ou chats, zera
    if (!user?._id || userChats.length === 0) {
      setLastMessages({});
      return;
    }

    const fetchLastData = async () => {
      const result: Record<string, LastMessage> = {};
      for (const chat of userChats) {
        try {
          const [msgResp, unreadResp] = await Promise.all([
            api.get(`/message/${chat._id}`), // busca todas mensagens
            api.get(`/message/${chat._id}/unread/${user._id}`), // contagem de não lidas
          ]);

          const chatMessages: Message[] = msgResp.data;
          if (chatMessages.length > 0) {
            const lastMsg = chatMessages[chatMessages.length - 1];
            result[chat._id] = {
              chatId: chat._id,
              content: lastMsg.content,
              createdAt: lastMsg.createdAt,
              unreadCount: unreadResp.data.count, // { count: number }
            };
          }
        } catch (error) {
          console.error("Erro ao buscar dados do chat", chat._id, error);
        }
      }
      setLastMessages(result);
    };

    fetchLastData();
  }, [userChats, user?._id]);

  // -------------------------
  // fetchMessages
  // -------------------------
  const fetchMessages = useCallback(async (chatId: string) => {
    try {
      const response = await api.get(`/message/${chatId}`);
      setMessages(response.data);
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
    }
  }, []);

  // -------------------------
  // sendMessage
  // -------------------------
  const sendMessage = useCallback(
    async (chatId: string, senderId: string, content: string) => {
      if (socket) {
        socket.emit("sendMessage", { chatId, senderId, content });
      } else {
        const response = await api.post("/message", {
          chat: chatId,
          sender: senderId,
          content,
        });
        setMessages((prev) => [...prev, response.data]);
      }
    },
    [socket]
  );

  // -------------------------
  // markMessagesAsRead
  // -------------------------
  const markMessagesAsRead = useCallback(async (chatId: string, userId: string) => {
    try {
      await api.post(`/message/${chatId}/read`, { userId });
      // Recarrega os chats p/ atualizar o unreadCount
      const updatedChats = await api.get(`/chat/users/${userId}`);
      setUserChats(updatedChats.data);
    } catch (error) {
      console.error("Erro ao marcar mensagens como lidas:", error);
    }
  }, []);

  // -------------------------
  // createChatWithUser
  // -------------------------
  const createChatWithUser = useCallback(
    async (otherUserId: string, currentUserId: string) => {
      try {
        const response = await api.post("/chat", {
          firstId: currentUserId,
          secondId: otherUserId,
        });
        const newChat: Chat = response.data;

        setUserChats((prev) => {
          if (!prev.some((c) => c._id === newChat._id)) {
            return [...prev, newChat];
          }
          return prev;
        });

        setCurrentChat(newChat);
      } catch (error) {
        console.error("Erro ao criar/recuperar chat:", error);
      }
    },
    []
  );

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
        markMessagesAsRead,
        onlineUserIds,
        onlineUsers,
        createChatWithUser,
        // Expondo lastMessages
        lastMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat(): ChatContextData {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat deve ser usado dentro de um ChatProvider");
  }
  return context;
}
