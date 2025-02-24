export interface IUser {
  _id: string;
  name: string;
  email: string;
  roles: string[];
  twoFactorEnabled?: boolean;
  lastLogin?: Date;
}

interface LoginResponse {
  success?: boolean;
  require2FA?: boolean;
  user?: IUser;
}

export interface AuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  updateUser: (userData: { name?: string; email?: string }) => Promise<void>;
  login: (email: string, password: string, token2FA?: string) => Promise<LoginResponse>;
  SignInOrSignUpWithGithub: () => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}
