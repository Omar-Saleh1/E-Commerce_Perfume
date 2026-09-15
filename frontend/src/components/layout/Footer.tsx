import React from 'react';
import { Sparkles, Shield, Truck, RefreshCw, Zap } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-stone-200 dark:border-white/10 bg-stone-100/80 dark:bg-slate-950 text-stone-600 dark:text-slate-400 transition-colors duration-300">
      {/* Feature Strip */}
      <div className="border-b border-stone-200/80 dark:border-white/5 bg-white/60 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-indigo-500/10 border border-amber-500/20 dark:border-indigo-500/20 flex items-center justify-center text-amber-700 dark:text-indigo-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900 dark:text-slate-100">Global Priority Shipping</h4>
              <p className="text-xs text-stone-500 dark:text-slate-400">Free delivery on orders over $150</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-stone-500/10 dark:bg-purple-500/10 border border-stone-500/20 dark:border-purple-500/20 flex items-center justify-center text-stone-800 dark:text-purple-400 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900 dark:text-slate-100">2-Year Warranty</h4>
              <p className="text-xs text-stone-500 dark:text-slate-400">100% Genuine guaranteed</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-cyan-500/10 border border-emerald-500/20 dark:border-cyan-500/20 flex items-center justify-center text-emerald-700 dark:text-cyan-400 shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900 dark:text-slate-100">30-Day Free Returns</h4>
              <p className="text-xs text-stone-500 dark:text-slate-400">No questions asked return policy</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 dark:bg-pink-500/10 border border-rose-500/20 dark:border-pink-500/20 flex items-center justify-center text-rose-700 dark:text-pink-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900 dark:text-slate-100">Instant Checkout</h4>
              <p className="text-xs text-stone-500 dark:text-slate-400">Encrypted 256-bit transactions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 dark:text-indigo-400" />
          <span>© 2026 MATJARI STORE. Engineered with Next.js, Tailwind CSS & Abstract Factory Architecture.</span>
        </div>
        <div className="flex items-center gap-6 font-semibold">
          <a href="#" className="hover:text-stone-900 dark:hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-stone-900 dark:hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-stone-900 dark:hover:text-white transition-colors">Security</a>
        </div>
      </div>
    </footer>
  );
};
