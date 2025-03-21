import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/jwt.config';
import User from '../models/user.model';

const extractToken = (req: Request): string | undefined => {
  if (req.headers.authorization?.startsWith('Bearer ')) {
    return req.headers.authorization.substring(7);
  }
  return undefined;
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractToken(req);

    if (!token) {
      res.status(401).json({ message: 'Autenticação necessária' });
      return;
    }

    const decoded = jwt.verify(token, JWT_CONFIG.secret) as { id: string };
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      res.status(401).json({ message: 'Token inválido ou usuário inativo' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token Inválido' });
    return;
  }
};
