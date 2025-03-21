export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || '',
  expiresIn: '7d'
};
