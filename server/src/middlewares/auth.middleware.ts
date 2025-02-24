import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/jwt.config';
import User from '../models/user.model';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies[JWT_CONFIG.cookieName];

    if (!token) {
      res.status(401).json({ message: 'Autenticação necessária' });
      return
    }

    const decoded = jwt.verify(token, JWT_CONFIG.secret) as { id: string };
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      res.status(401).json({ message: 'Usuário não encontrado ou inativo' });
      return
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token Inválido' });
    return
  }
};
