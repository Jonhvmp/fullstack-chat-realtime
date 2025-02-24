import { useChat } from "@/contexts/chat/ChatContext";
import { useAuth } from "@/contexts/auth/AuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserCircle } from "lucide-react";
import { ChatCircleDots, Calendar, CircleDashed, Circle, Bell } from "@phosphor-icons/react";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEffect, useState } from "react";
import api from "@/services/api";

interface LastMessage {
  chatId: string;
  content: string;
  createdAt: string;
  unreadCount: number;
}

export function ChatSidebar() {
  const { userChats, setCurrentChat } = useChat();
  const { user } = useAuth();
  const [lastMessages, setLastMessages] = useState<Record<string, LastMessage>>({});

  useEffect(() => {
    const fetchLastMessages = async () => {
      const messages: Record<string, LastMessage> = {};

      for (const chat of userChats) {
        try {
          const [messagesResponse, unreadResponse] = await Promise.all([
            api.get(`/message/${chat._id}`),
            api.get(`/message/${chat._id}/unread/${user?._id}`)
          ]);

          const chatMessages = messagesResponse.data;
          if (chatMessages.length > 0) {
            const lastMessage = chatMessages[chatMessages.length - 1];
            messages[chat._id] = {
              chatId: chat._id,
              content: lastMessage.content,
              createdAt: lastMessage.createdAt,
              unreadCount: unreadResponse.data.count
            };
          }
        } catch (error) {
          console.error(`Erro ao buscar mensagens do chat ${chat._id}:`, error);
        }
      }

      setLastMessages(messages);
    };

    if (userChats.length > 0 && user?._id) {
      fetchLastMessages();
    }

    // Atualizar a cada 5 segundos
    const interval = setInterval(fetchLastMessages, 5000);
    return () => clearInterval(interval);
  }, [userChats, user?._id]);

  const formatLastMessageDate = (date: string) => {
    if (!date) return '';
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: ptBR,
    });
  };

  const truncateMessage = (content: string, maxLength: number = 25) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="h-full border-r">
      <div className="px-4 py-2 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Chats</h2>
          <ChatCircleDots size={20} weight="light" />
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-120px)]">
        <div className="px-2 py-2">
          {userChats.map((chat) => {
            const otherMember = chat.members.find((member) => member._id !== user?._id);
            const isOnline = Math.random() > 0.5;
            const lastMessage = lastMessages[chat._id];

            return (
              <Button
                key={chat._id}
                variant="ghost"
                className="w-full justify-start mb-1 p-2 relative"
                onClick={() => setCurrentChat(chat)}
              >
                <div className="flex items-center w-full">
                  <div className="relative">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage
                        src={`https://github.com/${otherMember?.name}.png`}
                        onError={(e) => {
                          e.currentTarget.src = '/default-avatar.png';
                        }}
                      />
                      <AvatarFallback>
                        <UserCircle className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-1">
                      {isOnline ? (
                        <Circle size={12} weight="fill" className="text-green-500" />
                      ) : (
                        <CircleDashed size={12} className="text-gray-400" />
                      )}
                    </span>
                  </div>

                  <div className="flex flex-col flex-1">
                    <div className="flex justify-between items-center w-full">
                      <span className="font-medium">{otherMember?.name}</span>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar size={14} weight="light" />
                        <span>{lastMessage ? formatLastMessageDate(lastMessage.createdAt) : ''}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center w-full">
                      <span className="text-sm text-muted-foreground truncate max-w-[180px]">
                        {lastMessage ? truncateMessage(lastMessage.content) : 'Nenhuma mensagem'}
                      </span>
                      {lastMessage && lastMessage.unreadCount > 0 ? (
                        <div className="relative">
                          <Bell size={14} weight="fill" className="text-primary" />
                          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full text-xs w-4 h-4 flex items-center justify-center">
                            {lastMessage.unreadCount}
                          </span>
                        </div>
                      ) : (
                        <Bell size={14} weight="light" className="text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
