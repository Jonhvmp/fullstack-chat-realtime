import { AuthService } from '../services/auth.service';
import User from '../models/user.model';
import jwt from 'jsonwebtoken';

jest.mock('../models/user.model');

describe('AuthService.register', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('deve lançar erro se o email já estiver cadastrado', async () => {
    (User.findOne as jest.Mock).mockResolvedValue({ email: 'teste@exemplo.com' });
    await expect(AuthService.register({ email: 'teste@exemplo.com', password: '123456' }))
      .rejects.toThrow('Email já cadastrado.');
  });

  it('deve lançar erro se a senha não for informada', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    await expect(AuthService.register({ email: 'novo@exemplo.com' }))
      .rejects.toThrow('Senha é obrigatória.');
  });

  it('deve lançar erro se a senha tiver menos de 6 caracteres', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    await expect(AuthService.register({ email: 'novo@exemplo.com', password: '12345' }))
      .rejects.toThrow('Senha deve ter no mínimo 6 caracteres.');
  });
});

describe('AuthService.login', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('deve lançar erro se o usuário não for encontrado', async () => {
    (User.findOne as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockResolvedValue(null)
    }));
    await expect(AuthService.login('teste@exemplo.com', '123456'))
      .rejects.toThrow('Usuário não encontrado!');
  });

  it('deve lançar erro se a senha for inválida', async () => {
    const userMock = {
      comparePassword: jest.fn().mockResolvedValue(false),
      save: jest.fn(),
      _id: '1'
    };
    (User.findOne as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockResolvedValue(userMock)
    }));
    await expect(AuthService.login('teste@exemplo.com', 'senhaErrada'))
      .rejects.toThrow('Credenciais inválidas!');
  });

  it('deve retornar token e usuário se as credenciais forem válidas', async () => {
    const userMock = {
      comparePassword: jest.fn().mockResolvedValue(true),
      save: jest.fn().mockResolvedValue(true),
      _id: '1'
    };
    (User.findOne as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockResolvedValue(userMock)
    }));
    jest.spyOn(jwt, 'sign').mockImplementation(() => 'fake-token' as any);
    const result = await AuthService.login('teste@exemplo.com', '123456');
    expect(result).toHaveProperty('token', 'fake-token');
    expect(result).toHaveProperty('user', userMock);
  });
});

describe('AuthService.githubAuth', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('deve buscar usuário pelo provider e retornar token se encontrado', async () => {
    const userMock = {
      save: jest.fn().mockResolvedValue(true),
      _id: '1'
    };
    // Primeira busca: usuário com GitHub
    (User.findOne as jest.Mock)
      .mockResolvedValueOnce(userMock);
    jest.spyOn(jwt, 'sign').mockReturnValue('fake-token' as any);

    const profile = { id: 'github-id', email: 'teste@exemplo.com', name: 'Teste', username: 'teste' };
    const result = await AuthService.githubAuth(profile);
    expect(result).toHaveProperty('token', 'fake-token');
    expect(result).toHaveProperty('user', userMock);
  });
});

describe('AuthService.getUsers', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('deve retornar todos os usuários', async () => {
    const usersMock = [{ name: 'Teste', email: 'test@exemplo.com' }];
    (User.find as jest.Mock).mockResolvedValue(usersMock);
    const result = await AuthService.getUsers();
    expect(result).toEqual(usersMock);
  }
  )}
);

describe('AuthService.getUserById', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('deve retornar usuário pelo id', async () => {
    const userMock = { name: 'Teste', email: 'test@exemplo.com' };
    (User.findById as jest.Mock).mockResolvedValue(userMock);
    const result = await AuthService.getUserById('1');
    expect(result).toEqual(userMock);
  });
});
