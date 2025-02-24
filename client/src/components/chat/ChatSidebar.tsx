// import { useEffect } from "react";
import { useChat } from "@/contexts/chat/ChatContext";
import { useAuth } from "@/contexts/auth/AuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserCircle } from "lucide-react";
import { ChatCircleDots, Calendar, Circle, Bell } from "@phosphor-icons/react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export function ChatSidebar() {
  const { user } = useAuth();
  const {
    userChats,
    setCurrentChat,
    onlineUserIds,
    lastMessages, // Agora vem do ChatContext
  } = useChat();

  const formatLastMessageDate = (date: string) => {
    if (!date) return "";
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: ptBR,
    });
  };

  const truncateMessage = (content: string, maxLength: number = 25) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="px-4 py-2 border-b">
        <div className="flex px-2 pl-10 md:pl-4 py-1 sticky items-center justify-between">
          <h2 className="text-xl font-semibold">Chats</h2>
          <ChatCircleDots size={20} weight="light" />
        </div>
      </div>

      <ScrollArea className="h-[calc(100%-4rem)]">
        <div className="px-2 py-2 space-y-1">
          {userChats.map((chat) => {
            const otherMember = chat.members.find(
              (member) => member._id !== user?._id
            );
            const isOnline =
              otherMember && onlineUserIds.includes(otherMember._id);

            const lastMessage = lastMessages[chat._id];

            return (
              <Button
                key={chat._id}
                variant="ghost"
                className="w-full justify-start p-2 relative hover:bg-muted"
                onClick={() => setCurrentChat(chat)}
              >
                <div className="flex items-center w-full">
                  <div className="relative">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage
                        src={`https://github.com/${otherMember?.name}.png`}
                        onError={(e) => {
                          e.currentTarget.src = "/default-avatar.png";
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
                        <Circle size={12} weight="fill" className="text-red-500" />
                      )}
                    </span>
                  </div>

                  <div className="flex flex-col flex-1">
                    <div className="flex justify-between items-center w-full">
                      <span className="font-medium">{otherMember?.name}</span>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar size={14} weight="light" />
                        <span>
                          {lastMessage
                            ? formatLastMessageDate(lastMessage.createdAt)
                            : ""}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center w-full">
                      <span className="text-sm text-muted-foreground truncate max-w-[180px]">
                        {lastMessage
                          ? truncateMessage(lastMessage.content)
                          : "Nenhuma mensagem"}
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
