'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Droplets, Shield, Award, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-[#f8f6f0] dark:bg-[#0d0c0b] text-[#1a1816] dark:text-[#f8f6f0] py-12 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-[#7a746e] dark:text-[#a6a096] mb-8">
          <Link href="/" className="hover:text-[#b38b4d] flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Maison Home
          </Link>
          <span>/</span>
          <span className="text-[#8c6d3b] dark:text-[#c29b62] font-semibold">The Maison</span>
        </div>

        {/* Hero Manifesto */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-[11px] uppercase tracking-[0.35em] text-[#8c6d3b] dark:text-[#c29b62] font-semibold mb-3 flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Maison Philosophy</span>
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-[#1a1816] dark:text-[#f8f6f0] leading-tight mb-6">
            Narrative In A Glass
          </h1>
          <p className="font-serif italic text-lg text-[#8c6d3b] dark:text-[#c29b62] mb-6">
            &ldquo;We view fragrance not as mere ornamentation, but as an intimate invisible architecture.&rdquo;
          </p>
          <p className="text-xs sm:text-sm text-[#7a746e] dark:text-[#a6a096] font-sans leading-relaxed">
            Founded between the storied floral fields of Grasse and the minimalist wooden temples of Kyoto, Maison ODORATUS captures ephemeral moments of stillness, solar warmth, and ancient manuscript ateliers through slow, artisanal distillation.
          </p>
        </div>

        {/* 3 Pillar Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 p-8 space-y-4 shadow-sm">
            <div className="w-12 h-12 border border-[#b38b4d]/40 flex items-center justify-center text-[#8c6d3b] dark:text-[#c29b62] bg-[#f8f6f0] dark:bg-[#1a1816]">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-normal text-[#1a1816] dark:text-[#f8f6f0]">
              28% - 35% Pure Extrait
            </h3>
            <p className="text-xs text-[#7a746e] dark:text-[#a6a096] font-sans leading-relaxed">
              Every flacon is formulated at the highest traditional extrait concentrations to provide a luxurious 16+ hour evolution on skin without synthetic harshness.
            </p>
          </div>

          <div className="bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 p-8 space-y-4 shadow-sm">
            <div className="w-12 h-12 border border-[#b38b4d]/40 flex items-center justify-center text-[#8c6d3b] dark:text-[#c29b62] bg-[#f8f6f0] dark:bg-[#1a1816]">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-normal text-[#1a1816] dark:text-[#f8f6f0]">
              Grasse Botanical Harvests
            </h3>
            <p className="text-xs text-[#7a746e] dark:text-[#a6a096] font-sans leading-relaxed">
              Centifolia Rose, Jasmine Sambac, and Orris Root hand-harvested at dawn in Provence and Mysore, distilled under time-honored artisanal methods.
            </p>
          </div>

          <div className="bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 p-8 space-y-4 shadow-sm">
            <div className="w-12 h-12 border border-[#b38b4d]/40 flex items-center justify-center text-[#8c6d3b] dark:text-[#c29b62] bg-[#f8f6f0] dark:bg-[#1a1816]">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-normal text-[#1a1816] dark:text-[#f8f6f0]">
              Numbered Flacons
            </h3>
            <p className="text-xs text-[#7a746e] dark:text-[#a6a096] font-sans leading-relaxed">
              Each flacon is poured into hand-blown crystal and accompanied by a signed harvest certificate and 2 complimentary discovery vials.
            </p>
          </div>
        </div>

        {/* Atelier CTA Strip */}
        <div className="bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#8c6d3b] dark:text-[#c29b62] font-semibold">
              The Wardrobe
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#1a1816] dark:text-[#f8f6f0]">
              Explore Our Artisanal Extraits
            </h3>
          </div>
          <Link href="/shop">
            <button className="px-8 py-3.5 bg-[#1a1816] hover:bg-[#b38b4d] text-[#f8f6f0] dark:bg-[#f8f6f0] dark:hover:bg-[#c29b62] dark:text-[#1a1816] text-xs uppercase tracking-widest font-semibold transition-colors flex items-center gap-2 shadow-sm">
              <span>View All Fragrances</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
