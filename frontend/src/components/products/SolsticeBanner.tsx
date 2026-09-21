'use client';
import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

export const SolsticeBanner = () => {
  return (
    <section id="solstice" className="py-20 bg-[#f3efe6] dark:bg-[#141211] border-b border-[#e8e2d4] dark:border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#1a1816] text-[#f8f6f0] border border-[#2b2724] shadow-2xl">
          
          {/* Left Visual */}
          <div className="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:h-[480px] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1583445013765-46c20c4a6772?w=1200&auto=format&fit=crop&q=85"
              alt="Le Jardin d'Or Solstice Flacons"
              className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#1a1816]/90 hidden lg:block"></div>
          </div>

          {/* Right Text */}
          <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-center text-left">
            <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#c29b62] font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#c29b62]" />
              <span>Limited Summer Millésime</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white leading-tight mb-4">
              Le Jardin d'Or <br />
              <span className="italic font-normal text-[#c29b62]">Solstice Collection</span>
            </h2>

            <p className="text-xs sm:text-sm text-[#b8b2a8] font-sans leading-relaxed mb-8">
              A tribute to golden sunrays dancing over Mediterranean citrus terraces. Bottled in heavy amber glass flacons with raw honey, bitter orange, and sacred resin accords. Only 500 numbered editions produced.
            </p>

            <div>
              <Link href="/shop">
                <button className="bg-[#c29b62] hover:bg-[#b38b4d] text-[#1a1816] hover:text-white px-8 py-4 text-xs uppercase tracking-[0.2em] font-semibold transition-all flex items-center gap-2 group shadow-lg">
                  <span>Explore Solstice Editions</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
