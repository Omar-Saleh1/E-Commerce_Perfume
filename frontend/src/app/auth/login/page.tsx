'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/patterns/ui-factory/AbstractComponentFactory';
import { ShoppingCart, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      router.push('/');
    }
  };

  const setDemoUser = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-stone-900 text-stone-100 dark:bg-gradient-to-tr dark:from-indigo-500 dark:to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-md">
            <ShoppingCart className="w-6 h-6 text-amber-300 dark:text-white" />
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-stone-900 dark:text-white">Welcome Back</h1>
          <p className="text-stone-500 dark:text-slate-400 text-xs sm:text-sm mt-1">Sign in to your MATJARI account</p>
        </div>

        <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-slate-400 block mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@nexus.com"
                  className="w-full bg-white dark:bg-slate-950/80 border border-stone-300 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-900 dark:text-white focus:outline-none focus:border-stone-800 dark:focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-slate-400 block mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-stone-200 dark:border-white/10">
            <div className="text-[11px] font-bold text-stone-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
              ⚡ 1-Click Demo Accounts
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDemoUser('admin@store.com', 'admin123456')}
                className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-indigo-500/10 border border-stone-300 dark:border-indigo-500/20 text-xs font-bold text-stone-800 dark:text-indigo-300 dark:hover:bg-indigo-500/20 text-left transition-all"
              >
                👤 Demo Admin
              </button>
              <button
                type="button"
                onClick={() => setDemoUser('user@store.com', 'user123456')}
                className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-purple-500/10 border border-stone-300 dark:border-purple-500/20 text-xs font-bold text-stone-800 dark:text-purple-300 dark:hover:bg-purple-500/20 text-left transition-all"
              >
                👤 Demo User
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-stone-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link href="/auth/register" className="font-bold text-stone-900 dark:text-indigo-400 hover:underline">
              Create one now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
