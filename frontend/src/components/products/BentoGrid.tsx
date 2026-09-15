'use client';
import React from 'react';
import Link from 'next/link';
import { IProduct } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { Sparkles, ShoppingBag, ArrowUpRight, Star } from 'lucide-react';

export const BentoGrid: React.FC<{ products: IProduct[] }> = ({ products }) => {
  const { addItem } = useCart();
  if (!products || products.length === 0) return null;

  const flagship = products[0];
  const item2 = products[1];
  const item3 = products[products.length - 1];

  if (!flagship) return null;

  return (
    <section id="featured" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-700 dark:text-indigo-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Spotlight</span>
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-stone-900 dark:text-white">
            Flagship <span className="text-amber-800 dark:gradient-text">Innovations</span>
          </h2>
        </div>
        <a href="#catalog" className="text-xs font-bold text-stone-500 hover:text-stone-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 transition-colors">
          <span>View all items</span>
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main 2-Span Hero Bento */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 sm:p-10 relative overflow-hidden flex flex-col justify-between group">
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="bg-amber-600 dark:bg-gradient-to-r dark:from-amber-500 dark:to-rose-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                Editor's Choice
              </span>
              <span className="bg-stone-100 dark:bg-white/10 text-stone-800 dark:text-slate-300 text-xs font-bold px-3 py-1 rounded-full border border-stone-200 dark:border-white/10">
                {flagship.category}
              </span>
            </div>
            <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 text-xs font-bold">
              <Star className="w-4 h-4 fill-amber-500" />
              <span>5.0 (Flagship Model)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10 my-4">
            <div>
              <h3 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-stone-900 dark:text-white tracking-tight leading-tight mb-4">
                {flagship.name}
              </h3>
              <p className="text-sm text-stone-600 dark:text-slate-300 leading-relaxed mb-6 font-normal">
                {flagship.description}
              </p>

              <div className="space-y-2 mb-8">
                {(flagship.features?.slice(0, 3) || ['Lossless Audio', 'ANC 45dB', '45H Battery']).map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-semibold text-stone-700 dark:text-slate-200">
                    <span className="w-4 h-4 rounded-full bg-amber-500/10 dark:bg-cyan-400/20 text-amber-700 dark:text-cyan-400 flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <div className="text-[10px] uppercase font-bold text-stone-500 dark:text-slate-400">Exclusive Price</div>
                  <div className="font-heading font-black text-3xl text-stone-900 dark:text-white">{formatPrice(flagship.price)}</div>
                </div>
                <button
                  onClick={() => addItem(flagship, 1)}
                  className="glow-button text-white px-6 py-3 rounded-full text-xs font-bold flex items-center gap-2 shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Instant Acquire</span>
                </button>
              </div>
            </div>

            {/* Image Preview */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-100 dark:bg-slate-950 border border-stone-200 dark:border-white/10 shadow-lg">
              <img
                src={flagship.image}
                alt={flagship.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>

        {/* Right Side Stacked Bento Cards */}
        <div className="flex flex-col gap-6">
          {item2 && (
            <div className="glass-card rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between group flex-1">
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="text-amber-700 dark:text-cyan-400 font-extrabold uppercase tracking-wider">{item2.brand}</span>
                <span className="text-stone-500 dark:text-slate-400 font-bold">{item2.category}</span>
              </div>
              <div className="flex items-center gap-4 my-2">
                <img
                  src={item2.image}
                  alt={item2.name}
                  className="w-24 h-24 rounded-2xl object-cover bg-stone-100 dark:bg-slate-950 border border-stone-200 dark:border-white/10 shrink-0 group-hover:scale-105 transition-transform shadow-sm"
                />
                <div>
                  <Link href={`/products/${item2._id || item2.id}`}>
                    <h4 className="font-heading font-bold text-base text-stone-900 dark:text-white hover:text-amber-700 dark:hover:text-indigo-300 transition-colors line-clamp-2">
                      {item2.name}
                    </h4>
                  </Link>
                  <div className="font-heading font-extrabold text-lg text-emerald-600 dark:text-emerald-400 mt-2">
                    {formatPrice(item2.price)}
                  </div>
                </div>
              </div>
              <div className="pt-3 border-t border-stone-200/60 dark:border-white/5 flex items-center justify-between">
                <span className="text-xs text-stone-500 dark:text-slate-400">Available In Stock</span>
                <button
                  onClick={() => addItem(item2, 1)}
                  className="px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-stone-900 hover:text-white dark:bg-white/5 dark:hover:bg-indigo-600 dark:text-slate-300 text-stone-800 text-xs font-bold transition-all border border-stone-200 dark:border-white/10 flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          )}

          {item3 && (
            <div className="glass-card rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between group flex-1">
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="text-amber-700 dark:text-pink-400 font-extrabold uppercase tracking-wider">{item3.brand}</span>
                <span className="text-stone-500 dark:text-slate-400 font-bold">{item3.category}</span>
              </div>
              <div className="flex items-center gap-4 my-2">
                <img
                  src={item3.image}
                  alt={item3.name}
                  className="w-24 h-24 rounded-2xl object-cover bg-stone-100 dark:bg-slate-950 border border-stone-200 dark:border-white/10 shrink-0 group-hover:scale-105 transition-transform shadow-sm"
                />
                <div>
                  <Link href={`/products/${item3._id || item3.id}`}>
                    <h4 className="font-heading font-bold text-base text-stone-900 dark:text-white hover:text-amber-700 dark:hover:text-indigo-300 transition-colors line-clamp-2">
                      {item3.name}
                    </h4>
                  </Link>
                  <div className="font-heading font-extrabold text-lg text-stone-900 dark:text-cyan-400 mt-2">
                    {formatPrice(item3.price)}
                  </div>
                </div>
              </div>
              <div className="pt-3 border-t border-stone-200/60 dark:border-white/5 flex items-center justify-between">
                <span className="text-xs text-stone-500 dark:text-slate-400">Premium Grade</span>
                <button
                  onClick={() => addItem(item3, 1)}
                  className="px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-stone-900 hover:text-white dark:bg-white/5 dark:hover:bg-indigo-600 dark:text-slate-300 text-stone-800 text-xs font-bold transition-all border border-stone-200 dark:border-white/10 flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
