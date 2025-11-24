import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType, User } from '../types';
import {
  clearCurrentUser,
  getCurrentUser,
  getUserByEmail,
  saveUser,
  setCurrentUser,
  updateUser
} from '../utils/storage';
import { hashPassword } from '../utils/validation';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, username: string, password: string): Promise<void> => {
    try {
      // Check if user already exists
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email: email.toLowerCase(),
        username,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
      };

      // Save user
      await saveUser(newUser);
      await setCurrentUser(newUser);
      setUser(newUser);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      // Get user by email
      const existingUser = await getUserByEmail(email);
      if (!existingUser) {
        throw new Error('Invalid email or password');
      }

      // Verify password
      const hashedPassword = await hashPassword(password);
      if (existingUser.password !== hashedPassword) {
        throw new Error('Invalid email or password');
      }

      // Set current user
      await setCurrentUser(existingUser);
      setUser(existingUser);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await clearCurrentUser();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const updateProfile = async (
    email: string,
    username: string,
    currentPassword: string,
    newPassword?: string
  ): Promise<void> => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      // Verify current password
      const hashedCurrentPassword = await hashPassword(currentPassword);
      if (user.password !== hashedCurrentPassword) {
        throw new Error('Current password is incorrect');
      }

      // Check if new email already exists (if changed)
      if (email.toLowerCase() !== user.email.toLowerCase()) {
        const existingUser = await getUserByEmail(email);
        if (existingUser && existingUser.id !== user.id) {
          throw new Error('Email already in use by another account');
        }
      }

      // Create updated user object
      const updatedUser: User = {
        ...user,
        email: email.toLowerCase(),
        username,
        password: newPassword ? await hashPassword(newPassword) : user.password,
      };

      // Update user in storage
      await updateUser(updatedUser);
      setUser(updatedUser);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
