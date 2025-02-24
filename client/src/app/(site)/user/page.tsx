"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth/AuthContext";
import { use2FA } from "@/hooks/use2FA";
import Image from "next/image";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

export default function UserPage() {
  const { user, updateUser } = useAuth();
  const {
    qrCodeImage,
    twoFaCode,
    twoFaEnabled,
    loading,
    message,
    setTwoFaCode,
    enable2FA,
    verifyToken,
    otpauthUrl,
    disable2FA
  } = use2FA(user?.twoFactorEnabled || false);

  const [confirmDisable, setConfirmDisable] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const copyOtpauthUrl = async () => {
    try {
      await navigator.clipboard.writeText(otpauthUrl);
      toast.success("URL copiada com sucesso!");
    } catch {
      toast.error("Erro ao copiar URL");
    }
  };

  const handleDisable2FA = async () => {
    if (!confirmDisable) {
      toast.error("Por favor, confirme que deseja desativar o 2FA");
      return;
    }

    await disable2FA(twoFaCode);
    setDialogOpen(false);
    setConfirmDisable(false);
  };

  const handleTwoFaCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, '');
    setTwoFaCode(numericValue);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser(formData);
      setIsEditing(false);
      toast.success('Dados atualizados com sucesso!');
    } catch {
      toast.error('Erro ao atualizar dados');
    }
  };

  return (
    <div className="container mx-auto py-6 overflow-y-auto max-h-[calc(100vh-64px)]">
      <Card className="max-w-md mx-auto mb-6">
        <CardHeader>
          <CardTitle>Configurações do Usuário</CardTitle>
          <CardDescription>Gerencie suas informações e segurança</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome:</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email:</label>
                <Input
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  type="email"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Salvar</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          ) : (
            <div>
              <div className="flex justify-between items-center">
                <div>
                  <p><strong>Nome:</strong> {user?.name}</p>
                  <p><strong>Email:</strong> {user?.email}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFormData({ name: user?.name || '', email: user?.email || '' });
                    setIsEditing(true);
                  }}
                >
                  Editar
                </Button>
              </div>
            </div>
          )}
          <hr />

          <div>
            <h2 className="text-lg font-semibold mb-2">Autenticação de Dois Fatores</h2>
            {user?.twoFactorEnabled || twoFaEnabled ? (
              <div>
                <p className="text-green-600 font-medium">2FA está ativo e funcionando!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Use seu aplicativo autenticador para gerar códigos ao fazer login.
                </p>
                <div className="mt-4">
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="destructive">
                        Desativar 2FA
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Desativar Autenticação de Dois Fatores</DialogTitle>
                        <DialogDescription>
                          Esta ação irá remover a camada extra de segurança da sua conta.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="confirm"
                            checked={confirmDisable}
                            onCheckedChange={(checked) =>
                              setConfirmDisable(checked as boolean)
                            }
                          />
                          <label
                            htmlFor="confirm"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Confirmo que desejo desativar a autenticação de dois fatores
                          </label>
                        </div>

                        {confirmDisable && (
                          <div className="space-y-2">
                            <p className="text-sm">
                              Digite um código 2FA válido para confirmar:
                            </p>
                            <div className="flex items-center gap-2">
                              <Input
                                placeholder="Digite o código 2FA"
                                value={twoFaCode}
                                onChange={handleTwoFaCodeChange}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={6}
                              />
                              <Button
                                onClick={handleDisable2FA}
                                disabled={loading || !confirmDisable}
                                variant="destructive"
                              >
                                Confirmar
                              </Button>
                            </div>
                          </div>
                        )}

                        {message && (
                          <p className="text-sm text-destructive">{message}</p>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ) : (
              <>
                <Button onClick={enable2FA} disabled={loading}>
                  {loading ? "Gerando..." : "Habilitar 2FA"}
                </Button>

                {qrCodeImage && (
                  <div className="mt-4">
                    <p className="text-sm mb-2">Escaneie este QR Code no seu aplicativo de autenticação:</p>
                    <div className="flex justify-center mb-4">
                      <Image
                        src={qrCodeImage}
                        alt="QR Code 2FA"
                        width={200}
                        height={200}
                      />
                    </div>

                    <div className="bg-muted p-2 rounded-md">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">URL alternativa:</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={copyOtpauthUrl}
                          title="Copiar URL"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs break-all mt-1">{otpauthUrl}</p>
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                      <Input
                        placeholder="Digite o código 2FA"
                        value={twoFaCode}
                        onChange={handleTwoFaCodeChange}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                      />
                      <Button onClick={verifyToken} disabled={loading}>
                        Confirmar
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}

            {message && <p className="mt-2 text-sm text-red-600">{message}</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
