'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { ShoppingCart, ShoppingBag, Sparkles, LogOut, Sun, Moon, Compass, Menu, X } from 'lucide-react';

export const Navbar = () => {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <div className="fixed top-4 inset-x-0 z-50 px-4 sm:px-6 pointer-events-none">
      <header className="max-w-5xl mx-auto glass-island rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 pointer-events-auto transition-all">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-full bg-stone-900 text-white dark:bg-gradient-to-tr dark:from-indigo-500 dark:via-purple-500 dark:to-pink-500 flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110">
            <ShoppingCart className="w-4 h-4 text-amber-300 dark:text-white" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-heading font-black text-lg tracking-tight text-stone-900 dark:text-white">
              MATJARI
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700 dark:text-cyan-400 bg-amber-500/10 dark:bg-cyan-500/10 px-1.5 py-0.5 rounded-full border border-amber-500/20 dark:border-cyan-500/20">
              STORE
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-stone-100/80 dark:bg-white/5 border border-stone-200/80 dark:border-white/10 rounded-full p-1 text-xs font-bold text-stone-600 dark:text-slate-300">
          <Link href="/" className="px-4 py-1.5 rounded-full hover:text-stone-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 transition-all shadow-none hover:shadow-sm">
            Storefront
          </Link>
          <a href="#featured" className="px-4 py-1.5 rounded-full hover:text-stone-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 transition-all flex items-center gap-1 hover:shadow-sm">
            <Sparkles className="w-3 h-3 text-amber-600 dark:text-purple-400" />
            <span>Spotlight</span>
          </a>
          <a href="#catalog" className="px-4 py-1.5 rounded-full hover:text-stone-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 transition-all flex items-center gap-1 hover:shadow-sm">
            <Compass className="w-3 h-3 text-stone-600 dark:text-cyan-400" />
            <span>Catalog</span>
          </a>
        </nav>

        {/* Right CTA / Theme Switcher / Cart & Auth */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Warm Off-White Mode' : 'Switch to Obsidian Dark Mode'}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-stone-100 dark:bg-slate-900 border border-stone-200 dark:border-white/10 text-stone-700 dark:text-amber-400 hover:scale-105 active:scale-95 transition-all shadow-sm"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 animate-in spin-in-180 duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-stone-800 animate-in spin-in-180 duration-300" />
            )}
          </button>

          {/* Cart Trigger */}
          <Link href="/cart">
            <button className="flex items-center gap-2 bg-stone-900 text-white dark:bg-indigo-600/20 dark:text-indigo-200 border border-stone-800 dark:border-indigo-500/40 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-md hover:scale-105 active:scale-95">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-300 dark:text-indigo-400" />
              <span className="hidden sm:inline">Cart</span>
              {itemCount > 0 && (
                <span className="bg-amber-500 dark:bg-gradient-to-r dark:from-pink-500 dark:to-rose-500 text-stone-950 dark:text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm animate-bounce">
                  {itemCount}
                </span>
              )}
            </button>
          </Link>

          {/* User Status */}
          {user ? (
            <div className="flex items-center gap-2 bg-stone-100 dark:bg-slate-900/90 border border-stone-200 dark:border-white/10 rounded-full pl-3 pr-1.5 py-1 text-xs font-bold text-stone-800 dark:text-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
              <span className="max-w-[80px] truncate">{user.name}</span>
              <button
                onClick={logout}
                title="Sign out"
                className="p-1 rounded-full text-stone-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5">
              <Link href="/auth/login">
                <button className="px-3 py-1.5 text-xs font-bold text-stone-600 dark:text-slate-300 hover:text-stone-900 dark:hover:text-white transition-colors">
                  Sign In
                </button>
              </Link>
              <Link href="/auth/register">
                <button className="glow-button px-3.5 py-1.5 rounded-full text-xs font-bold text-white">
                  Join Matjari
                </button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden p-1.5 rounded-full bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-700 dark:text-slate-300"
          >
            {mobileMenu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenu && (
        <div className="md:hidden max-w-sm mx-auto mt-2 glass-island rounded-3xl p-4 flex flex-col gap-2 pointer-events-auto animate-in slide-in-from-top-4 shadow-xl">
          <Link href="/" onClick={() => setMobileMenu(false)} className="px-3 py-2 text-xs font-bold text-stone-800 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-white/5 rounded-xl">
            Storefront
          </Link>
          <a href="#featured" onClick={() => setMobileMenu(false)} className="px-3 py-2 text-xs font-bold text-stone-800 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-white/5 rounded-xl">
            Spotlight
          </a>
          <a href="#catalog" onClick={() => setMobileMenu(false)} className="px-3 py-2 text-xs font-bold text-stone-800 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-white/5 rounded-xl">
            Catalog
          </a>
          <Link href="/cart" onClick={() => setMobileMenu(false)} className="px-3 py-2 text-xs font-bold text-stone-800 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-white/5 rounded-xl">
            Shopping Cart ({itemCount})
          </Link>
          {!user && (
            <div className="pt-2 border-t border-stone-200 dark:border-white/10 grid grid-cols-2 gap-2">
              <Link href="/auth/login" onClick={() => setMobileMenu(false)} className="text-center py-2 rounded-xl bg-stone-100 dark:bg-white/5 text-xs font-bold text-stone-900 dark:text-white">
                Sign In
              </Link>
              <Link href="/auth/register" onClick={() => setMobileMenu(false)} className="text-center py-2 rounded-xl glow-button text-xs font-bold text-white">
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
