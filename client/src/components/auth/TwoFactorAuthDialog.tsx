import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TwoFactorAuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (code: string) => Promise<void>;
  error?: { message: string; details?: string } | null;
  loading?: boolean;
}

export function TwoFactorAuthDialog({
  open,
  onOpenChange,
  onSubmit,
  error,
  loading = false
}: TwoFactorAuthDialogProps) {
  const [code, setCode] = useState('');

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, '');
    setCode(numericValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(code);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verificação em Duas Etapas</DialogTitle>
          <DialogDescription>
            Digite o código de 6 dígitos gerado pelo seu aplicativo autenticador
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Digite o código 2FA"
            value={code}
            onChange={handleCodeChange}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            autoFocus
            className={error ? "border-red-500" : ""}
          />
          {error && (
            <p className="text-sm text-destructive flex items-center gap-2">
              <span className="i-lucide-alert-circle" />
              {error.message}
            </p>
          )}
          <Button
            type="submit"
            className="w-full"
            disabled={loading || code.length !== 6 || !/^\d{6}$/.test(code)}
          >
            {loading ? "Verificando..." : "Verificar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
