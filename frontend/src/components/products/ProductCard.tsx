'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { IProduct } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Star, ShoppingBag, Heart, ArrowUpRight } from 'lucide-react';
import { ApiClient } from '@/patterns/api/AbstractApiClientFactory';
import { useToast } from '@/context/ToastContext';

export const ProductCard: React.FC<{ product: IProduct }> = ({ product }) => {
  const { addItem } = useCart();
  const { user, token } = useAuth();
  const { showToast } = useToast();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const prodId = product._id || product.id!;
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user || !token) {
      showToast('Please sign in to save items to wishlist', 'error');
      return;
    }
    const next = await ApiClient.toggleWishlist(prodId, token);
    setIsWishlisted(next);
    showToast(next ? 'Saved to your Wishlist ❤️' : 'Removed from Wishlist');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdding(true);
    addItem(product, 1);
    setTimeout(() => setIsAdding(false), 600);
  };

  return (
    <div className="glass-card rounded-3xl overflow-hidden flex flex-col group relative">
      {/* Product Image Stage */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 dark:bg-slate-950/90">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 z-10">
          <span className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-stone-200 dark:border-white/15 text-stone-800 dark:text-slate-200 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
            {product.category}
          </span>
          {discount > 0 && (
            <span className="bg-rose-600 dark:bg-gradient-to-r dark:from-rose-500 dark:to-pink-500 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-sm w-fit">
              -{discount}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3.5 right-3.5 p-2 rounded-full backdrop-blur-2xl border transition-all duration-300 z-10 shadow-sm ${
            isWishlisted
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-500 scale-110'
              : 'bg-white/90 dark:bg-slate-950/60 border-stone-200 dark:border-white/10 text-stone-400 dark:text-slate-400 hover:text-rose-500 hover:scale-110'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
        </button>
      </div>

      {/* Product Info & CTA */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-4">
        <div>
          {/* Brand & Star Rating */}
          <div className="flex items-center justify-between gap-2 text-xs mb-2">
            <span className="font-extrabold text-amber-700 dark:text-cyan-400 tracking-widest uppercase text-[10px]">
              {product.brand || 'Nexus Prime'}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-500" />
              <span className="text-stone-800 dark:text-slate-200">{Number(product.rating || 5).toFixed(1)}</span>
              <span className="text-stone-400 font-normal">({product.reviewsCount || 0})</span>
            </div>
          </div>

          {/* Product Title */}
          <Link href={`/products/${prodId}`}>
            <h3 className="font-heading font-bold text-base text-stone-900 dark:text-slate-100 group-hover:text-amber-700 dark:group-hover:text-indigo-300 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Description snippet */}
          <p className="text-xs text-stone-500 dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed font-normal">
            {product.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="pt-3.5 border-t border-stone-200/60 dark:border-white/5 flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Price</div>
            <div className="flex items-baseline gap-2">
              <span className="font-heading font-black text-xl text-stone-900 dark:text-white">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-xs text-stone-400 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAddToCart}
              className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-1.5 shadow-sm ${
                isAdding
                  ? 'bg-emerald-600 text-white'
                  : 'glow-button'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{isAdding ? 'Added! ✓' : 'Add'}</span>
            </button>
            <Link href={`/products/${prodId}`}>
              <button className="p-2.5 rounded-full bg-stone-100 hover:bg-stone-200 dark:bg-white/5 dark:hover:bg-white/10 text-stone-700 dark:text-slate-300 border border-stone-200 dark:border-white/10 transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
