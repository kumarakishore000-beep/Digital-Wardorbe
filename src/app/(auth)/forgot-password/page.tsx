'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, ArrowLeft, CheckCircle, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import AuraStyleLogo from '@/components/AuraStyleLogo';

export default function ForgotPasswordPage() {
  const { forgotPassword, resetPassword } = useAuth();
  const [step, setStep] = useState<'email' | 'reset' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 800));

    const result = forgotPassword(email);
    if (result.success && result.token) {
      setToken(result.token);
      setStep('reset');
    } else if (result.success) {
      setStep('reset');
    }
    setIsLoading(false);
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const result = resetPassword(token, newPassword);
    if (result.success) {
      setStep('success');
    } else {
      setError(result.error || 'Reset failed. The link may have expired.');
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Logo */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center mb-1">
          <AuraStyleLogo variant="mark" size="lg" />
        </div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#FAF8F5] tracking-tight">
          {step === 'email' && 'Reset Password'}
          {step === 'reset' && 'Set New Password'}
          {step === 'success' && 'Password Updated'}
        </h1>
        <p className="text-[#FAF8F5]/70 text-xs">
          {step === 'email' && 'Enter your email and we\'ll send you a recovery link'}
          {step === 'reset' && 'Enter your new password below'}
          {step === 'success' && 'Your password has been reset successfully'}
        </p>
      </div>

      {/* Step 1: Email */}
      {step === 'email' && (
        <form onSubmit={handleEmailSubmit} className="bg-[#0f254e]/60 rounded-3xl p-6 md:p-8 space-y-4 border border-[#FAF8F5]/15 shadow-2xl backdrop-blur-xl text-[#FAF8F5]">
          <div className="space-y-1">
            <label htmlFor="forgot-email" className="text-xs font-mono uppercase text-[#FAF8F5]/70">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FAF8F5]/40" />
              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                required
                className="w-full bg-[#0a192f] border border-[#FAF8F5]/15 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-[#FAF8F5]/30 focus:outline-none focus:border-[#FAF8F5]/40 transition-all"
              />
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
              'Send Recovery Link'
            )}
          </button>
        </form>
      )}

      {/* Step 2: New Password */}
      {step === 'reset' && (
        <form onSubmit={handleResetSubmit} className="bg-[#0f254e]/60 rounded-3xl p-6 md:p-8 space-y-4 border border-[#FAF8F5]/15 shadow-2xl backdrop-blur-xl text-[#FAF8F5]">
          {error && (
            <div className="bg-red-950/50 border border-red-500/30 text-red-200 text-xs rounded-xl px-4 py-2.5 flex items-center gap-2">
              <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-red-400" />
              {error}
            </div>
          )}

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-[#FAF8F5]/70">New password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FAF8F5]/40" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full bg-[#0a192f] border border-[#FAF8F5]/15 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-[#FAF8F5]/30 focus:outline-none focus:border-[#FAF8F5]/40"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-[#FAF8F5]/70">Confirm new password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FAF8F5]/40" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full bg-[#0a192f] border border-[#FAF8F5]/15 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-[#FAF8F5]/30 focus:outline-none focus:border-[#FAF8F5]/40"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !token}
            className="w-full py-3 rounded-xl bg-[#FAF8F5] hover:bg-white text-[#0a192f] font-bold text-xs shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-[#0a192f]/30 border-t-[#0a192f] rounded-full animate-spin" />
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      )}

      {/* Step 3: Success */}
      {step === 'success' && (
        <div className="bg-[#0f254e]/60 rounded-3xl p-8 space-y-4 text-center border border-[#FAF8F5]/15 shadow-2xl backdrop-blur-xl text-[#FAF8F5]">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#FAF8F5] text-[#0a192f]">
            <CheckCircle className="w-7 h-7 text-[#1e3a8a]" />
          </div>
          <p className="text-xs text-[#FAF8F5]/80">
            Your password has been updated. You can now sign in with your new password.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 bg-[#FAF8F5] hover:bg-white text-[#0a192f] font-bold py-2.5 px-6 rounded-xl transition-all text-xs shadow-lg"
          >
            Back to sign in
          </Link>
        </div>
      )}

      {/* Back link */}
      {step !== 'success' && (
        <p className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs text-[#FAF8F5]/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to sign in
          </Link>
        </p>
      )}
    </div>
  );
}
