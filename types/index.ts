export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  createdAt: string;
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: CategoryType;
  createdAt: string;
  updatedAt: string;
}

export type CategoryType = 'work' | 'study' | 'personal';

export interface Category {
  type: CategoryType;
  label: string;
  color: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (email: string, username: string, currentPassword: string, newPassword?: string) => Promise<void>;
  isLoading: boolean;
}
