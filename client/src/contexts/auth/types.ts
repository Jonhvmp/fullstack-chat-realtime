export interface IUser {
  _id: string;
  name: string;
  email: string;
  roles: string[];
  lastLogin?: Date;
}

export interface AuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGithub: () => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}
