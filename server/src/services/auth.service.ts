import User, { IUser } from '../models/user.model';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import jwt, { SignOptions } from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/jwt.config';

export class AuthService {
  static async register(userData: Partial<IUser>) {
    try {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('Email já cadastrado! Faça login.');
      }

      if (!userData.password) {
        throw new Error('Senha é obrigatória.');
      }

      if (userData.password.length < 6) {
        throw new Error('Senha deve ter no mínimo 6 caracteres.');
      }

      if (userData.authProviders && userData.authProviders.length > 0) {
        const githubProvider = userData.authProviders.find(provider => provider.provider === 'github');
        if (githubProvider) {
          throw new Error('Não é possível registrar um usuário com autenticação do GitHub, faça login com GitHub.');
        }
      }

      const user = new User({
        ...userData,
        roles: ['user'],
        authProviders: []
      });

      await user.save();

      const token = jwt.sign({ id: user._id }, JWT_CONFIG.secret, {
        expiresIn: JWT_CONFIG.expiresIn
      } as SignOptions);

      return { user, token };
    } catch (error) {
      throw error;
    }
  }

  static async login(email: string, password: string) {
    try {
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        throw new Error('Usuário não encontrado!');
      }

      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        throw new Error('Credenciais inválidas!');
      }

      user.lastLogin = new Date();
      await user.save();

      const token = jwt.sign({ id: user._id }, JWT_CONFIG.secret as jwt.Secret, {
        expiresIn: JWT_CONFIG.expiresIn
      } as SignOptions);

      return { user, token };
    } catch (error) {
      throw error;
    }
  }

  static async githubAuth(user: IUser) {
    try {
      if (!user) {
        throw new Error('Dados do usuário não fornecidos');
      }

      const token = jwt.sign({ id: user._id }, JWT_CONFIG.secret as jwt.Secret, {
        expiresIn: JWT_CONFIG.expiresIn
      } as SignOptions);

      return { user, token };
    } catch (error) {
      throw error;
    }
  }

  static async getUsers() {
    try {
      const users = await User.find();
      if (!users) {
        throw new Error('Nenhum usuário encontrado!');
      }
      return users;
    } catch (error) {
      throw error;
    }
  }

  static async getUserById(id: string) {
    try {
      const user = await User.findById(id);
      if (!user) {
        throw new Error('Usuário não encontrado!');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  // validate token a partir do token
  static async validateToken(token: string) {
    try {
      const payload = jwt.verify(token, JWT_CONFIG.secret) as { id: string };
      const user = await User
        .findById(payload.id)
        .select('-password')

      if (!user) {
        throw new Error('Usuário não encontrado!');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  static async getManyUsers(userIds: string[]) {
    return await User.find({ _id: { $in: userIds } });
  }

  static async enable2FA(userId: string) {
    const secret = speakeasy.generateSecret({
      name: 'Chat RealTime (user ' + userId + ')',
      length: 20,
    });

    const user = await User.findById(userId);
    if (!user) throw new Error('Usuário não encontrado');

    user.twoFactorSecret = secret.base32;
    await user.save();

    const otpauthUrl = secret.otpauth_url;

    if (!otpauthUrl) {
      throw new Error('Falha ao gerar URL 2FA');
    }
    const qrDataUrl = await QRCode.toDataURL(otpauthUrl);

    return { otpauthUrl, qrDataUrl };
  }

  static async verify2FA(userId: string, token: string) {
    try {
      const user = await User.findById(userId).select('+twoFactorSecret');
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      if (!user.twoFactorSecret) {
        throw new Error('2FA não foi configurado para esse usuário');
      }

      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token,
        window: 2
      });

      if (!verified) {
        throw new Error('Código 2FA inválido');
      }

      user.twoFactorEnabled = true;
      await user.save();

      return { success: true };
    } catch (error) {
      console.error('Erro na verificação 2FA:', error);
      throw error;
    }
  }

  static async check2FA(userId: string, token2FA: string): Promise<boolean> {
    const user = await User.findById(userId).select('+twoFactorSecret');
    if (!user || !user.twoFactorSecret) {
      return false;
    }

    return speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: token2FA,
      window: 1,
    });
  }

  static async disable2FA(userId: string, token: string) {
    try {
      const user = await User.findById(userId).select('+twoFactorSecret');
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      if (!user.twoFactorSecret || !user.twoFactorEnabled) {
        throw new Error('2FA não está ativo para este usuário');
      }

      // Verifica o token antes de desativar
      const isValid = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token,
        window: 2
      });

      if (!isValid) {
        throw new Error('Código 2FA inválido');
      }

      // Desativa 2FA e limpa o secret
      user.twoFactorEnabled = false;
      user.twoFactorSecret = undefined;
      await user.save();

      return { success: true };
    } catch (error) {
      console.error('Erro ao desativar 2FA:', error);
      throw error;
    }
  }
}
