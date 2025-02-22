import { IUser } from '../models/user.model';
import User from '../models/user.model';
import jwt, { SignOptions } from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/jwt.config';

export class AuthService {
  static async register(userData: Partial<IUser>) {
    try {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('Email já cadastrado.');
      }

      if (!userData.password) {
        throw new Error('Senha é obrigatória.');
      }

      if (userData.password.length < 6) {
        throw new Error('Senha deve ter no mínimo 6 caracteres.');
      }

      const user = new User({
        ...userData,
        roles: ['user'],
        authProviders: []
      });

      await user.save();
      return user;
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

  static async githubAuth(profile: any) {
    try {
      let user = await User.findOne({
        'authProviders.provider': 'github',
        'authProviders.providerId': profile.id
      });

      if (!user) {
        user = await User.findOne({ email: profile.email });

        if (user) {
          //  Adiciona autenticação do GitHub ao usuário existente
          user.authProviders.push({
            provider: 'github',
            providerId: profile.id,
            profile: profile
          });
        } else {
          // Cria um novo usuário com autenticação do GitHub
          user = new User({
            name: profile.name || profile.username,
            email: profile.email,
            roles: ['user'],
            authProviders: [{
              provider: 'github',
              providerId: profile.id,
              profile: profile
            }]
          });
        }

        await user.save();
      }

      user.lastLogin = new Date();
      await user.save();

      const token = jwt.sign({ id: user._id }, JWT_CONFIG.secret, {
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
}
