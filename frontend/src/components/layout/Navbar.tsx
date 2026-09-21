'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { ShoppingBag, Search, LogOut, Sun, Moon, Menu, X, User, Sparkles, Truck, Shield, Heart } from 'lucide-react';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { useRouter } from 'next/navigation';

export const Navbar = () => {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearch.trim()) {
      router.push(`/shop?search=${encodeURIComponent(navSearch.trim())}`);
    }
  };

  return (
    <>
      {/* Top Notice Bar */}
      <div className="bg-[#1a1816] text-[#f3efe6] text-[10px] sm:text-[11px] tracking-widest uppercase font-medium py-1.5 px-4 text-center border-b border-[#2b2724] flex items-center justify-center gap-4">
        <span>Complimentary 2ml Discovery Vials with All Orders &bull; Handcrafted in Grasse</span>
        <span className="hidden md:inline">&bull;</span>
        <Link href="/quiz" className="hidden md:inline text-[#c29b62] hover:underline font-semibold flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>Find Your Signature Scent (AI Quiz) &rarr;</span>
        </Link>
      </div>

      <header className="sticky top-0 z-40 bg-[#f8f6f0]/95 dark:bg-[#0d0c0b]/95 backdrop-blur-md border-b border-[#e8e2d4] dark:border-white/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Left: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 xl:gap-7 text-xs uppercase tracking-[0.2em] font-medium text-[#1a1816] dark:text-[#f8f6f0]">
            <Link href="/about" className="hover:text-[#b38b4d] dark:hover:text-[#c29b62] transition-colors">
              About
            </Link>
            <Link href="/shop" className="hover:text-[#b38b4d] dark:hover:text-[#c29b62] transition-colors">
              Shop
            </Link>
            <Link href="/occasions" className="hover:text-[#b38b4d] dark:hover:text-[#c29b62] transition-colors">
              Occasions
            </Link>
            <Link href="/quiz" className="text-[#8c6d3b] dark:text-[#c29b62] hover:underline flex items-center gap-1 font-semibold transition-colors">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Quiz</span>
            </Link>
          </nav>

          {/* Center: Brand Monogram & Title */}
          <Link href="/" className="flex flex-col items-center group">
            <span className="font-serif text-2xl sm:text-3xl tracking-[0.3em] uppercase font-light text-[#1a1816] dark:text-[#f8f6f0] transition-colors">
              ODORATUS
            </span>
            <span className="text-[9px] uppercase tracking-[0.35em] text-[#8c6d3b] dark:text-[#c29b62] -mt-1 font-sans">
              Haute Parfumerie
            </span>
          </Link>

          {/* Right: Search, Theme, Wishlist, Track, Account & Shopping Bag */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Inline Search Input */}
            <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative">
              <Search className="w-3.5 h-3.5 text-[#8c6d3b] dark:text-[#c29b62] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search notes..."
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                className="w-32 xl:w-40 bg-[#f3efe6] dark:bg-[#1a1816] border border-[#e8e2d4] dark:border-white/10 rounded-full pl-8 pr-3 py-1.5 text-xs text-[#1a1816] dark:text-[#f8f6f0] placeholder-[#a6a096] focus:outline-none focus:border-[#b38b4d] transition-all"
              />
            </form>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              title="Saved Flacons Wishlist"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[#f3efe6] dark:bg-[#1a1816] border border-[#e4decfa0] dark:border-white/10 text-[#1a1816] dark:text-[#f8f6f0] hover:text-[#b38b4d] dark:hover:text-[#c29b62] transition-colors"
            >
              <Heart className="w-3.5 h-3.5" />
            </Link>

            {/* Live Tracking Link */}
            <Link
              href="/track"
              title="Track Consignment"
              className="hidden sm:flex items-center gap-1 text-[11px] uppercase tracking-wider text-[#7a746e] dark:text-[#a6a096] hover:text-[#b38b4d] transition-colors"
            >
              <Truck className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Track</span>
            </Link>

            {/* Admin Portal Link */}
            <Link
              href="/admin"
              title="Executive Admin Panel"
              className="hidden xl:flex items-center gap-1 text-[10px] uppercase tracking-wider px-2 py-1 bg-[#f3efe6] dark:bg-[#1a1816] border border-[#e8e2d4] dark:border-white/10 text-[#8c6d3b] dark:text-[#c29b62] hover:border-[#b38b4d]"
            >
              <Shield className="w-3 h-3" />
              <span>Admin</span>
            </Link>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Warm Sand Mode' : 'Switch to Obsidian Dark Mode'}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-[#f3efe6] dark:bg-[#1a1816] border border-[#e4decfa0] dark:border-white/10 text-[#1a1816] dark:text-[#c29b62] hover:border-[#b38b4d] transition-all"
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 animate-in spin-in-180 duration-300" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-[#1a1816] animate-in spin-in-180 duration-300" />
              )}
            </button>

            {/* User Account / VIP Privilege Link */}
            {user ? (
              <Link href="/account" className="flex items-center gap-1.5 bg-[#f3efe6] dark:bg-[#1a1816] border border-[#e4decfa0] dark:border-white/10 rounded-full pl-2.5 pr-2 py-0.5 text-xs text-[#1a1816] dark:text-[#f8f6f0] hover:border-[#b38b4d]">
                <span className="max-w-[70px] truncate font-medium text-[11px]">{user.name}</span>
                <span className="text-[9px] bg-[#b38b4d] text-white px-1.5 py-0.2 rounded-full font-bold">VIP</span>
              </Link>
            ) : (
              <Link href="/account" className="hidden sm:flex items-center gap-1 text-[11px] uppercase tracking-wider text-[#1a1816] dark:text-[#f8f6f0] hover:text-[#b38b4d] transition-colors font-medium">
                <User className="w-3.5 h-3.5" />
                <span>Account</span>
              </Link>
            )}

            {/* Shopping Bag Trigger (Opens Sliding Cart Drawer) */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 bg-[#1a1816] text-[#f8f6f0] dark:bg-[#f8f6f0] dark:text-[#1a1816] px-3.5 py-1.5 rounded-full text-[11px] tracking-wider uppercase font-semibold transition-all hover:bg-[#b38b4d] dark:hover:bg-[#c29b62] shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bag</span>
              <span className="bg-[#b38b4d] text-white text-[10px] font-bold px-1.5 rounded-full min-w-[15px] text-center">
                {itemCount}
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="md:hidden p-2 rounded-lg bg-[#f3efe6] dark:bg-[#1a1816] text-[#1a1816] dark:text-[#f8f6f0]"
            >
              {mobileMenu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenu && (
          <div className="md:hidden bg-[#f8f6f0] dark:bg-[#141211] border-b border-[#e8e2d4] dark:border-white/10 px-6 py-5 flex flex-col gap-3 animate-in slide-in-from-top-3">
            <Link href="/about" onClick={() => setMobileMenu(false)} className="text-xs uppercase tracking-widest font-medium py-1">
              About Maison
            </Link>
            <Link href="/shop" onClick={() => setMobileMenu(false)} className="text-xs uppercase tracking-widest font-medium py-1">
              Shop Fragrances
            </Link>
            <Link href="/occasions" onClick={() => setMobileMenu(false)} className="text-xs uppercase tracking-widest font-medium py-1">
              Occasions
            </Link>
            <Link href="/quiz" onClick={() => setMobileMenu(false)} className="text-xs uppercase tracking-widest font-semibold text-[#b38b4d] py-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Scent Consultation</span>
            </Link>
            <Link href="/track" onClick={() => setMobileMenu(false)} className="text-xs uppercase tracking-widest font-medium py-1">
              Track Consignment
            </Link>
            <Link href="/account" onClick={() => setMobileMenu(false)} className="text-xs uppercase tracking-widest font-medium py-1">
              VIP Loyalty Rewards
            </Link>
            <Link href="/admin" onClick={() => setMobileMenu(false)} className="text-xs uppercase tracking-widest font-medium py-1 text-[#8c6d3b]">
              Admin Control Panel
            </Link>
            <button
              onClick={() => { setIsCartOpen(true); setMobileMenu(false); }}
              className="text-left text-xs uppercase tracking-widest font-medium py-1 text-[#b38b4d]"
            >
              Shopping Bag ({itemCount})
            </button>
          </div>
        )}
      </header>

      {/* Slide-over Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
