import { useState, useEffect } from 'react';
import { twoFactorAuthService } from '@/services/api/twoFactorAuth';

export const use2FA = (initialEnabled: boolean = false) => {
  const [qrCodeImage, setQrCodeImage] = useState<string>("");
  const [otpauthUrl, setOtpauthUrl] = useState("");
  const [twoFaCode, setTwoFaCode] = useState("");
  const [twoFaEnabled, setTwoFaEnabled] = useState(initialEnabled);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Atualiza o estado quando initialEnabled mudar
  useEffect(() => {
    setTwoFaEnabled(initialEnabled);
  }, [initialEnabled]);

  const enable2FA = async () => {
    try {
      setLoading(true);
      setMessage("");
      const data = await twoFactorAuthService.generateSecret();
      setOtpauthUrl(data.otpauthUrl);
      setQrCodeImage(data.qrDataUrl);
    } catch (error) {
      setMessage("Erro ao habilitar 2FA");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const verifyToken = async () => {
    try {
      setLoading(true);
      setMessage("");

      if (!twoFaCode.trim()) {
        setMessage("Por favor, insira o código 2FA");
        return;
      }

      await twoFactorAuthService.verifyToken(twoFaCode);
      setTwoFaEnabled(true);
      setMessage("2FA habilitado com sucesso!");
      setTwoFaCode("");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(error.message || "Erro ao verificar código 2FA");
      } else {
        setMessage("Erro ao verificar código 2FA");
      }
      console.error('Erro 2FA:', error);
    } finally {
      setLoading(false);
    }
  };

  const disable2FA = async (token: string) => {
    try {
      setLoading(true);
      setMessage("");

      if (!token?.trim()) {
        setMessage("Por favor, insira o código 2FA");
        return;
      }

      await twoFactorAuthService.disable2FA(token);
      setTwoFaEnabled(false);
      setMessage("2FA desativado com sucesso!");
      setTwoFaCode("");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(error.message || "Erro ao desativar 2FA");
      } else {
        setMessage("Erro ao desativar 2FA");
      }
      console.error('Erro 2FA:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    qrCodeImage,
    otpauthUrl,
    twoFaCode,
    twoFaEnabled,
    loading,
    message,
    setTwoFaCode,
    enable2FA,
    verifyToken,
    disable2FA
  };
};
