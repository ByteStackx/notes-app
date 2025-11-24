import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note, User } from '../types';

const USERS_KEY = '@notes_app_users';
const NOTES_KEY = '@notes_app_notes';
const CURRENT_USER_KEY = '@notes_app_current_user';

// User Storage Operations
export const saveUser = async (user: User): Promise<void> => {
  try {
    const usersJson = await AsyncStorage.getItem(USERS_KEY);
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];
    users.push(user);
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving user:', error);
    throw new Error('Failed to save user');
  }
};

export const getUsers = async (): Promise<User[]> => {
  try {
    const usersJson = await AsyncStorage.getItem(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const users = await getUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
};

export const setCurrentUser = async (user: User): Promise<void> => {
  try {
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error setting current user:', error);
    throw new Error('Failed to set current user');
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const userJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const clearCurrentUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
  } catch (error) {
    console.error('Error clearing current user:', error);
    throw new Error('Failed to clear current user');
  }
};

export const updateUser = async (updatedUser: User): Promise<void> => {
  try {
    const usersJson = await AsyncStorage.getItem(USERS_KEY);
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];
    const userIndex = users.findIndex(user => user.id === updatedUser.id);
    
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      
      // Update current user if it's the same user
      const currentUser = await getCurrentUser();
      if (currentUser && currentUser.id === updatedUser.id) {
        await setCurrentUser(updatedUser);
      }
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Failed to update user');
  }
};

export const saveNote = async (note: Note): Promise<void> => {
  try {
    const notesJson = await AsyncStorage.getItem(NOTES_KEY);
    const notes: Note[] = notesJson ? JSON.parse(notesJson) : [];
    notes.push(note);
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error('Error saving note:', error);
    throw new Error('Failed to save note');
  }
};

export const getNotesByUserId = async (userId: string): Promise<Note[]> => {
  try {
    const notesJson = await AsyncStorage.getItem(NOTES_KEY);
    const notes: Note[] = notesJson ? JSON.parse(notesJson) : [];
    return notes.filter(note => note.userId === userId);
  } catch (error) {
    console.error('Error getting notes:', error);
    return [];
  }
};

export const updateNote = async (updatedNote: Note): Promise<void> => {
  try {
    const notesJson = await AsyncStorage.getItem(NOTES_KEY);
    const notes: Note[] = notesJson ? JSON.parse(notesJson) : [];
    const noteIndex = notes.findIndex(note => note.id === updatedNote.id);
    
    if (noteIndex !== -1) {
      notes[noteIndex] = updatedNote;
      await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    } else {
      throw new Error('Note not found');
    }
  } catch (error) {
    console.error('Error updating note:', error);
    throw new Error('Failed to update note');
  }
};

export const deleteNote = async (noteId: string): Promise<void> => {
  try {
    const notesJson = await AsyncStorage.getItem(NOTES_KEY);
    const notes: Note[] = notesJson ? JSON.parse(notesJson) : [];
    const filteredNotes = notes.filter(note => note.id !== noteId);
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(filteredNotes));
  } catch (error) {
    console.error('Error deleting note:', error);
    throw new Error('Failed to delete note');
  }
};

