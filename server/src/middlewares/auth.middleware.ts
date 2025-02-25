import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/jwt.config';
import User from '../models/user.model';

const extractTokens = (req: Request): { cookieToken?: string; bearerToken?: string } => {
  return {
    cookieToken: req.cookies[JWT_CONFIG.cookieName],
    bearerToken: req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.substring(7)
      : undefined
  };
};

const validateToken = async (token: string): Promise<{ isValid: boolean; user?: any }> => {
  try {
    const decoded = jwt.verify(token, JWT_CONFIG.secret) as { id: string };
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return { isValid: false };
    }

    return { isValid: true, user };
  } catch (error) {
    return { isValid: false };
  }
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { cookieToken, bearerToken } = extractTokens(req);

    // Tenta validar o cookie primeiro
    if (cookieToken) {
      const cookieResult = await validateToken(cookieToken);
      if (cookieResult.isValid) {
        req.user = cookieResult.user;
        return next();
      }
    }

    // Se o cookie falhar ou não existir, tenta o bearer token
    if (bearerToken) {
      const bearerResult = await validateToken(bearerToken);
      if (bearerResult.isValid) {
        req.user = bearerResult.user;
        return next();
      }
    }

    // Se ambos falharem, retorna erro
    res.status(401).json({ message: 'Autenticação necessária' });
    return;
  } catch (error) {
    res.status(401).json({ message: 'Token Inválido' });
    return;
  }
};
