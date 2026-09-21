'use client';
import React from 'react';
import Link from 'next/link';
import { Moon, Sun, Gift, Flame } from 'lucide-react';

export const OccasionalCuration = () => {
  const curations = [
    {
      title: 'Intimate Evenings',
      subtitle: 'Nocturnal & Seductive',
      scents: 'Velvet Noir Fumé • Ambre Nocturne',
      desc: 'Deep warm amber, dark incense, and velvety vanilla designed for moonlit encounters.',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
      icon: Moon
    },
    {
      title: 'Daylight Reverie',
      subtitle: 'Luminous & Crisp',
      scents: 'Citrus Sauvage Vert • Fleur Blanche',
      desc: 'Mediterranean sunshine, crushed green herbs, and breezy floral sillage for daily elegance.',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
      icon: Sun
    },
    {
      title: 'Gifting Curation',
      subtitle: 'Signature Discovery Set',
      scents: '5 x 10ml Extrait Discovery Flight',
      desc: 'Presented in hand-embossed linen gift box with handwritten botanical notes.',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80',
      icon: Gift
    },
    {
      title: 'Solstice Rituals',
      subtitle: 'Solar & Ceremonial',
      scents: "Le Jardin d'Or • Santal Parchment",
      desc: 'Sacred woods, solar honey and rare resins distilled for moments of mindfulness.',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
      icon: Flame
    }
  ];

  return (
    <section className="py-20 bg-[#f8f6f0] dark:bg-[#0d0c0b] border-b border-[#e8e2d4] dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#8c6d3b] dark:text-[#c29b62] font-semibold block mb-2 font-sans">
            Sensory Moments
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#1a1816] dark:text-[#f8f6f0] tracking-tight mb-3">
            Occasional Scent Curation
          </h2>
          <p className="text-xs sm:text-sm text-[#7a746e] dark:text-[#a6a096] font-sans">
            Curated fragrances aligned with the rhythm of your day and ceremonial occasions.
          </p>
        </div>

        {/* 4 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {curations.map((c) => (
            <div
              key={c.title}
              className="bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 p-5 flex flex-col justify-between hover:border-[#b38b4d] dark:hover:border-[#c29b62] transition-all shadow-sm group"
            >
              <div>
                <div className="aspect-[4/3] overflow-hidden bg-[#f3efe6] dark:bg-[#1a1816] mb-4">
                  <img
                    src={c.image}
                    alt={c.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-[#8c6d3b] dark:text-[#c29b62] font-semibold mb-1">
                  <c.icon className="w-3 h-3" />
                  <span>{c.subtitle}</span>
                </div>
                <h3 className="font-serif text-xl font-normal text-[#1a1816] dark:text-[#f8f6f0] mb-2">
                  {c.title}
                </h3>
                <p className="text-xs text-[#7a746e] dark:text-[#a6a096] font-sans leading-relaxed mb-3">
                  {c.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-[#e8e2d4]/70 dark:border-white/10 text-[11px] font-serif italic text-[#8c6d3b] dark:text-[#c29b62]">
                {c.scents}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
