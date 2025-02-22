export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'secret',
  expiresIn: '7d',
  cookieName: 'auth_token',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 d
  }
};
