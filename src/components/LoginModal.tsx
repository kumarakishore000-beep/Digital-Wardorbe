'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, User as UserIcon, ArrowRight, Sparkles, CheckCircle2, AlertCircle, Check, ShieldCheck } from 'lucide-react';
import { useAuth, Gender } from '@/hooks/useAuth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  title?: string;
  message?: string;
}

export default function LoginModal({
  isOpen,
  onClose,
  onSuccess,
  title = 'Sign In to Save Your Outfit',
  message = 'Create an account or sign in to save this outfit to your digital wardrobe collection.',
}: LoginModalProps) {
  const { login, register, rememberedUser } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Form states initialized safely without setState in effect
  const [email, setEmail] = useState(() => rememberedUser || '');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>('female');
  const [rememberMe, setRememberMe] = useState(true);
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (mode === 'login') {
      const res = login(email, password, gender, rememberMe);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1000);
      } else {
        setError(res.error || 'Invalid credentials.');
      }
    } else {
      if (!name) {
        setError('Please enter your full name.');
        return;
      }
      const res = register(name, email, password, gender, rememberMe);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1000);
      } else {
        setError(res.error || 'Registration failed.');
      }
    }
  };

  const handleQuickDemo = () => {
    login('demo@aurastyle.ai', 'demo123', 'female', true);
    setSuccess(true);
    setTimeout(() => {
      onSuccess?.();
      onClose();
    }, 800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-slate-900 border border-white/15 rounded-3xl p-6 shadow-2xl space-y-5 overflow-hidden"
        >
          {/* Background Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors z-20"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header Badge & Title */}
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>AuraStyle Personal Wardrobe Vault</span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{message}</p>
          </div>

          {/* Mode Tabs */}
          <div className="grid grid-cols-2 p-1 bg-black/40 rounded-2xl border border-white/10 text-xs font-semibold relative z-10">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`py-2 rounded-xl transition-all ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError(null);
              }}
              className={`py-2 rounded-xl transition-all ${
                mode === 'register'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Auto-fill Remembered Email Hint */}
          {rememberedUser && mode === 'login' && (
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-200 flex items-center justify-between relative z-10">
              <span className="truncate">Saved account found: <strong>{rememberedUser}</strong></span>
              <button
                type="button"
                onClick={() => setEmail(rememberedUser)}
                className="text-[10px] uppercase font-bold text-indigo-300 hover:text-white px-2 py-1 rounded-lg bg-indigo-500/25 shrink-0 transition-all ml-2"
              >
                Use
              </button>
            </div>
          )}

          {/* Success Banner */}
          {success ? (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 animate-bounce relative z-10">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Authenticated! Saving item to your wardrobe...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. Sophia Loren"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              </div>

              {/* Style Category Preference */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Style Category</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      gender === 'female'
                        ? 'bg-pink-500/20 text-pink-300 border-pink-500/40 shadow-sm'
                        : 'bg-white/5 text-slate-400 border-white/10'
                    }`}
                  >
                    👗 Women&apos;s Style
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      gender === 'male'
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-sm'
                        : 'bg-white/5 text-slate-400 border-white/10'
                    }`}
                  >
                    👔 Men&apos;s Style
                  </button>
                </div>
              </div>

              {/* Remember Username Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div
                    onClick={() => setRememberMe(!rememberMe)}
                    className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                      rememberMe
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 border-indigo-400 text-white'
                        : 'border-white/20 bg-white/5'
                    }`}
                  >
                    {rememberMe && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="text-xs text-slate-300 font-medium">Remember username on this device</span>
                </label>
              </div>

              {/* Submit Action Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
              >
                <span>{mode === 'login' ? 'Sign In & Save' : 'Create Account & Save'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Divider */}
              <div className="relative my-3 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <span className="relative px-3 bg-slate-900 text-[10px] uppercase font-mono text-slate-400">
                  Or instant access
                </span>
              </div>

              {/* Quick 1-Click Guest Save Button */}
              <button
                type="button"
                onClick={handleQuickDemo}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                Quick 1-Click Guest Save
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
