'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { ApiClient } from '@/patterns/api/AbstractApiClientFactory';
import { useToast } from '@/context/ToastContext';
import { Trash2, ShoppingBag, ArrowRight, Tag, Check, Gift, Sparkles } from 'lucide-react';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, subtotal, appliedCoupon, applyCoupon } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const { showToast } = useToast();

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setIsApplying(true);
    const res = await ApiClient.applyCoupon(couponCode.trim(), subtotal);
    setIsApplying(false);

    if (res) {
      applyCoupon(res);
      showToast(`Privilege Code "${res.code}" applied! Deducted ${formatPrice(res.discountAmount)} ✨`);
      setCouponCode('');
    } else {
      showToast('Invalid privilege code or minimum threshold not met', 'error');
    }
  };

  const shippingFee = subtotal > 180 || subtotal === 0 ? 0 : 20;
  const tax = subtotal * 0.05;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const total = Math.max(0, subtotal + shippingFee + tax - discountAmount);

  if (items.length === 0) {
    return (
      <div className="bg-[#f8f6f0] dark:bg-[#0d0c0b] text-[#1a1816] dark:text-[#f8f6f0] min-h-[70vh] flex items-center justify-center transition-colors">
        <div className="max-w-md mx-auto px-4 py-24 text-center">
          <div className="w-16 h-16 border border-[#b38b4d]/40 dark:border-[#c29b62]/40 bg-white dark:bg-[#141211] flex items-center justify-center text-[#8c6d3b] dark:text-[#c29b62] mx-auto mb-6">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#1a1816] dark:text-[#f8f6f0] mb-3">
            Your Shopping Bag is Empty
          </h2>
          <p className="text-xs text-[#7a746e] dark:text-[#a6a096] leading-relaxed mb-8">
            Immerse yourself in our olfactory archives and select your signature flacon.
          </p>
          <Link
            href="/#catalog"
            className="inline-block px-8 py-3.5 bg-[#1a1816] text-[#f8f6f0] dark:bg-[#f8f6f0] dark:text-[#1a1816] text-xs uppercase tracking-widest font-semibold hover:bg-[#b38b4d] transition-colors"
          >
            Explore Wardrobe
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f6f0] dark:bg-[#0d0c0b] text-[#1a1816] dark:text-[#f8f6f0] py-12 transition-colors min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-[#e8e2d4] dark:border-white/10">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#8c6d3b] dark:text-[#c29b62] font-semibold">
              Maison Checkout
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#1a1816] dark:text-[#f8f6f0]">
              Shopping Bag <span className="font-sans text-xs text-[#7a746e] dark:text-[#a6a096] uppercase tracking-wider">({items.length} Flacons)</span>
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Bag Items List */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {items.map(({ product, quantity }) => {
              const prodId = product._id || product.id!;
              return (
                <div
                  key={prodId}
                  className="bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-5 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-5 w-full sm:w-auto">
                    <div className="w-20 h-20 bg-[#f3efe6] dark:bg-[#1a1816] border border-[#e8e2d4] dark:border-white/10 p-2 shrink-0 flex items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-[0.2em] text-[#8c6d3b] dark:text-[#c29b62] font-semibold">
                        {product.archetype || product.category} &middot; {product.volume || '50ml'}
                      </span>
                      <Link href={`/products/${prodId}`}>
                        <h3 className="font-serif text-lg text-[#1a1816] dark:text-[#f8f6f0] hover:text-[#b38b4d] dark:hover:text-[#c29b62] transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-[11px] text-[#7a746e] dark:text-[#a6a096] mt-0.5 line-clamp-1">
                        {product.subtitle || 'Extrait de Parfum'}
                      </p>
                      <div className="font-serif text-sm font-medium text-[#1a1816] dark:text-[#f8f6f0] mt-1 sm:hidden">
                        {formatPrice(product.price)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                    <div className="flex items-center border border-[#e8e2d4] dark:border-white/10 bg-[#f8f6f0] dark:bg-[#1a1816] px-3 py-1">
                      <button
                        onClick={() => updateQuantity(prodId, quantity - 1)}
                        className="text-[#7a746e] hover:text-[#1a1816] dark:hover:text-white px-2 text-sm font-bold transition-colors"
                      >
                        -
                      </button>
                      <span className="font-serif font-bold text-xs text-[#1a1816] dark:text-white min-w-[20px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(prodId, quantity + 1)}
                        className="text-[#7a746e] hover:text-[#1a1816] dark:hover:text-white px-2 text-sm font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <div className="font-serif text-lg font-medium text-[#1a1816] dark:text-[#f8f6f0] min-w-[90px] text-right">
                      {formatPrice(product.price * quantity)}
                    </div>

                    <button
                      onClick={() => removeItem(prodId)}
                      className="text-[#7a746e] hover:text-rose-600 dark:hover:text-rose-400 p-2 transition-colors"
                      title="Remove flacon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Complimentary Discovery Vial Card */}
            <div className="p-4 bg-[#f3efe6] dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 flex items-center gap-3">
              <Gift className="w-5 h-5 text-[#8c6d3b] dark:text-[#c29b62] shrink-0" />
              <p className="text-xs text-[#7a746e] dark:text-[#a6a096]">
                <strong className="text-[#1a1816] dark:text-[#f8f6f0]">Included in your package:</strong> 2x Complimentary 2ml Discovery Vials + Maison Presentation Box with Golden Ribbon.
              </p>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Link
                href="/#catalog"
                className="text-xs uppercase tracking-wider text-[#7a746e] dark:text-[#a6a096] hover:text-[#1a1816] dark:hover:text-white transition-colors"
              >
                &larr; Discover More Fragrances
              </Link>
              <button
                onClick={clearCart}
                className="text-xs uppercase tracking-wider text-rose-600 dark:text-rose-400 hover:underline"
              >
                Empty Bag
              </button>
            </div>
          </div>

          {/* Summary Column */}
          <div className="lg:col-span-4 bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 p-6 sm:p-7 sticky top-28 flex flex-col gap-6 shadow-sm">
            <h2 className="font-serif text-xl font-normal text-[#1a1816] dark:text-[#f8f6f0]">
              Maison Order Summary
            </h2>

            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-[#8c6d3b] dark:text-[#c29b62] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Privilege Code (e.g. VIP10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full bg-[#f8f6f0] dark:bg-[#1a1816] border border-[#e8e2d4] dark:border-white/10 pl-9 pr-3 py-2.5 text-xs text-[#1a1816] dark:text-[#f8f6f0] placeholder-[#a6a096] focus:outline-none focus:border-[#b38b4d]"
                />
              </div>
              <button
                type="submit"
                disabled={isApplying}
                className="px-4 py-2.5 bg-[#1a1816] text-[#f8f6f0] dark:bg-[#f8f6f0] dark:text-[#1a1816] text-xs uppercase tracking-wider font-semibold hover:bg-[#b38b4d] transition-colors"
              >
                Apply
              </button>
            </form>

            {appliedCoupon && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-semibold">
                  <Check className="w-4 h-4" />
                  <span>Privilege: {appliedCoupon.code}</span>
                </div>
                <button
                  onClick={() => applyCoupon(null)}
                  className="text-rose-600 dark:text-rose-400 font-bold hover:underline"
                >
                  Remove
                </button>
              </div>
            )}

            <div className="space-y-3 text-xs text-[#7a746e] dark:text-[#a6a096] border-t border-b border-[#e8e2d4] dark:border-white/10 py-4">
              <div className="flex justify-between">
                <span>Olfactory Subtotal</span>
                <span className="font-serif font-bold text-sm text-[#1a1816] dark:text-[#f8f6f0]">{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Privilege Deduction</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Bespoke Shipping</span>
                <span className="font-serif font-bold text-sm text-[#1a1816] dark:text-[#f8f6f0]">
                  {shippingFee === 0 ? <span className="text-emerald-700 dark:text-emerald-400 font-sans text-xs">COMPLIMENTARY</span> : formatPrice(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (5%)</span>
                <span className="font-serif font-bold text-sm text-[#1a1816] dark:text-[#f8f6f0]">{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between items-baseline text-base font-normal text-[#1a1816] dark:text-[#f8f6f0] pt-2 border-t border-[#e8e2d4]/70 dark:border-white/5">
                <span className="font-serif">Grand Total</span>
                <span className="font-serif text-2xl font-semibold text-[#1a1816] dark:text-[#f8f6f0]">{formatPrice(total)}</span>
              </div>
            </div>

            <Link href="/checkout" className="block w-full">
              <button className="w-full py-4 bg-[#1a1816] hover:bg-[#b38b4d] text-[#f8f6f0] dark:bg-[#f8f6f0] dark:hover:bg-[#c29b62] dark:text-[#1a1816] text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
