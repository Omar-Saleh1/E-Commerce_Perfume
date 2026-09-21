'use client';
import React from 'react';
import { TreePine, Flower2, Flame, Sun } from 'lucide-react';

interface Props {
  onSelectCategory?: (category: string) => void;
}

export const ScentArchetypes: React.FC<Props> = ({ onSelectCategory }) => {
  const archetypes = [
    {
      name: 'Woody & Smoky',
      tag: 'Woody & Earthy',
      desc: 'Australian sandalwood, atlas cedar, smoked birch tar and earthy vetiver roots.',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
      icon: TreePine,
      notes: 'Sandalwood • Cedar • Birch'
    },
    {
      name: 'Floral & Botanical',
      tag: 'Floral & Botanical',
      desc: 'Centifolia May rose, night-blooming tuberose, solar neroli and Florentine orris.',
      image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&auto=format&fit=crop&q=80',
      icon: Flower2,
      notes: 'Rose de Mai • Tuberose • Iris'
    },
    {
      name: 'Amber & Resin',
      tag: 'Amber & Resin',
      desc: 'Fossilized amber, Siam benzoin, Somalian frankincense and Madagascar Bourbon vanilla.',
      image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&auto=format&fit=crop&q=80',
      icon: Flame,
      notes: 'Benzoin • Vanilla • Frankincense'
    },
    {
      name: 'Citrus & Solar',
      tag: 'Citrus & Solar',
      desc: 'Reggio Calabria bergamot, solar aldehydes, crushed basil and Mediterranean sea salt.',
      image: 'https://images.unsplash.com/photo-1583445013765-46c20c4a6772?w=800&auto=format&fit=crop&q=80',
      icon: Sun,
      notes: 'Bergamot • Basil • Sea Salt'
    }
  ];

  const handleClick = (category: string) => {
    if (onSelectCategory) {
      onSelectCategory(category);
    }
    const elem = document.getElementById('catalog');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="archetypes" className="py-20 bg-[#f3efe6] dark:bg-[#141211] border-b border-[#e8e2d4] dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#8c6d3b] dark:text-[#c29b62] font-semibold block mb-2 font-sans">
            Sensory Cartography
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#1a1816] dark:text-[#f8f6f0] tracking-tight mb-3">
            Scent Archetypes
          </h2>
          <p className="text-xs sm:text-sm text-[#7a746e] dark:text-[#a6a096] font-sans">
            Explore our perfumes by emotional and botanical sensory families.
          </p>
        </div>

        {/* Archetypes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {archetypes.map((arch) => (
            <div
              key={arch.name}
              onClick={() => handleClick(arch.tag)}
              className="group cursor-pointer relative overflow-hidden aspect-[3/4] bg-[#1a1816] border border-[#e8e2d4] dark:border-white/10 transition-all duration-500 shadow-md hover:shadow-2xl"
            >
              {/* Background Image */}
              <img
                src={arch.image}
                alt={arch.name}
                className="w-full h-full object-cover opacity-75 group-hover:opacity-90 group-hover:scale-110 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>

              {/* Overlay Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                <div className="flex justify-end">
                  <span className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <arch.icon className="w-4 h-4 text-[#c29b62]" />
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#c29b62] block mb-1 font-semibold">
                    {arch.notes}
                  </span>
                  <h3 className="font-serif text-2xl font-light text-white mb-2 group-hover:translate-x-1 transition-transform">
                    {arch.name}
                  </h3>
                  <p className="text-[11px] text-white/70 font-sans leading-relaxed line-clamp-2">
                    {arch.desc}
                  </p>
                  <span className="inline-block mt-3 text-[10px] uppercase tracking-[0.2em] text-[#c29b62] border-b border-[#c29b62] pb-0.5">
                    Explore Family →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
