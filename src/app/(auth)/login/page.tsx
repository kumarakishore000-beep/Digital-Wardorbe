'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, LogIn, Sparkles, User as UserIcon, Check, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useAuth, Gender } from '@/hooks/useAuth';
import AuraStyleLogo from '@/components/AuraStyleLogo';

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
      <div className="text-center space-y-2 relative z-10">
        <div className="inline-flex items-center justify-center mb-1">
          <AuraStyleLogo variant="mark" size="lg" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-black text-[#FAF8F5]">
            Welcome Back
          </h1>
          <p className="text-xs text-[#FAF8F5]/70 mt-1 max-w-xs mx-auto">
            Access your curated moodboards, digital wardrobe, and AI styling.
          </p>
        </div>
      </div>

      {/* Login Card */}
      <div className="bg-[#0f254e]/60 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-[#FAF8F5]/15 shadow-2xl space-y-6 relative z-10 overflow-hidden text-[#FAF8F5]">
        {/* Quick Remembered User Badge */}
        {rememberedUser && (
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#1e3a8a]/40 border border-[#FAF8F5]/20 text-xs">
            <div className="flex items-center gap-2 text-[#FAF8F5]">
              <ShieldCheck className="w-4 h-4 text-[#FAF8F5] shrink-0" />
              <span>Saved account: <strong>{rememberedUser}</strong></span>
            </div>
            <button
              type="button"
              onClick={() => setEmail(rememberedUser)}
              className="text-[10px] uppercase font-bold text-[#0a192f] bg-[#FAF8F5] hover:bg-white px-2 py-1 rounded-lg transition-all"
            >
              Fill
            </button>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="bg-red-950/50 border border-red-500/40 text-red-200 text-xs rounded-2xl px-4 py-3 flex items-center gap-2">
            <span className="shrink-0 w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {/* Style Preference Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase text-[#FAF8F5]/70 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-[#93c5fd]" />
                Lookbook Category
              </span>
            </label>
            
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`py-2.5 px-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  gender === 'female'
                    ? 'bg-[#FAF8F5] text-[#0a192f] border-[#FAF8F5] shadow-md'
                    : 'bg-[#0a192f]/60 border-[#FAF8F5]/10 text-[#FAF8F5]/70 hover:bg-[#16366f]/40'
                }`}
              >
                <span>👗 Women</span>
              </button>

              <button
                type="button"
                onClick={() => setGender('male')}
                className={`py-2.5 px-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  gender === 'male'
                    ? 'bg-[#FAF8F5] text-[#0a192f] border-[#FAF8F5] shadow-md'
                    : 'bg-[#0a192f]/60 border-[#FAF8F5]/10 text-[#FAF8F5]/70 hover:bg-[#16366f]/40'
                }`}
              >
                <span>👔 Men</span>
              </button>
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-1">
            <label htmlFor="login-email" className="text-xs font-mono uppercase text-[#FAF8F5]/70">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FAF8F5]/40" />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                required
                className="w-full bg-[#0a192f] border border-[#FAF8F5]/15 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-[#FAF8F5]/30 focus:outline-none focus:border-[#FAF8F5]/40 transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label htmlFor="login-password" className="text-xs font-mono uppercase text-[#FAF8F5]/70">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[11px] text-[#93c5fd] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FAF8F5]/40" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#0a192f] border border-[#FAF8F5]/15 rounded-xl py-2.5 pl-10 pr-11 text-xs text-white placeholder:text-[#FAF8F5]/30 focus:outline-none focus:border-[#FAF8F5]/40 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#FAF8F5]/40 hover:text-white"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-[#FAF8F5] hover:bg-white text-[#0a192f] font-bold text-xs shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-[#0a192f]/30 border-t-[#0a192f] rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4 text-[#1e3a8a]" />
                <span>Sign In & Continue</span>
                <ArrowRight className="w-4 h-4 text-[#1e3a8a]" />
              </>
            )}
          </button>

          {/* Quick Demo Button */}
          <button
            type="button"
            onClick={handleQuickDemo}
            className="w-full py-2 rounded-xl bg-[#1e3a8a]/40 hover:bg-[#1e3a8a] border border-[#FAF8F5]/20 text-[#FAF8F5] text-xs font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <Zap className="w-4 h-4 text-[#fffff0]" />
            <span>Instant 1-Click Guest Experience</span>
          </button>
        </form>
      </div>

      {/* Footer Navigation */}
      <p className="text-center text-xs text-[#FAF8F5]/60">
        Don&apos;t have an account yet?{' '}
        <Link href="/register" className="text-[#FAF8F5] font-bold hover:underline">
          Create Account
        </Link>
      </p>
    </motion.div>
  );
}
