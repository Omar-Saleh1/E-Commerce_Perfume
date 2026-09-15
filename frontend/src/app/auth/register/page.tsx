'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/patterns/ui-factory/AbstractComponentFactory';
import { ShoppingCart, Mail, Lock, User, Phone } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    setLoading(true);
    const success = await register(name, email, password, phone);
    setLoading(false);
    if (success) {
      router.push('/');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-stone-900 text-stone-100 dark:bg-gradient-to-tr dark:from-indigo-500 dark:to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-md">
            <ShoppingCart className="w-6 h-6 text-amber-300 dark:text-white" />
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-stone-900 dark:text-white">Create Account</h1>
          <p className="text-stone-500 dark:text-slate-400 text-xs sm:text-sm mt-1">Join MATJARI for exclusive luxury pieces</p>
        </div>

        <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-slate-400 block mb-1.5">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-white dark:bg-slate-950/80 border border-stone-300 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-900 dark:text-white focus:outline-none focus:border-stone-800 dark:focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-slate-400 block mb-1.5">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full bg-white dark:bg-slate-950/80 border border-stone-300 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-900 dark:text-white focus:outline-none focus:border-stone-800 dark:focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-slate-400 block mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-white dark:bg-slate-950/80 border border-stone-300 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-900 dark:text-white focus:outline-none focus:border-stone-800 dark:focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-slate-400 block mb-1.5">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white dark:bg-slate-950/80 border border-stone-300 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-900 dark:text-white focus:outline-none focus:border-stone-800 dark:focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-slate-400 block mb-1.5">Confirm Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white dark:bg-slate-950/80 border border-stone-300 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-900 dark:text-white focus:outline-none focus:border-stone-800 dark:focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full mt-2"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-stone-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-bold text-stone-900 dark:text-indigo-400 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
