import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { JWT_CONFIG } from '../config/jwt.config';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const user = await AuthService.register(req.body);
      res.status(201).json({ user });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const { user, token } = await AuthService.login(email, password);

      res.cookie(JWT_CONFIG.cookieName, token, JWT_CONFIG.cookieOptions);
      res.json({ user });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  static async githubCallback(req: Request, res: Response) {
    try {
      const { user, token } = await AuthService.githubAuth(req.user);

      res.cookie(JWT_CONFIG.cookieName, token, JWT_CONFIG.cookieOptions);
      res.redirect(process.env.CLIENT_URL || '/');
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  static logout(req: Request, res: Response) {
    res.clearCookie(JWT_CONFIG.cookieName);
    res.json({ message: 'Logged out successfully' });
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
}

