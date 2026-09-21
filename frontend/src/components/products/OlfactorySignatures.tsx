'use client';
import React from 'react';
import Link from 'next/link';
import { IProduct } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, ArrowRight } from 'lucide-react';

interface Props {
  products: IProduct[];
}

export const OlfactorySignatures: React.FC<Props> = ({ products }) => {
  const { addItem } = useCart();
  const signatureItems = products.slice(0, 4);

  return (
    <section id="signatures" className="py-20 bg-[#f8f6f0] dark:bg-[#0d0c0b] border-b border-[#e8e2d4] dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#8c6d3b] dark:text-[#c29b62] font-semibold block mb-2 font-sans">
            Curated Flacons
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#1a1816] dark:text-[#f8f6f0] tracking-tight mb-3">
            Olfactory Signatures
          </h2>
          <p className="text-xs sm:text-sm text-[#7a746e] dark:text-[#a6a096] font-sans">
            Our most celebrated extraits de parfum, crafted with unmatched botanical concentration.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {signatureItems.map((prod) => {
            const prodId = prod._id || prod.id!;
            return (
              <div
                key={prodId}
                className="group flex flex-col bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 hover:border-[#b38b4d] dark:hover:border-[#c29b62] transition-all duration-400 p-4 shadow-sm hover:shadow-xl"
              >
                {/* Flacon Image */}
                <Link href={`/products/${prodId}`} className="block relative aspect-square overflow-hidden bg-[#f3efe6] dark:bg-[#1a1816] mb-4">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-white/90 dark:bg-[#1a1816]/90 backdrop-blur-sm text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 text-[#8c6d3b] dark:text-[#c29b62] font-semibold border border-[#e4decfa0] dark:border-white/10">
                    {prod.archetype || prod.category}
                  </span>
                </Link>

                {/* Fragrance Meta */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <Link href={`/products/${prodId}`}>
                      <h3 className="font-serif text-lg sm:text-xl font-normal text-[#1a1816] dark:text-[#f8f6f0] group-hover:text-[#b38b4d] transition-colors">
                        {prod.name}
                      </h3>
                    </Link>
                    <p className="text-[11px] text-[#7a746e] dark:text-[#a6a096] font-sans mt-1 line-clamp-1">
                      {prod.subtitle || prod.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#e8e2d4]/70 dark:border-white/10 flex items-center justify-between">
                    <div>
                      <span className="font-serif text-lg font-medium text-[#1a1816] dark:text-[#f8f6f0]">
                        {formatPrice(prod.price)}
                      </span>
                      <span className="block text-[10px] text-[#7a746e] dark:text-[#a6a096] uppercase">50ml Extrait</span>
                    </div>

                    <button
                      onClick={() => addItem(prod, 1)}
                      className="p-2.5 rounded-full bg-[#f3efe6] dark:bg-[#1a1816] hover:bg-[#1a1816] hover:text-white dark:hover:bg-[#c29b62] dark:hover:text-black border border-[#e4decfa0] dark:border-white/10 text-[#1a1816] dark:text-[#f8f6f0] transition-colors"
                      title="Add to Shopping Bag"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Link href="/shop" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#1a1816] dark:text-[#f8f6f0] hover:text-[#b38b4d] transition-colors border-b border-[#1a1816] dark:border-[#f8f6f0] pb-1">
            <span>View All Fragrances</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
};
