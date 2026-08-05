'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, ArrowLeft, CheckCircle, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

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
      // No account found — still show reset step for security (won't work without valid token)
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
    <div className="space-y-8">
      {/* Logo */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/25 mb-2">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          {step === 'email' && 'Reset password'}
          {step === 'reset' && 'Set new password'}
          {step === 'success' && 'All set!'}
        </h1>
        <p className="text-slate-400 text-sm">
          {step === 'email' && 'Enter your email and we\'ll help you reset your password'}
          {step === 'reset' && 'Enter your new password below'}
          {step === 'success' && 'Your password has been reset successfully'}
        </p>
      </div>

      {/* Step 1: Email */}
      {step === 'email' && (
        <form onSubmit={handleEmailSubmit} className="glass-card rounded-2xl p-8 space-y-6">
          <div className="space-y-2">
            <label htmlFor="forgot-email" className="text-sm font-medium text-slate-300">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Continue'
            )}
          </button>
        </form>
      )}

      {/* Step 2: New Password */}
      {step === 'reset' && (
        <form onSubmit={handleResetSubmit} className="glass-card rounded-2xl p-8 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
              <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-red-400" />
              {error}
            </div>
          )}

          {!token && (
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm rounded-xl px-4 py-3">
              If an account exists for <strong>{email}</strong>, you can set a new password below.
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="new-password" className="text-sm font-medium text-slate-300">
                New password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirm-new-password" className="text-sm font-medium text-slate-300">
                Confirm new password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="confirm-new-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className={`w-full bg-white/5 border rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all ${
                    confirmPassword && confirmPassword !== newPassword
                      ? 'border-red-500/50'
                      : 'border-white/10'
                  }`}
                />
              </div>
              {confirmPassword && confirmPassword !== newPassword && (
                <p className="text-xs text-red-400">Passwords do not match</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !token}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Reset password'
            )}
          </button>
        </form>
      )}

      {/* Step 3: Success */}
      {step === 'success' && (
        <div className="glass-card rounded-2xl p-8 space-y-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <p className="text-slate-300">
            Your password has been updated. You can now sign in with your new password.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/25"
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
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to sign in
          </Link>
        </p>
      )}
    </div>
  );
}
