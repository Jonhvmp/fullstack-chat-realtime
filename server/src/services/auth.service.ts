import { IUser } from '../models/user.model';
import User from '../models/user.model';
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
}
