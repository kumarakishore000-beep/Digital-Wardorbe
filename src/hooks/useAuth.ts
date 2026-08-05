'use client';

import { useState, useEffect, useCallback } from 'react';

export interface User {
  email: string;
  name: string;
}

interface StoredUser {
  email: string;
  name: string;
  password: string;
}

interface ResetToken {
  email: string;
  token: string;
  expiresAt: number;
}

const USERS_KEY = 'stylematch-users';
const SESSION_KEY = 'stylematch-session';
const RESET_TOKENS_KEY = 'stylematch-reset-tokens';

function getStoredUsers(): StoredUser[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getSession(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(user: User | null): void {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

function getResetTokens(): ResetToken[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RESET_TOKENS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveResetTokens(tokens: ResetToken[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(RESET_TOKENS_KEY, JSON.stringify(tokens));
}

function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setUser(getSession());
    setIsLoaded(true);
  }, []);

  const isAuthenticated = !!user;

  const register = useCallback(
    (email: string, password: string, name: string): { success: boolean; error?: string } => {
      const users = getStoredUsers();
      const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        return { success: false, error: 'An account with this email already exists.' };
      }
      if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters.' };
      }
      users.push({ email: email.toLowerCase(), name, password });
      saveUsers(users);

      const newUser: User = { email: email.toLowerCase(), name };
      saveSession(newUser);
      setUser(newUser);
      return { success: true };
    },
    []
  );

  const login = useCallback(
    (email: string, password: string): { success: boolean; error?: string } => {
      const users = getStoredUsers();
      const found = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      if (!found) {
        return { success: false, error: 'Invalid email or password.' };
      }
      const loggedIn: User = { email: found.email, name: found.name };
      saveSession(loggedIn);
      setUser(loggedIn);
      return { success: true };
    },
    []
  );

  const logout = useCallback(() => {
    saveSession(null);
    setUser(null);
  }, []);

  const forgotPassword = useCallback(
    (email: string): { success: boolean; token?: string; error?: string } => {
      const users = getStoredUsers();
      const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!found) {
        // For security, don't reveal if email exists — but for demo, return success anyway
        return { success: true };
      }
      const token = generateToken();
      const tokens = getResetTokens().filter((t) => t.email !== email.toLowerCase());
      tokens.push({
        email: email.toLowerCase(),
        token,
        expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
      });
      saveResetTokens(tokens);
      return { success: true, token };
    },
    []
  );

  const resetPassword = useCallback(
    (token: string, newPassword: string): { success: boolean; error?: string } => {
      if (newPassword.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters.' };
      }
      const tokens = getResetTokens();
      const found = tokens.find((t) => t.token === token && t.expiresAt > Date.now());
      if (!found) {
        return { success: false, error: 'Invalid or expired reset token.' };
      }
      const users = getStoredUsers();
      const userIndex = users.findIndex((u) => u.email === found.email);
      if (userIndex === -1) {
        return { success: false, error: 'User not found.' };
      }
      users[userIndex].password = newPassword;
      saveUsers(users);

      // Remove used token
      saveResetTokens(tokens.filter((t) => t.token !== token));
      return { success: true };
    },
    []
  );

  return {
    user,
    isAuthenticated,
    isLoaded,
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
  };
}
