import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { INITIAL_USERS } from '../data/mockData';

interface AuthContextType {
  currentUser: User;
  allUsers: User[];
  registerUser: (userData: Omit<User, 'id' | 'joinedDate' | 'avatar'>) => User;
  loginUser: (email: string) => boolean;
  switchUser: (userId: string) => void;
  updateUserQuota: (userId: string, newQuota: number, newRate: number) => void;
}

const STORAGE_KEY_CURRENT = 'mining_safety_crm_current_user_id';
const STORAGE_KEY_USERS = 'mining_safety_crm_users';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USERS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load users from localStorage', e);
    }
    return INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CURRENT);
      if (saved && allUsers.some(u => u.id === saved)) {
        return saved;
      }
    } catch (e) {
      console.error('Failed to load current user', e);
    }
    return INITIAL_USERS[0].id; // Default to Marcus Vance
  });

  // Save users when changed
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(allUsers));
    } catch (e) {
      console.error('Error saving users', e);
    }
  }, [allUsers]);

  // Save current user id when changed
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CURRENT, currentUserId);
    } catch (e) {
      console.error('Error saving current user id', e);
    }
  }, [currentUserId]);

  const currentUser = allUsers.find(u => u.id === currentUserId) || allUsers[0] || INITIAL_USERS[0];

  const registerUser = (userData: Omit<User, 'id' | 'joinedDate' | 'avatar'>): User => {
    // Generate avatar based on name
    const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.name)}&backgroundColor=0284c7,f97316,059669`;
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      avatar,
      joinedDate: new Date().toISOString().split('T')[0],
      salesQuota: userData.salesQuota || 2000000,
      commissionRate: userData.commissionRate || 0.08,
      company: userData.company || 'Mining Safety Solutions Global',
    };

    setAllUsers(prev => [newUser, ...prev]);
    setCurrentUserId(newUser.id);
    return newUser;
  };

  const loginUser = (email: string): boolean => {
    const user = allUsers.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (user) {
      setCurrentUserId(user.id);
      return true;
    }
    return false;
  };

  const switchUser = (userId: string) => {
    if (allUsers.some(u => u.id === userId)) {
      setCurrentUserId(userId);
    }
  };

  const updateUserQuota = (userId: string, newQuota: number, newRate: number) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, salesQuota: newQuota, commissionRate: newRate } : u));
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      allUsers,
      registerUser,
      loginUser,
      switchUser,
      updateUserQuota
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
