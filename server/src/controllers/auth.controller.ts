import { Request, Response } from 'express';
import { IUser } from '@/models/user.model';
import { AuthService } from '../services/auth.service';
import { JWT_CONFIG } from '../config/jwt.config';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { user, token } = await AuthService.register(req.body);

      res.cookie(JWT_CONFIG.cookieName, token, JWT_CONFIG.cookieOptions);
      res.status(201).json({ user });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, token2FA } = req.body;
      const { user, token } = await AuthService.login(email, password) as unknown as { user: IUser & { _id: string }, token: string };

      if (user.twoFactorEnabled) {
        if (!token2FA) {
          res.status(206).json({
            partialLogin: true,
            message: '2FA requerido',
            userId: user._id
          });
          return;
        }

        const is2FAValid = await AuthService.check2FA(user._id.toString(), token2FA);
        if (!is2FAValid) {
          res.status(401).json({
            message: 'Código 2FA inválido',
            error: 'INVALID_2FA_TOKEN'
          });
          return;
        }
      }

      res.cookie(JWT_CONFIG.cookieName, token, JWT_CONFIG.cookieOptions);
      res.json({ user });
    } catch (error: any) {
      res.status(401).json({
        message: error.message,
        error: error.code || 'AUTH_ERROR'
      });
    }
  }

  static async githubCallback(req: Request, res: Response) {
    try {
      const user = req.user as IUser;
      if (!user) {
        throw new Error('Autenticação falhou');
      }

      const { token } = await AuthService.githubAuth(user);

      res.cookie(JWT_CONFIG.cookieName, token, JWT_CONFIG.cookieOptions);
      res.redirect(process.env.CLIENT_URL || 'http://localhost:3000');
    } catch (error: any) {
      res.redirect(`${process.env.CLIENT_URL}/login?error=${error.message}`);
    }
  }

  static logout(req: Request, res: Response) {
    res.clearCookie(JWT_CONFIG.cookieName);
    res.json({ message: 'Sucesso ao sair da conta.' });
  }
  // get users
  static async getUsers(req: Request, res: Response) {
    try {
      const users = await AuthService.getUsers();
      res.json({ users });
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  // get user by id
  static async getUserById(req: Request, res: Response) {
    try {
      const user = await AuthService.getUserById(req.params.id);
      res.json({ user });
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  static async validateToken(req: Request, res: Response) {
    try {
      const token = req.cookies[JWT_CONFIG.cookieName];
      const user = await AuthService.validateToken(token);
      res.json({ user });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  static async getManyUsers(req: Request, res: Response): Promise<void> {
    try {
      const { userIds } = req.body;
      if (!Array.isArray(userIds)) {
        res.status(400).json({ message: 'userIds deve ser um array' });
        return
      }

      const users = await AuthService.getManyUsers(userIds);
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async enable2FA(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Não autenticado' });
        return;
      }

      const userId = req.user._id as string;

      // Gera secret e QR code
      const { otpauthUrl, qrDataUrl } = await AuthService.enable2FA(userId);

      // Retorna a URL para gerar QR code e a imagem em base64
      res.json({ otpauthUrl, qrDataUrl });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async verify2FA(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      if (!userId) {
        res.status(401).json({ message: 'Não autenticado' });
        return;
      }

      const { token } = req.body;
      if (!token) {
        res.status(400).json({ message: 'Token é obrigatório' });
        return;
      }

      await AuthService.verify2FA(userId.toString(), token);
      res.json({ message: '2FA habilitado com sucesso' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

    static async disable2FA(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      if (!userId) {
        res.status(401).json({ message: 'Não autenticado' });
        return;
      }

      const { token } = req.body;
      if (!token) {
        res.status(400).json({ message: 'Token é obrigatório' });
        return;
      }

      await AuthService.disable2FA(userId.toString(), token);
      res.json({ message: '2FA desativado com sucesso' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
