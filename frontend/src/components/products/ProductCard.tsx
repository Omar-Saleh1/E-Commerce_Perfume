'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { IProduct } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ShoppingBag, Heart, Star } from 'lucide-react';
import { ApiClient } from '@/patterns/api/AbstractApiClientFactory';
import { useToast } from '@/context/ToastContext';

export const ProductCard: React.FC<{ product: IProduct }> = ({ product }) => {
  const { addItem } = useCart();
  const { user, token } = useAuth();
  const { showToast } = useToast();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const prodId = product._id || product.id!;

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
    showToast(`Added ${product.name} to your Shopping Bag 🛍️`);
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <div className="group flex flex-col bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 hover:border-[#b38b4d] dark:hover:border-[#c29b62] transition-all duration-400 p-4 shadow-sm hover:shadow-xl">
      {/* Product Flacon Stage */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#f3efe6] dark:bg-[#1a1816] mb-4">
        <Link href={`/products/${prodId}`}>
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
            loading="lazy"
          />
        </Link>

        {/* Top Family Badge */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="bg-white/90 dark:bg-[#1a1816]/90 backdrop-blur-sm text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 text-[#8c6d3b] dark:text-[#c29b62] font-semibold border border-[#e4decfa0] dark:border-white/10">
            {product.archetype || product.category}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md border transition-all z-10 ${
            isWishlisted
              ? 'bg-rose-500/20 border-rose-500 text-rose-500'
              : 'bg-white/80 dark:bg-black/40 border-[#e8e2d4] dark:border-white/10 text-[#7a746e] hover:text-[#b38b4d]'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
        </button>
      </div>

      {/* Fragrance Meta */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[10px] text-[#8c6d3b] dark:text-[#c29b62] uppercase tracking-wider mb-1">
            <span>{product.concentration || 'Extrait de Parfum'}</span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-[#c29b62] text-[#c29b62]" />
              <span className="font-semibold text-[#1a1816] dark:text-white">{Number(product.rating || 5).toFixed(1)}</span>
            </div>
          </div>

          <Link href={`/products/${prodId}`}>
            <h3 className="font-serif text-lg sm:text-xl font-normal text-[#1a1816] dark:text-[#f8f6f0] group-hover:text-[#b38b4d] dark:group-hover:text-[#c29b62] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-[11px] text-[#7a746e] dark:text-[#a6a096] font-sans mt-1 line-clamp-1">
            {product.subtitle || product.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="mt-4 pt-3 border-t border-[#e8e2d4]/70 dark:border-white/10 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-xl font-medium text-[#1a1816] dark:text-[#f8f6f0]">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-xs text-[#7a746e] line-through font-serif">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>
            <span className="block text-[10px] text-[#7a746e] dark:text-[#a6a096] uppercase">{product.volume || '50ml'}</span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`px-3.5 py-2 text-xs uppercase tracking-wider font-semibold transition-all duration-300 flex items-center gap-1.5 shadow-sm ${
              isAdding
                ? 'bg-emerald-700 text-white'
                : 'bg-[#1a1816] hover:bg-[#b38b4d] text-[#f8f6f0] dark:bg-[#f8f6f0] dark:hover:bg-[#c29b62] dark:text-[#1a1816]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isAdding ? 'Added' : 'Add to Bag'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
