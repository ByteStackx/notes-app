export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  createdAt: string;
}



export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (email: string, username: string, currentPassword: string, newPassword?: string) => Promise<void>;
  isLoading: boolean;
}
