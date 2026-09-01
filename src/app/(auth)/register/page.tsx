'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, UserPlus, Sparkles } from 'lucide-react';
import { useAuth, Gender } from '@/hooks/useAuth';
import AuraStyleLogo from '@/components/AuraStyleLogo';

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500' };
  if (score <= 2) return { score, label: 'Fair', color: 'bg-amber-500' };
  if (score <= 3) return { score, label: 'Good', color: 'bg-blue-400' };
  if (score <= 4) return { score, label: 'Strong', color: 'bg-blue-500' };
  return { score, label: 'Very Strong', color: 'bg-[#FAF8F5]' };
}

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState<Gender>('female');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const result = register(name, email, password, gender, true);
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Registration failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Logo */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center mb-1">
          <AuraStyleLogo variant="mark" size="lg" />
        </div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#FAF8F5] tracking-tight">
          Create Account
        </h1>
        <p className="text-[#FAF8F5]/70 text-xs">Join AuraStyle AI in Royal Blue & Ivory</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-[#0f254e]/60 rounded-3xl p-6 md:p-8 space-y-4 border border-[#FAF8F5]/15 shadow-2xl backdrop-blur-xl text-[#FAF8F5]">
        {error && (
          <div className="bg-red-950/50 border border-red-500/30 text-red-200 text-xs rounded-xl px-4 py-2.5 flex items-center gap-2">
            <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-red-400" />
            {error}
          </div>
        )}

        <div className="space-y-3.5">
          {/* Category / Gender Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase text-[#FAF8F5]/70 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#93c5fd]" />
              Style Category
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
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
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  gender === 'male'
                    ? 'bg-[#FAF8F5] text-[#0a192f] border-[#FAF8F5] shadow-md'
                    : 'bg-[#0a192f]/60 border-[#FAF8F5]/10 text-[#FAF8F5]/70 hover:bg-[#16366f]/40'
                }`}
              >
                <span>👔 Men</span>
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-[#FAF8F5]/70">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FAF8F5]/40" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sophia Loren"
                required
                className="w-full bg-[#0a192f] border border-[#FAF8F5]/15 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-[#FAF8F5]/30 focus:outline-none focus:border-[#FAF8F5]/40"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-[#FAF8F5]/70">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FAF8F5]/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                required
                className="w-full bg-[#0a192f] border border-[#FAF8F5]/15 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-[#FAF8F5]/30 focus:outline-none focus:border-[#FAF8F5]/40"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-[#FAF8F5]/70">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FAF8F5]/40" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#0a192f] border border-[#FAF8F5]/15 rounded-xl py-2.5 pl-10 pr-11 text-xs text-white placeholder:text-[#FAF8F5]/30 focus:outline-none focus:border-[#FAF8F5]/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#FAF8F5]/40 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Strength indicator */}
            {password && (
              <div className="space-y-1 pt-1">
                <div className="flex gap-1 h-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`flex-1 rounded-full transition-all duration-300 ${
                        level <= strength.score ? strength.color : 'bg-[#FAF8F5]/10'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-[#FAF8F5]/70">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FAF8F5]/40" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#0a192f] border border-[#FAF8F5]/15 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-[#FAF8F5]/30 focus:outline-none focus:border-[#FAF8F5]/40"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl bg-[#FAF8F5] hover:bg-white text-[#0a192f] font-bold text-xs shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-[#0a192f]/30 border-t-[#0a192f] rounded-full animate-spin" />
          ) : (
            <>
              <UserPlus className="w-4 h-4 text-[#1e3a8a]" />
              <span>Create Account</span>
            </>
          )}
        </button>
      </form>

      {/* Footer */}
      <p className="text-center text-xs text-[#FAF8F5]/60">
        Already have an account?{' '}
        <Link href="/login" className="text-[#FAF8F5] font-bold hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
