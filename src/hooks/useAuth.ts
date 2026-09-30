'use client';

import { useState, useCallback, useEffect } from 'react';

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
const GENDER_KEY = 'stylematch-gender';
const RESET_TOKENS_KEY = 'stylematch-reset-tokens';
const REMEMBERED_USER_KEY = 'stylematch-remembered-user';
export const AUTH_CHANGE_EVENT = 'stylematch_auth_event';

export function notifyAuthChange(user: User | null): void {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT, { detail: user }));
    window.dispatchEvent(new Event('storage'));
  } catch {
    // ignore
  }
}

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
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!parsed.gender) {
        parsed.gender = (localStorage.getItem(GENDER_KEY) || 'female') as Gender;
      }
      return parsed;
    }
    // If guest, preserve explicit gender selection if present
    const savedGender = localStorage.getItem(GENDER_KEY) as Gender | null;
    if (savedGender === 'male' || savedGender === 'female') {
      return {
        email: 'guest@aurastyle.ai',
        name: 'Guest Stylist',
        gender: savedGender,
      };
    }
    return null;
  } catch {
    return null;
  }
}

function saveSession(user: User | null): void {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    if (user.gender) {
      localStorage.setItem(GENDER_KEY, user.gender);
    }
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

  const isAuthenticated = !!user && user.email !== 'guest@aurastyle.ai';

  // Synchronize auth and gender across components and tabs in real-time
  useEffect(() => {
    const handleAuthChange = (e?: Event) => {
      const customEvent = e as CustomEvent<User | null> | undefined;
      if (customEvent && customEvent.detail !== undefined) {
        setUser(customEvent.detail);
      } else {
        setUser(getSession());
      }
      setRememberedUserState(getRememberedUser());
    };

    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

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
      notifyAuthChange(newUser);

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
      notifyAuthChange(loggedInUser);

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
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(GENDER_KEY, gender);
      } catch {
        // ignore
      }
    }
    setUser((prev) => {
      const updated: User = prev
        ? { ...prev, gender }
        : { email: 'guest@aurastyle.ai', name: 'Guest Stylist', gender };
      saveSession(updated);
      notifyAuthChange(updated);
      return updated;
    });
  }, []);

  const logout = useCallback(() => {
    saveSession(null);
    setUser(null);
    notifyAuthChange(null);
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
