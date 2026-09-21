'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Compass } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-[#f8f6f0] dark:bg-[#0d0c0b] border-b border-[#e8e2d4] dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-6 flex flex-col justify-center text-left">
            <div className="inline-flex items-center gap-2 text-[11px] font-sans tracking-[0.25em] uppercase text-[#8c6d3b] dark:text-[#c29b62] mb-4 font-semibold">
              <span className="w-6 h-[1px] bg-[#8c6d3b] dark:bg-[#c29b62]"></span>
              <span>Distillation Millésime 2026</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light text-[#1a1816] dark:text-[#f8f6f0] leading-[1.06] tracking-tight mb-6">
              Narrative In <br />
              <span className="italic font-normal text-[#8c6d3b] dark:text-[#c29b62]">A Glass.</span>
            </h1>

            <p className="text-sm sm:text-base text-[#524c46] dark:text-[#b8b2a8] max-w-lg leading-relaxed font-sans mb-8">
              Hand-distilled extraits de parfum formulated from rare botanical harvests in Grasse and Kyoto. Each flacon preserves a sensory memory suspended in time.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a href="#signatures">
                <button className="bg-[#1a1816] hover:bg-[#b38b4d] text-[#f8f6f0] dark:bg-[#f8f6f0] dark:hover:bg-[#c29b62] dark:text-[#1a1816] px-8 py-4 rounded-none text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 shadow-md flex items-center gap-2 group">
                  <span>Discover Flacons</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </a>
              <a href="#archetypes">
                <button className="btn-sand px-7 py-4 text-xs uppercase tracking-[0.2em] font-semibold transition-all flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#8c6d3b] dark:text-[#c29b62]" />
                  <span>Scent Archetypes</span>
                </button>
              </a>
            </div>

            {/* Micro Highlights */}
            <div className="mt-12 pt-6 border-t border-[#e4decfa0] dark:border-white/10 grid grid-cols-3 gap-4 text-left">
              <div>
                <span className="block font-serif text-lg text-[#1a1816] dark:text-[#f8f6f0]">30–35%</span>
                <span className="text-[10px] uppercase tracking-wider text-[#7a746e] dark:text-[#a6a096]">Extrait Density</span>
              </div>
              <div>
                <span className="block font-serif text-lg text-[#1a1816] dark:text-[#f8f6f0]">100% Pure</span>
                <span className="text-[10px] uppercase tracking-wider text-[#7a746e] dark:text-[#a6a096]">Rare Botanicals</span>
              </div>
              <div>
                <span className="block font-serif text-lg text-[#1a1816] dark:text-[#f8f6f0]">Numbered</span>
                <span className="text-[10px] uppercase tracking-wider text-[#7a746e] dark:text-[#a6a096]">Atelier Batches</span>
              </div>
            </div>
          </div>

          {/* Right Hero Image */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[16/11] shadow-2xl border border-[#e8e2d4] dark:border-white/10">
              <img
                src="https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1200&auto=format&fit=crop&q=85"
                alt="Odoratus Santal Parchment Flacon"
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              
              {/* Floating Plaque */}
              <div className="absolute bottom-6 left-6 right-6 p-4 sm:p-5 bg-white/90 dark:bg-[#1a1816]/90 backdrop-blur-md border border-[#e8e2d4] dark:border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#8c6d3b] dark:text-[#c29b62] block">Signature Extrait</span>
                  <h3 className="font-serif text-lg sm:text-xl text-[#1a1816] dark:text-[#f8f6f0] font-normal">Santal Parchment</h3>
                  <p className="text-xs text-[#7a746e] dark:text-[#a6a096] hidden sm:block">Australian Sandalwood, Orris, Cardamom</p>
                </div>
                <div className="text-right">
                  <span className="font-serif text-xl font-medium text-[#1a1816] dark:text-[#f8f6f0]">$280</span>
                  <span className="block text-[10px] text-[#8c6d3b] uppercase tracking-wider">50ml</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
