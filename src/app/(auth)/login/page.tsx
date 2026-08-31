'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, LogIn, Sparkles, User as UserIcon, Check, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useAuth, Gender } from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { login, rememberedUser } = useAuth();
  const [email, setEmail] = useState(() => rememberedUser || '');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState<Gender>('female');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Brief delay for smooth UX transition
    await new Promise((r) => setTimeout(r, 600));

    const result = login(email, password, gender, rememberMe);
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Login failed');
      setIsLoading(false);
    }
  };

  const handleQuickDemo = () => {
    const demoEmail = 'guest@aurastyle.ai';
    const demoPass = 'password123';
    login(demoEmail, demoPass, gender, rememberMe);
    router.push('/dashboard');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 relative"
    >
      {/* Header Branding */}
      <div className="text-center space-y-3 relative z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[2px] shadow-xl shadow-purple-500/20 mb-1 group">
          <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center group-hover:scale-95 transition-transform duration-300">
            <Sparkles className="w-8 h-8 text-pink-400" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-purple-300">
            Welcome Back to AuraStyle
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Access your saved outfits, AI recommendations, and rewards
          </p>
        </div>
      </div>

      {/* Login Card */}
      <div className="bg-slate-900/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6 relative z-10 overflow-hidden">
        {/* Ambient Top & Bottom Light Mesh Glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Quick Remembered User Badge */}
        {rememberedUser && (
          <div className="flex items-center justify-between p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 text-xs">
            <div className="flex items-center gap-2 text-indigo-200">
              <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Remembered: <strong className="text-white">{rememberedUser}</strong></span>
            </div>
            <button
              type="button"
              onClick={() => setEmail(rememberedUser)}
              className="text-[10px] uppercase font-bold text-indigo-400 hover:text-indigo-300 px-2 py-1 rounded-lg bg-indigo-500/20 transition-all"
            >
              Fill
            </button>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-2xl px-4 py-3 flex items-center gap-2">
            <span className="shrink-0 w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          {/* Style Preference Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-indigo-400" />
                Style Spectrum / Gender
              </span>
              <span className="text-[10px] text-slate-400 font-normal">Customizes suggestions</span>
            </label>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`py-3 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2.5 transition-all duration-300 ${
                  gender === 'female'
                    ? 'bg-gradient-to-r from-pink-500/30 to-purple-600/30 border-pink-400 text-white shadow-lg shadow-pink-500/20 ring-1 ring-pink-400/50 scale-[1.02]'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                }`}
              >
                <span className="text-base">👗</span>
                <span>Women&apos;s Style</span>
              </button>

              <button
                type="button"
                onClick={() => setGender('male')}
                className={`py-3 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2.5 transition-all duration-300 ${
                  gender === 'male'
                    ? 'bg-gradient-to-r from-indigo-500/30 to-cyan-600/30 border-indigo-400 text-white shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-400/50 scale-[1.02]'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                }`}
              >
                <span className="text-base">👔</span>
                <span>Men&apos;s Style</span>
              </button>
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-1.5">
            <label htmlFor="login-email" className="text-xs font-semibold text-slate-300">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                required
                className="w-full bg-slate-950/60 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="login-password" className="text-xs font-semibold text-slate-300">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-slate-950/60 border border-white/10 rounded-2xl py-3 pl-10 pr-11 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me Switch */}
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
              <span className="text-xs text-slate-300 font-medium">Remember my username</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold text-xs shadow-xl shadow-indigo-500/25 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 transform active:scale-[0.98]"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative my-4 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <span className="relative px-3 bg-slate-900 text-[10px] uppercase font-mono tracking-wider text-slate-400">
              Instant Access
            </span>
          </div>

          {/* Quick Demo Button */}
          <button
            type="button"
            onClick={handleQuickDemo}
            className="w-full py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all hover:border-amber-400/40 group"
          >
            <Zap className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>Quick 1-Click Guest Experience</span>
          </button>
        </form>
      </div>

      {/* Footer Navigation */}
      <p className="text-center text-xs text-slate-400">
        Don&apos;t have an account yet?{' '}
        <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors underline underline-offset-4">
          Create Account
        </Link>
      </p>
    </motion.div>
  );
}
