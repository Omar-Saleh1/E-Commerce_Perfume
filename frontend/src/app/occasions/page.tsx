'use client';
import React from 'react';
import Link from 'next/link';
import { Moon, Sun, Gift, Flame, ArrowLeft, Sparkles, ArrowRight } from 'lucide-react';

export default function OccasionsPage() {
  const curations = [
    {
      title: 'Intimate Evenings',
      subtitle: 'Nocturnal & Seductive',
      scents: 'Velvet Noir Fumé • Ambre Nocturne Royal',
      desc: 'Deep warm amber, dark incense, and velvety Madagascar vanilla designed for moonlit encounters and gala celebrations.',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
      icon: Moon,
      tag: 'Nocturne Flight'
    },
    {
      title: 'Daylight Reverie',
      subtitle: 'Luminous & Crisp',
      scents: 'Citrus Sauvage Vert • Fleur Blanche Solstice',
      desc: 'Mediterranean sunshine, crushed green herbs, and breezy floral sillage tailored for daily refinement and meetings.',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
      icon: Sun,
      tag: 'Solar Flight'
    },
    {
      title: 'The Gifting Curation',
      subtitle: 'Signature Discovery Flight',
      scents: '5 x 10ml Extrait Discovery Flacons',
      desc: 'Presented in hand-embossed linen gift box with handwritten botanical notes and golden wax seal.',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80',
      icon: Gift,
      tag: 'Gift Presentation'
    },
    {
      title: 'Solstice Rituals',
      subtitle: 'Solar & Ceremonial',
      scents: "Le Jardin d'Or • Santal Parchment",
      desc: 'Sacred woods, solar honey and rare resins distilled for ceremonial moments and sensory mindfulness.',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
      icon: Flame,
      tag: 'Sacred Ritual'
    }
  ];

  return (
    <div className="bg-[#f8f6f0] dark:bg-[#0d0c0b] text-[#1a1816] dark:text-[#f8f6f0] py-12 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-[#7a746e] dark:text-[#a6a096] mb-8">
          <Link href="/" className="hover:text-[#b38b4d] flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Maison Home
          </Link>
          <span>/</span>
          <span className="text-[#8c6d3b] dark:text-[#c29b62] font-semibold">Occasions</span>
        </div>

        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#8c6d3b] dark:text-[#c29b62] font-semibold mb-3 flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Harmonious Sensory Moments</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#1a1816] dark:text-[#f8f6f0] mb-4">
            Occasional Scent Curation
          </h1>
          <p className="text-xs sm:text-sm text-[#7a746e] dark:text-[#a6a096] font-sans leading-relaxed">
            Every occasion demands its own invisible architecture. Discover our carefully paired flacons composed to elevate life’s distinct chapters.
          </p>
        </div>

        {/* 4 Cards Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {curations.map((c) => (
            <div
              key={c.title}
              className="bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 p-6 sm:p-8 flex flex-col justify-between hover:border-[#b38b4d] dark:hover:border-[#c29b62] transition-all shadow-sm group"
            >
              <div>
                <div className="relative aspect-[16/9] overflow-hidden bg-[#f3efe6] dark:bg-[#1a1816] mb-6">
                  <img
                    src={c.image}
                    alt={c.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <span className="absolute top-3 left-3 bg-white/95 dark:bg-[#141211]/95 px-3 py-1 text-[9px] uppercase tracking-[0.2em] font-semibold text-[#8c6d3b] dark:text-[#c29b62] border border-[#e8e2d4] dark:border-white/10">
                    {c.tag}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#8c6d3b] dark:text-[#c29b62] font-semibold mb-2">
                  <c.icon className="w-4 h-4" />
                  <span>{c.subtitle}</span>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#1a1816] dark:text-[#f8f6f0] mb-3">
                  {c.title}
                </h2>

                <p className="text-xs sm:text-sm text-[#7a746e] dark:text-[#a6a096] font-sans leading-relaxed mb-6">
                  {c.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-[#e8e2d4] dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#7a746e] dark:text-[#a6a096] block">Paired Flacons</span>
                  <span className="font-serif italic text-sm text-[#8c6d3b] dark:text-[#c29b62]">{c.scents}</span>
                </div>

                <Link href="/shop">
                  <button className="px-5 py-2.5 bg-[#1a1816] hover:bg-[#b38b4d] text-[#f8f6f0] dark:bg-[#f8f6f0] dark:hover:bg-[#c29b62] dark:text-[#1a1816] text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-2 shrink-0">
                    <span>Explore Flight</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
