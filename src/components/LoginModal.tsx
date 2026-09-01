'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, User as UserIcon, ArrowRight, Sparkles, CheckCircle2, AlertCircle, Check, ShieldCheck } from 'lucide-react';
import { useAuth, Gender } from '@/hooks/useAuth';
import AuraStyleLogo from '@/components/AuraStyleLogo';

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
  message = 'Sign in to save this complete look to your digital wardrobe collection.',
}: LoginModalProps) {
  const { login, register, rememberedUser } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  const [email, setEmail] = useState(() => rememberedUser || '');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>('female');
  const [rememberMe, setRememberMe] = useState(true);
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const result = login(email, password, gender, rememberMe);
        if (!result.success) {
          setError(result.error || 'Login failed. Please check your credentials.');
          setIsLoading(false);
          return;
        }
      } else {
        const result = register(name, email, password, gender, rememberMe);
        if (!result.success) {
          setError(result.error || 'Registration failed.');
          setIsLoading(false);
          return;
        }
      }

      setSuccess(true);
      setIsLoading(false);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1000);
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleQuickDemo = () => {
    const demoEmail = 'guest@aurastyle.ai';
    const demoPass = 'password123';
    login(demoEmail, demoPass, gender, true);
    setSuccess(true);
    setTimeout(() => {
      onSuccess?.();
      onClose();
    }, 800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-[#0a192f] border-2 border-[#FAF8F5]/20 rounded-3xl p-6 shadow-2xl space-y-5 overflow-hidden text-[#FAF8F5]"
        >
          {/* Background Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#1e3a8a]/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#FAF8F5]/5 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#FAF8F5]/60 hover:text-white rounded-full bg-[#FAF8F5]/10 hover:bg-[#FAF8F5]/20 transition-colors z-20"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header Badge & Title */}
          <div className="space-y-2 relative z-10 flex items-start gap-3">
            <AuraStyleLogo variant="mark" size="sm" className="mt-1" />
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1e3a8a]/40 border border-[#FAF8F5]/20 text-[#FAF8F5] text-[10px] font-semibold">
                <ShieldCheck className="w-3 h-3 text-[#38BDF8]" />
                <span>AuraStyle Atelier Vault</span>
              </div>
              <h3 className="text-lg font-serif font-black text-[#FAF8F5] tracking-tight mt-1">{title}</h3>
              <p className="text-xs text-[#FAF8F5]/70 leading-relaxed">{message}</p>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="grid grid-cols-2 p-1 bg-[#050d1a] rounded-2xl border border-[#FAF8F5]/15 text-xs font-semibold relative z-10">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`py-2 rounded-xl transition-all ${
                mode === 'login'
                  ? 'bg-[#FAF8F5] text-[#0a192f] shadow-md font-bold'
                  : 'text-[#FAF8F5]/60 hover:text-white'
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
                  ? 'bg-[#FAF8F5] text-[#0a192f] shadow-md font-bold'
                  : 'text-[#FAF8F5]/60 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Auto-fill Remembered Email Hint */}
          {rememberedUser && mode === 'login' && (
            <div className="p-2.5 rounded-xl bg-[#1e3a8a]/30 border border-[#FAF8F5]/20 text-[11px] text-[#FAF8F5] flex items-center justify-between relative z-10">
              <span className="truncate">Saved account found: <strong>{rememberedUser}</strong></span>
              <button
                type="button"
                onClick={() => setEmail(rememberedUser)}
                className="text-[10px] uppercase font-bold text-[#0a192f] bg-[#FAF8F5] hover:bg-white px-2 py-1 rounded-lg shrink-0 transition-all ml-2"
              >
                Use
              </button>
            </div>
          )}

          {/* Success Banner */}
          {success ? (
            <div className="p-4 rounded-2xl bg-[#FAF8F5] text-[#0a192f] text-xs font-bold flex items-center justify-center gap-2 animate-bounce relative z-10 border border-[#0a192f]/20">
              <CheckCircle2 className="w-5 h-5 text-[#1e3a8a]" />
              Authenticated! Syncing with your digital wardrobe...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              {error && (
                <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-300" />
                  <span>{error}</span>
                </div>
              )}

              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-mono uppercase text-[#FAF8F5]/70 mb-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-[#FAF8F5]/40" />
                    <input
                      type="text"
                      placeholder="e.g. Sophia Loren"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#050d1a] border border-[#FAF8F5]/15 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-[#FAF8F5]/40"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono uppercase text-[#FAF8F5]/70 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#FAF8F5]/40" />
                  <input
                    type="email"
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#050d1a] border border-[#FAF8F5]/15 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-[#FAF8F5]/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#FAF8F5]/70 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#FAF8F5]/40" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#050d1a] border border-[#FAF8F5]/15 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-[#FAF8F5]/40"
                  />
                </div>
              </div>

              {/* Style Category Preference */}
              <div>
                <label className="block text-xs font-mono uppercase text-[#FAF8F5]/70 mb-1">Aesthetic Category</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      gender === 'female'
                        ? 'bg-[#FAF8F5] text-[#0a192f] border-[#FAF8F5] shadow-sm'
                        : 'bg-[#050d1a] text-[#FAF8F5]/70 border-[#FAF8F5]/15'
                    }`}
                  >
                    👗 Women&apos;s Lookbooks
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      gender === 'male'
                        ? 'bg-[#FAF8F5] text-[#0a192f] border-[#FAF8F5] shadow-sm'
                        : 'bg-[#050d1a] text-[#FAF8F5]/70 border-[#FAF8F5]/15'
                    }`}
                  >
                    👔 Men&apos;s Lookbooks
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
                        ? 'bg-[#FAF8F5] border-[#FAF8F5] text-[#0a192f]'
                        : 'border-[#FAF8F5]/30 bg-transparent'
                    }`}
                  >
                    {rememberMe && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="text-xs text-[#FAF8F5]/70">Remember my session</span>
                </label>
              </div>

              {/* Submit Action Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#FAF8F5] hover:bg-white text-[#0a192f] font-bold text-xs shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <span>{mode === 'login' ? 'Sign In & Save' : 'Create Account & Save'}</span>
                <ArrowRight className="w-4 h-4 text-[#1e3a8a]" />
              </button>

              {/* Divider */}
              <div className="relative my-3 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#FAF8F5]/10" />
                </div>
                <span className="relative px-3 bg-[#0a192f] text-[10px] uppercase font-mono text-[#FAF8F5]/40">
                  Or instant access
                </span>
              </div>

              {/* Quick 1-Click Guest Save Button */}
              <button
                type="button"
                onClick={handleQuickDemo}
                className="w-full py-2.5 rounded-xl bg-[#1e3a8a]/40 hover:bg-[#1e3a8a] border border-[#FAF8F5]/20 text-[#FAF8F5] text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4 text-[#fffff0]" />
                Instant 1-Click Guest Access
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
