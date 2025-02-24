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

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-background border-b h-16 sticky top-0 z-50">
      <div className="h-full max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
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
                  <DropdownMenuItem onClick={() => logout()} className="text-red-600">
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
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-2 text-sm">{user?.email}</div>
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
                      <Link href="/login">Entrar</Link>
                    </Button>
                    <Button className="w-full" asChild>
                      <Link href="/register">Registrar</Link>
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
