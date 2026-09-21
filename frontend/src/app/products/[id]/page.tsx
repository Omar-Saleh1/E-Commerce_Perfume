'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ApiClient } from '@/patterns/api/AbstractApiClientFactory';
import { IProduct } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { Star, ArrowLeft, ShoppingBag, Gift, Sparkles, Check, Droplets, ShieldCheck, Heart } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [related, setRelated] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVolume, setSelectedVolume] = useState<'30ml' | '50ml' | '100ml'>('50ml');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    async function load() {
      if (id) {
        setLoading(true);
        const p = await ApiClient.getProductById(String(id));
        setProduct(p);
        const all = await ApiClient.getProducts({});
        const companions = all.products.filter(item => (item._id || item.id) !== String(id)).slice(0, 4);
        setRelated(companions);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <div className="inline-block w-8 h-8 border-2 border-[#b38b4d] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-[#8c6d3b] dark:text-[#c29b62] font-serif text-sm tracking-widest uppercase">
          Synthesizing Olfactory Profile...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-32 text-center">
        <h2 className="font-serif text-3xl font-normal text-[#1a1816] dark:text-[#f8f6f0] mb-4">
          Fragrance Not Found
        </h2>
        <p className="text-xs text-[#7a746e] dark:text-[#a6a096] mb-8">
          The requested flacon may have completed its seasonal distillation harvest.
        </p>
        <Link
          href="/#catalog"
          className="inline-block px-8 py-3.5 bg-[#1a1816] text-[#f8f6f0] dark:bg-[#f8f6f0] dark:text-[#1a1816] text-xs uppercase tracking-widest font-semibold hover:bg-[#b38b4d] transition-colors"
        >
          Return to Wardrobe
        </Link>
      </div>
    );
  }

  // Volume price adjustments
  const volumeMultiplier = {
    '30ml': 0.72,
    '50ml': 1.0,
    '100ml': 1.65,
  };
  const currentPrice = Math.round(product.price * volumeMultiplier[selectedVolume]);

  const handleAddToCart = () => {
    const customProduct = {
      ...product,
      volume: selectedVolume,
      price: currentPrice,
    };
    addItem(customProduct, quantity);
    showToast(`Added ${quantity}x ${product.name} (${selectedVolume}) to your Shopping Bag 🛍️`);
  };

  const topNotes = product.notes?.top?.length ? product.notes.top : ['Rare Cardamom', 'Bergamot Zest', 'Wild Pink Pepper'];
  const heartNotes = product.notes?.heart?.length ? product.notes.heart : ['Mysore Sandalwood', 'Florentine Orris', 'Warm Ambergris'];
  const baseNotes = product.notes?.base?.length ? product.notes.base : ['Madagascar Bourbon Vanilla', 'Smoked Cedar', 'Silken Musks'];

  return (
    <div className="bg-[#f8f6f0] dark:bg-[#0d0c0b] text-[#1a1816] dark:text-[#f8f6f0] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-[#7a746e] dark:text-[#a6a096] mb-10">
          <Link href="/" className="hover:text-[#b38b4d] dark:hover:text-[#c29b62] flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Maison Wardrobe
          </Link>
          <span>/</span>
          <span className="text-[#8c6d3b] dark:text-[#c29b62]">{product.archetype || product.category}</span>
          <span>/</span>
          <span className="font-semibold text-[#1a1816] dark:text-white truncate max-w-xs">{product.name}</span>
        </div>

        {/* Main Product Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-24">
          {/* Flacon Imagery Column */}
          <div className="lg:col-span-6 sticky top-24">
            <div className="relative aspect-square w-full bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 p-6 sm:p-12 shadow-sm overflow-hidden flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-full max-w-full object-contain drop-shadow-2xl transition-transform duration-700 hover:scale-105"
              />

              <div className="absolute top-4 left-4 bg-[#f8f6f0]/90 dark:bg-[#1a1816]/90 backdrop-blur-sm border border-[#e8e2d4] dark:border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8c6d3b] dark:text-[#c29b62]">
                {product.concentration || 'Extrait de Parfum'} &middot; {selectedVolume}
              </div>

              <button
                onClick={() => {
                  setIsWishlisted(!isWishlisted);
                  showToast(isWishlisted ? 'Removed from Wishlist' : 'Saved to Wishlist ❤️');
                }}
                className={`absolute top-4 right-4 p-2.5 rounded-full border transition-all ${
                  isWishlisted
                    ? 'bg-rose-500/10 border-rose-500 text-rose-500'
                    : 'bg-white/80 dark:bg-black/50 border-[#e8e2d4] dark:border-white/10 text-[#7a746e] hover:text-[#b38b4d]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            {/* Complimentary Discovery Vials Banner */}
            <div className="mt-4 p-4 bg-[#f3efe6] dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 flex items-center gap-3">
              <Gift className="w-5 h-5 text-[#8c6d3b] dark:text-[#c29b62] shrink-0" />
              <p className="text-xs text-[#7a746e] dark:text-[#a6a096] leading-relaxed">
                <strong className="text-[#1a1816] dark:text-[#f8f6f0] font-semibold">Complimentary Atelier Sampling:</strong> Every flacon arrives with two 2ml discovery vials to test before unsealing.
              </p>
            </div>
          </div>

          {/* Perfumery Details Column */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#8c6d3b] dark:text-[#c29b62] mb-2 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{product.archetype || 'Artisanal Extrait'}</span>
                <span>&bull;</span>
                <span>Batch No. 042/100</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1a1816] dark:text-[#f8f6f0] tracking-tight">
                {product.name}
              </h1>

              <p className="font-serif italic text-base text-[#8c6d3b] dark:text-[#c29b62] mt-1.5">
                {product.subtitle || 'An intimate nocturnal alchemy of noble resins and botanical absolutes.'}
              </p>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#e8e2d4]/70 dark:border-white/10">
                <div className="flex text-[#c29b62]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#c29b62] text-[#c29b62]" />
                  ))}
                </div>
                <span className="text-xs font-serif font-bold text-[#1a1816] dark:text-[#f8f6f0]">
                  {Number(product.rating || 4.9).toFixed(1)} / 5.0
                </span>
                <span className="text-xs text-[#7a746e] dark:text-[#a6a096]">
                  ({product.reviewsCount || 38} Connoisseur Reviews)
                </span>
              </div>
            </div>

            {/* Price Plaque */}
            <div className="bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 p-5 flex items-baseline justify-between shadow-sm">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl sm:text-4xl font-medium text-[#1a1816] dark:text-[#f8f6f0]">
                  {formatPrice(currentPrice)}
                </span>
                {product.oldPrice && (
                  <span className="text-sm text-[#7a746e] line-through font-serif">
                    {formatPrice(Math.round(product.oldPrice * volumeMultiplier[selectedVolume]))}
                  </span>
                )}
              </div>
              <span className="text-[11px] uppercase tracking-wider text-[#8c6d3b] dark:text-[#c29b62] font-semibold">
                28% Pure Extrait &middot; Tax Included
              </span>
            </div>

            {/* Narrative Description */}
            <p className="text-xs sm:text-sm text-[#7a746e] dark:text-[#a6a096] leading-relaxed">
              {product.description}
            </p>

            {/* Flacon Volume Selector */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between text-xs uppercase tracking-wider font-semibold">
                <span className="text-[#1a1816] dark:text-[#f8f6f0]">Flacon Volume</span>
                <span className="text-[#8c6d3b] dark:text-[#c29b62]">Hand-blown crystal</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {(['30ml', '50ml', '100ml'] as const).map((vol) => (
                  <button
                    key={vol}
                    onClick={() => setSelectedVolume(vol)}
                    className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider transition-all border text-center ${
                      selectedVolume === vol
                        ? 'bg-[#1a1816] text-[#f8f6f0] dark:bg-[#f8f6f0] dark:text-[#1a1816] border-[#1a1816] dark:border-white shadow-sm'
                        : 'bg-white dark:bg-[#141211] border-[#e8e2d4] dark:border-white/10 text-[#7a746e] dark:text-[#a6a096] hover:border-[#b38b4d]'
                    }`}
                  >
                    <span className="block">{vol}</span>
                    <span className="block font-serif text-[11px] mt-0.5 opacity-80">
                      {formatPrice(Math.round(product.price * volumeMultiplier[vol]))}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Olfactory Pyramid Breakdown */}
            <div className="bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold text-[#8c6d3b] dark:text-[#c29b62]">
                <Droplets className="w-3.5 h-3.5" />
                <span>The Olfactory Pyramid</span>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-[#e8e2d4]/70 dark:border-white/5 pb-2.5 text-xs">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#1a1816] dark:text-white sm:w-28 shrink-0">
                    Top Notes
                  </span>
                  <span className="text-[#7a746e] dark:text-[#a6a096]">
                    {topNotes.join(' &middot; ')}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-[#e8e2d4]/70 dark:border-white/5 pb-2.5 text-xs">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#1a1816] dark:text-white sm:w-28 shrink-0">
                    Heart Notes
                  </span>
                  <span className="text-[#7a746e] dark:text-[#a6a096]">
                    {heartNotes.join(' &middot; ')}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#1a1816] dark:text-white sm:w-28 shrink-0">
                    Base Notes
                  </span>
                  <span className="text-[#7a746e] dark:text-[#a6a096]">
                    {baseNotes.join(' &middot; ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Add to Bag Row */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="flex items-center justify-between border border-[#e8e2d4] dark:border-white/10 bg-white dark:bg-[#141211] px-4 py-3 w-full sm:w-36">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-base font-bold text-[#7a746e] hover:text-[#1a1816] dark:hover:text-white px-2 transition-colors"
                >
                  -
                </button>
                <span className="font-serif font-bold text-sm text-[#1a1816] dark:text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-base font-bold text-[#7a746e] hover:text-[#1a1816] dark:hover:text-white px-2 transition-colors"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-6 bg-[#1a1816] hover:bg-[#b38b4d] text-[#f8f6f0] dark:bg-[#f8f6f0] dark:hover:bg-[#c29b62] dark:text-[#1a1816] text-xs uppercase tracking-widest font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Bag &middot; {formatPrice(currentPrice * quantity)}</span>
              </button>
            </div>

            {/* Guarantee Pills */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] text-[#7a746e] dark:text-[#a6a096]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8c6d3b] dark:text-[#c29b62]" />
                <span>Hand-numbered harvest certificate</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#8c6d3b] dark:text-[#c29b62]" />
                <span>Complimentary luxury gift wrapping</span>
              </div>
            </div>
          </div>
        </div>

        {/* Olfactory Companions Section */}
        {related.length > 0 && (
          <div className="border-t border-[#e8e2d4] dark:border-white/10 pt-16">
            <div className="flex flex-col items-center text-center mb-10">
              <span className="text-xs uppercase tracking-[0.3em] text-[#8c6d3b] dark:text-[#c29b62] mb-2 font-semibold">
                Harmonious Pairings
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#1a1816] dark:text-[#f8f6f0]">
                Olfactory Companions
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((item) => (
                <ProductCard key={item._id || item.id} product={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
