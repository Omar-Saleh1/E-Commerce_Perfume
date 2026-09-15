'use client';
import React from 'react';
import { ArrowRight, ShieldCheck, Zap, Globe, Star, Flame } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="relative pt-28 pb-14 md:pt-36 md:pb-20 overflow-hidden text-center">
      {/* Background ambient radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-amber-500/10 dark:bg-indigo-500/20 blur-[130px] pointer-events-none -z-10 rounded-full"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-100/90 dark:bg-indigo-500/10 border border-stone-200 dark:border-indigo-500/30 backdrop-blur-2xl mb-8 shadow-sm">
          <Flame className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 fill-amber-500" />
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-stone-700 dark:text-indigo-300">
            Season 2026 • Curated Luxury Minimalist Gear
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-heading font-black text-4xl sm:text-6xl md:text-7xl tracking-tight text-stone-900 dark:text-white leading-[1.08] mb-6">
          Precision Engineering for <br className="hidden sm:inline" />
          <span className="text-amber-800 dark:gradient-text font-black">Refined Modern Living</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-stone-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
          Minimalist industrial design, premium acoustic beryllium drivers, and aerospace titanium hardware. Built for uncompromising quality.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a href="#catalog">
            <button className="glow-button font-heading font-black text-sm px-8 py-4 rounded-full flex items-center gap-2 group shadow-lg">
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </a>
          <a href="#featured">
            <button className="px-7 py-4 rounded-full bg-white dark:bg-white/5 hover:bg-stone-50 dark:hover:bg-white/10 border border-stone-200 dark:border-white/15 text-stone-800 dark:text-slate-200 font-heading font-bold text-sm shadow-sm transition-all flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600 dark:text-cyan-400" />
              <span>Spotlight Innovations</span>
            </button>
          </a>
        </div>

        {/* 4 Trust Metrics */}
        <div className="mt-16 pt-8 border-t border-stone-200/80 dark:border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 dark:bg-indigo-500/10 border border-amber-500/20 dark:border-indigo-500/20 flex items-center justify-center text-amber-700 dark:text-indigo-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-stone-900 dark:text-white">Lossless Hi-Res</div>
              <div className="text-[11px] text-stone-500 dark:text-slate-400">Pure 24-bit/96kHz</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-stone-200/60 dark:bg-purple-500/10 border border-stone-300 dark:border-purple-500/20 flex items-center justify-center text-stone-800 dark:text-purple-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-stone-900 dark:text-white">Titanium Grade 5</div>
              <div className="text-[11px] text-stone-500 dark:text-slate-400">Aerospace Build</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 dark:bg-cyan-500/10 border border-emerald-500/20 dark:border-cyan-500/20 flex items-center justify-center text-emerald-700 dark:text-cyan-400 shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-stone-900 dark:text-white">Express Global</div>
              <div className="text-[11px] text-stone-500 dark:text-slate-400">Free over $150</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shrink-0">
              <Star className="w-5 h-5 fill-amber-500" />
            </div>
            <div>
              <div className="text-xs font-black text-stone-900 dark:text-white">4.9 / 5.0 Rating</div>
              <div className="text-[11px] text-stone-500 dark:text-slate-400">2,400+ Verified</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
