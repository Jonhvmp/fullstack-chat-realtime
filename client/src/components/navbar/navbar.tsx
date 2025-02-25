'use client';

import Link from "next/link";
import { useAuth } from "@/contexts/auth/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Menu } from "lucide-react";
import { useState } from "react";
import { useChat } from "@/contexts/chat/ChatContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { onlineUsers, createChatWithUser } = useChat();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Filtra os usuários online para não incluir a si mesmo
  const otherOnlineUsers = onlineUsers.filter((u) => u._id !== user?._id);

  const handleCreateChat = (otherUserId: string) => {
    if (!user?._id) return;
    createChatWithUser(otherUserId, user._id);
  };

  return (
    <nav className="bg-background border-b h-16 sticky top-0 z-50">
      <div className="h-full max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center">
            <Link href="/chat" className="text-xl font-bold">
              Chat Realtime
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {/* Botão de Chat */}
            {isAuthenticated && (
              <Button variant="outline" asChild>
                <Link href="/chat">Chat</Link>
              </Button>
            )}

            {/* Dropdown para usuários online */}
            {isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Usuários Online
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  {otherOnlineUsers.length === 0 && (
                    <DropdownMenuItem disabled className="text-sm">
                      Nenhum outro usuário online
                    </DropdownMenuItem>
                  )}
                  {otherOnlineUsers.map((u) => (
                    <DropdownMenuItem
                      key={u._id}
                      onClick={() => handleCreateChat(u._id)}
                    >
                      {u.name || u.email}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="text-sm">
                    {user?.email}
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/user">Configurações</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => logout()}
                    className="text-red-600"
                  >
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Entrar</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Registrar</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="absolute top-16 left-0 right-0 bg-background border-b md:hidden">
              <div className="px-4 py-2 space-y-2">
                {isAuthenticated && (
                  <>
                    <Button
                      variant="outline"
                      className="w-full"
                      asChild
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Link href="/chat">Chat</Link>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          Usuários Online
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[calc(100vw-2rem)] mx-4">
                        {otherOnlineUsers.length === 0 && (
                          <DropdownMenuItem disabled className="text-sm">
                            Nenhum outro usuário online
                          </DropdownMenuItem>
                        )}
                        {otherOnlineUsers.map((u) => (
                          <DropdownMenuItem
                            key={u._id}
                            onClick={() => {
                              handleCreateChat(u._id);
                              setIsMenuOpen(false);
                            }}
                          >
                            {u.name || u.email}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-2 text-sm">{user?.email}</div>
                    <Button
                      variant="ghost"
                      className="w-full"
                      asChild
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Link href="/user">Configurações</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full text-red-600"
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                    >
                      Sair
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" className="w-full" asChild>
                        <Link
                          href="/login"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Entrar</Link>
                    </Button>
                    <Button className="w-full" asChild>
                        <Link
                          href="/register"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Registrar</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export { Navbar };
