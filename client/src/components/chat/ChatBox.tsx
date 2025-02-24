import { useEffect, useRef } from "react";
import { Message, useChat } from "@/contexts/chat/ChatContext";
import { useAuth } from "@/contexts/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { UserCircle } from "lucide-react";

export function ChatBox() {
  const { currentChat, messages, sendMessage, fetchMessages, markMessagesAsRead } = useChat();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMessages = async () => {
      if (currentChat?._id && user?._id) {
        console.log("Buscando mensagens para o chat:", currentChat._id);
        await fetchMessages(currentChat._id);
        // Marcar mensagens como lidas quando abrir o chat
        await markMessagesAsRead(currentChat._id, user._id);
      }
    };

    loadMessages();
  }, [currentChat?._id, user?._id, fetchMessages, markMessagesAsRead]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    messages.forEach((message) => {
    console.log("Mensagem:", message.content);
    console.log("message.sender._id:", message.sender._id);
    console.log("user?._id:", user?._id);
    console.log("Comparação:", message.sender._id === user?._id);
  });

  }, [messages, user]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChat || !user) return;

    try {
      await sendMessage(currentChat._id, user._id, newMessage);
      setNewMessage("");
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };

  if (!currentChat) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Selecione um chat para começar</p>
      </div>
    );
  }

  const otherMember = currentChat.members.find((member) => member._id !== user?._id);

  // Função para renderizar uma mensagem individual
  const renderMessage = (message: Message) => {
    const isCurrentUser = String(message.sender._id) === String(user?._id);
    const messageUser = isCurrentUser ? user : otherMember;

    return (
      <div
        key={message._id}
        className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`flex items-start gap-2 max-w-[70%] ${
            isCurrentUser ? "flex-row-reverse" : ""
          }`}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={`https://github.com/${messageUser?.name}.png`}
              onError={(e) => {
                e.currentTarget.src = '/default-avatar.png';
              }}
            />
            <AvatarFallback>
              <UserCircle className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div
            className={`rounded-lg p-3 ${
              isCurrentUser
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            }`}
          >
            <p className="text-sm">{message.content}</p>
            <span className="text-xs text-muted-foreground mt-1">
              {new Date(message.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-2 border-b flex items-center gap-3">
        <Avatar className="h-8 w-8">
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
        <h3 className="text-lg font-semibold">{otherMember?.name}</h3>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground">
              Nenhuma mensagem ainda
            </div>
          ) : (
            messages.map(renderMessage)
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <form onSubmit={handleSend} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1"
          />
          <Button type="submit">Enviar</Button>
        </div>
      </form>
    </div>
  );
}
