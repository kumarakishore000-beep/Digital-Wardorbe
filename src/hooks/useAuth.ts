'use client';

import { useState, useCallback } from 'react';

export type Gender = 'male' | 'female';

export interface User {
  email: string;
  name: string;
  gender: Gender;
}

interface StoredUser {
  email: string;
  name: string;
  password: string;
  gender: Gender;
}

interface ResetToken {
  email: string;
  token: string;
  expiresAt: number;
}

const USERS_KEY = 'stylematch-users';
const SESSION_KEY = 'stylematch-session';
const RESET_TOKENS_KEY = 'stylematch-reset-tokens';
const REMEMBERED_USER_KEY = 'stylematch-remembered-user';

export function getRememberedUser(): string {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem(REMEMBERED_USER_KEY) || '';
  } catch {
    return '';
  }
}

export function saveRememberedUser(usernameOrEmail: string): void {
  if (typeof window === 'undefined') return;
  if (usernameOrEmail.trim()) {
    localStorage.setItem(REMEMBERED_USER_KEY, usernameOrEmail.trim());
  } else {
    localStorage.removeItem(REMEMBERED_USER_KEY);
  }
}

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
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed.gender) parsed.gender = 'female';
    return parsed;
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
  const [user, setUser] = useState<User | null>(() => getSession());
  const [rememberedUser, setRememberedUserState] = useState<string>(() => getRememberedUser());
  const isLoaded = true;

  const isAuthenticated = !!user;

  const setRememberedUser = useCallback((usernameOrEmail: string) => {
    saveRememberedUser(usernameOrEmail);
    setRememberedUserState(usernameOrEmail);
  }, []);

  const register = useCallback(
    (
      email: string, 
      password: string, 
      name: string, 
      gender: Gender = 'female',
      remember: boolean = true
    ): { success: boolean; error?: string } => {
      const users = getStoredUsers();
      const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        return { success: false, error: 'An account with this email already exists.' };
      }
      if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters.' };
      }
      users.push({ email: email.toLowerCase(), name, password, gender });
      saveUsers(users);

      const newUser: User = { email: email.toLowerCase(), name, gender };
      saveSession(newUser);
      setUser(newUser);

      if (remember) {
        saveRememberedUser(email);
        setRememberedUserState(email);
      }
      return { success: true };
    },
    []
  );

  const login = useCallback(
    (
      email: string, 
      password: string, 
      genderPreference?: Gender,
      remember: boolean = true
    ): { success: boolean; error?: string } => {
      const users = getStoredUsers();
      const found = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      
      let loggedInUser: User;
      if (!found) {
        // If demo account / simple login attempt, allow with provided gender
        const demoGender = genderPreference || 'female';
        loggedInUser = { email: email.toLowerCase(), name: email.split('@')[0] || 'User', gender: demoGender };
      } else {
        const finalGender = genderPreference || found.gender || 'female';
        loggedInUser = { email: found.email, name: found.name, gender: finalGender };
      }

      saveSession(loggedInUser);
      setUser(loggedInUser);

      if (remember) {
        saveRememberedUser(email);
        setRememberedUserState(email);
      } else {
        saveRememberedUser('');
        setRememberedUserState('');
      }

      return { success: true };
    },
    []
  );

  const updateGender = useCallback((gender: Gender) => {
    setUser((prev) => {
      if (!prev) return { email: 'guest@aurastyle.ai', name: 'Guest Stylist', gender };
      const updated = { ...prev, gender };
      saveSession(updated);
      return updated;
    });
  }, []);

  const logout = useCallback(() => {
    saveSession(null);
    setUser(null);
  }, []);

  const forgotPassword = useCallback(
    (email: string): { success: boolean; token?: string; error?: string } => {
      const users = getStoredUsers();
      const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!found) {
        return { success: true };
      }
      const token = generateToken();
      const tokens = getResetTokens().filter((t) => t.email !== email.toLowerCase());
      tokens.push({
        email: email.toLowerCase(),
        token,
        expiresAt: Date.now() + 15 * 60 * 1000,
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

      saveResetTokens(tokens.filter((t) => t.token !== token));
      return { success: true };
    },
    []
  );

  return {
    user,
    rememberedUser,
    setRememberedUser,
    isAuthenticated,
    isLoaded,
    register,
    login,
    updateGender,
    logout,
    forgotPassword,
    resetPassword,
  };
}
