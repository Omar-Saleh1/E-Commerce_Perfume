'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { IProduct } from '@/types';
import { ApiClient } from '@/patterns/api/AbstractApiClientFactory';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { formatPrice } from '@/lib/utils';
import {
  Heart,
  ShoppingBag,
  Trash2,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Package,
  Layers
} from 'lucide-react';

export default function WishlistPage() {
  const { user, token, isLoading: authLoading } = useAuth();
  const { addItem } = useCart();
  const { showToast } = useToast();

  const [wishlist, setWishlist] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    if (!token) {
      setWishlist([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const items = await ApiClient.getWishlist(token);
      setWishlist(items);
    } catch {
      showToast('Error loading your saved flacons', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchWishlist();
    }
  }, [token, authLoading]);

  const handleRemoveFromWishlist = async (productId: string, name: string) => {
    if (!token) return;
    try {
      await ApiClient.toggleWishlist(productId, token);
      setWishlist((prev) => prev.filter((p) => (p._id || p.id) !== productId));
      showToast(`Removed "${name}" from your wishlist`);
    } catch {
      showToast('Failed to update wishlist', 'error');
    }
  };

  const handleAddToCart = (product: IProduct) => {
    addItem(product, 1);
    showToast(`"${product.name}" added to your bag ✨`);
  };

  if (authLoading || loading) {
    return (
      <div className="bg-[#f8f6f0] dark:bg-[#0d0c0b] text-[#1a1816] dark:text-[#f8f6f0] min-h-[75vh] flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-[#b38b4d] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif text-sm tracking-widest text-[#7a746e] dark:text-[#a6a096] uppercase">
            Opening your Private Fragrance Vault...
          </p>
        </div>
      </div>
    );
  }

  // Not Logged In State
  if (!user || !token) {
    return (
      <div className="bg-[#f8f6f0] dark:bg-[#0d0c0b] text-[#1a1816] dark:text-[#f8f6f0] min-h-[80vh] flex items-center justify-center p-6 transition-colors duration-300">
        <div className="max-w-md w-full bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 p-8 sm:p-10 shadow-xl text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#b38b4d] via-[#e5c583] to-[#8c6d3b]" />
          
          <div className="w-14 h-14 rounded-full bg-[#8c6d3b]/10 dark:bg-[#c29b62]/10 border border-[#8c6d3b]/20 flex items-center justify-center mx-auto text-[#8c6d3b] dark:text-[#c29b62]">
            <Heart className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8c6d3b] dark:text-[#c29b62]">
              Private Olfactory Curation
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#1a1816] dark:text-white font-normal">
              Sign In to View Your Wishlist
            </h1>
            <p className="text-xs text-[#7a746e] dark:text-[#a6a096] leading-relaxed">
              Save your favorite bespoke flacons, reserve rare distillations, and access them across all your devices.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Link href="/auth/login" className="block w-full">
              <button className="w-full py-3.5 bg-[#1a1816] hover:bg-[#b38b4d] text-[#f8f6f0] dark:bg-[#f8f6f0] dark:hover:bg-[#c29b62] dark:text-[#1a1816] text-xs uppercase tracking-widest font-semibold transition-colors shadow-sm">
                Sign In to Maison Account
              </button>
            </Link>
            <Link href="/auth/register" className="block w-full">
              <button className="w-full py-3.5 border border-[#e8e2d4] dark:border-white/10 text-[#1a1816] dark:text-[#f8f6f0] hover:bg-[#f3efe6] dark:hover:bg-[#1a1816] text-xs uppercase tracking-widest font-medium transition-colors">
                Create New Membership
              </button>
            </Link>
          </div>

          <div className="pt-2">
            <Link href="/shop" className="text-xs text-[#7a746e] dark:text-[#a6a096] hover:text-[#1a1816] dark:hover:text-white flex items-center justify-center gap-1.5 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Explore Public Boutique</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Logged In with Empty Wishlist
  if (wishlist.length === 0) {
    return (
      <div className="bg-[#f8f6f0] dark:bg-[#0d0c0b] text-[#1a1816] dark:text-[#f8f6f0] min-h-[80vh] flex items-center justify-center p-6 transition-colors duration-300">
        <div className="max-w-lg w-full text-center space-y-6">
          <div className="w-16 h-16 border border-[#e8e2d4] dark:border-white/10 bg-white dark:bg-[#141211] rounded-full flex items-center justify-center text-[#8c6d3b] dark:text-[#c29b62] mx-auto">
            <Heart className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[#8c6d3b] dark:text-[#c29b62]">
              Empty Vault
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1a1816] dark:text-white font-normal">
              Your Wishlist is Empty
            </h1>
            <p className="text-xs text-[#7a746e] dark:text-[#a6a096] max-w-sm mx-auto leading-relaxed">
              Explore our artisanal harvests and click the heart icon on any flacon to curate your private collection.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link href="/shop">
              <button className="px-8 py-3.5 bg-[#1a1816] text-[#f8f6f0] dark:bg-[#f8f6f0] dark:text-[#1a1816] text-xs uppercase tracking-widest font-semibold hover:bg-[#b38b4d] dark:hover:bg-[#c29b62] transition-colors shadow-sm flex items-center justify-center gap-2">
                <span>Browse Fragrance Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/quiz">
              <button className="px-8 py-3.5 border border-[#e8e2d4] dark:border-white/10 text-[#1a1816] dark:text-[#f8f6f0] hover:bg-[#f3efe6] dark:hover:bg-[#1a1816] text-xs uppercase tracking-widest font-medium transition-colors flex items-center justify-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#8c6d3b] dark:text-[#c29b62]" />
                <span>AI Scent Consultation</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Active Wishlist Grid
  return (
    <div className="bg-[#f8f6f0] dark:bg-[#0d0c0b] text-[#1a1816] dark:text-[#f8f6f0] py-12 transition-colors min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#e8e2d4] dark:border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-[#7a746e] dark:text-[#a6a096] mb-1.5">
              <Link href="/" className="hover:text-[#b38b4d] flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" /> Home
              </Link>
              <span>/</span>
              <span className="text-[#8c6d3b] dark:text-[#c29b62] font-semibold">Private Wishlist</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1a1816] dark:text-white font-normal">
              Your Curated Fragrance Vault
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-[#7a746e] dark:text-[#a6a096] bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 px-4 py-2">
              <strong className="text-[#1a1816] dark:text-white">{wishlist.length}</strong> Flacons Saved
            </span>
          </div>
        </div>

        {/* Flacons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {wishlist.map((product) => {
            const prodId = product._id || product.id!;
            return (
              <div
                key={prodId}
                className="group bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:border-[#b38b4d]/50"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/5] bg-[#f3efe6] dark:bg-[#1a1816] overflow-hidden">
                  <Link href={`/products/${prodId}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </Link>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    <span className="bg-[#1a1816]/90 backdrop-blur-sm text-[#f8f6f0] text-[9px] uppercase tracking-widest px-2.5 py-1 font-semibold">
                      {product.category}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveFromWishlist(prodId, product.name)}
                    title="Remove from wishlist"
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-[#141211]/90 backdrop-blur-sm text-stone-500 hover:text-rose-600 dark:hover:text-rose-400 border border-[#e8e2d4] dark:border-white/10 flex items-center justify-center transition-colors shadow-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <Link href={`/products/${prodId}`}>
                      <h3 className="font-serif text-lg font-normal text-[#1a1816] dark:text-white group-hover:text-[#b38b4d] dark:group-hover:text-[#c29b62] transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-[11px] text-[#7a746e] dark:text-[#a6a096] line-clamp-2 leading-relaxed">
                      {product.subtitle || product.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#e8e2d4]/70 dark:border-white/5 flex items-baseline justify-between">
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase tracking-wider text-[#7a746e] dark:text-[#a6a096] block">
                        {product.volume || '50ml Extrait'}
                      </span>
                      <span className="font-serif text-base font-bold text-[#1a1816] dark:text-white">
                        {formatPrice(product.price)}
                      </span>
                    </div>

                    <span className={`text-[10px] px-2 py-0.5 font-semibold ${
                      product.stock > 0
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                    }`}>
                      {product.stock > 0 ? 'In Stock' : 'Awaiting Harvest'}
                    </span>
                  </div>

                  {/* Add to Cart CTA */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock <= 0}
                    className="w-full py-2.5 bg-[#1a1816] hover:bg-[#b38b4d] text-[#f8f6f0] dark:bg-[#f8f6f0] dark:hover:bg-[#c29b62] dark:text-[#1a1816] text-[11px] uppercase tracking-widest font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Shopping Bag</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
