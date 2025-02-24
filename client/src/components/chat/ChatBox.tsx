import { useEffect, useRef, useState } from "react";
import { Message, useChat } from "@/contexts/chat/ChatContext";
import { useAuth } from "@/contexts/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle } from "lucide-react";
import DOMPurify from 'dompurify';

export function ChatBox() {
  const { currentChat, messages, sendMessage, fetchMessages, markMessagesAsRead, setCurrentChat } = useChat();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [lastMessageTime, setLastMessageTime] = useState(Date.now());
  const RATE_LIMIT_DELAY = 500; // 500ms entre mensagens

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
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && currentChat) {
        setCurrentChat(null);
      }
    };

    window.addEventListener('keydown', handleEscKey);

    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [currentChat, setCurrentChat]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sanitizeMessage = (content: string) => {
    return DOMPurify.sanitize(content.trim()).slice(0, 1000); // limite de 1000 caracteres
  };

  const isValidMessage = (content: string) => {
    const sanitized = sanitizeMessage(content);
    return sanitized.length > 0 && sanitized.length <= 1000;
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isRateLimited) {
      console.warn("Aguarde antes de enviar outra mensagem");
      return;
    }

    if (!newMessage.trim() || !currentChat || !user) return;

    if (!isValidMessage(newMessage)) {
      console.error("Mensagem inválida");
      return;
    }

    const now = Date.now();
    if (now - lastMessageTime < RATE_LIMIT_DELAY) {
      setIsRateLimited(true);
      setTimeout(() => setIsRateLimited(false), RATE_LIMIT_DELAY);
      return;
    }

    try {
      const sanitizedMessage = sanitizeMessage(newMessage);
      await sendMessage(currentChat._id, user._id, sanitizedMessage);
      setNewMessage("");
      setLastMessageTime(now);
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

  const renderMessage = (message: Message) => {
    const isCurrentUser = String(message.sender._id) === String(user?._id);
    const messageUser = isCurrentUser ? user : otherMember;
    const sanitizedContent = sanitizeMessage(message.content);

    return (
      <div key={message._id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
        <div className={`flex items-start gap-2 max-w-[70%] ${isCurrentUser ? "flex-row-reverse" : ""}`}>
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={`https://github.com/${messageUser?.name}.png`}
              alt={`Avatar de ${messageUser?.name}`}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = '/default-avatar.png';
              }}
            />
            <AvatarFallback>
              <UserCircle className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div className={`rounded-lg p-3 ${isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
            <p className="text-sm break-words">{sanitizedContent}</p>
            <span className="text-xs text-muted-foreground mt-1">
              {new Intl.DateTimeFormat('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
              }).format(new Date(message.createdAt))}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="px-4 pl-16 md:pl-4 py-2 h-[3.5rem] border-b flex items-center gap-3 sticky top-0 bg-background z-10">
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
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground">Nenhuma mensagem ainda</div>
          ) : (
            messages.map(renderMessage)
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <form onSubmit={handleSend} className="p-4 border-t sticky bottom-0 bg-background">
        <div className="flex gap-2 max-w-3xl mx-auto">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            maxLength={1000}
            className="flex-1"
            disabled={isRateLimited}
          />
          <Button type="submit" disabled={isRateLimited || !isValidMessage(newMessage)}>
            Enviar
          </Button>
        </div>
      </form>
    </div>
  );
}
