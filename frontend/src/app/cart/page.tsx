'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/patterns/ui-factory/AbstractComponentFactory';
import { ApiClient } from '@/patterns/api/AbstractApiClientFactory';
import { useToast } from '@/context/ToastContext';
import { Trash2, ShoppingBag, ArrowRight, Tag, Check } from 'lucide-react';

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
      showToast(`Coupon "${res.code}" applied! Saved ${formatPrice(res.discountAmount)} 🎉`);
      setCouponCode('');
    } else {
      showToast('Invalid coupon or minimum order requirement not met', 'error');
    }
  };

  const shippingFee = subtotal > 150 || subtotal === 0 ? 0 : 15;
  const tax = subtotal * 0.05;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const total = Math.max(0, subtotal + shippingFee + tax - discountAmount);

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-amber-500/10 dark:bg-indigo-500/10 border border-amber-500/20 dark:border-indigo-500/20 flex items-center justify-center text-amber-700 dark:text-indigo-400 mx-auto mb-6">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-stone-900 dark:text-white mb-3">Your Cart is Empty</h2>
        <p className="text-stone-500 dark:text-slate-400 text-sm max-w-sm mx-auto mb-8">
          Explore our minimalist luxury catalog and discover curated lifestyle gear.
        </p>
        <Link href="/">
          <Button variant="primary" size="lg">Start Exploring</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-heading font-extrabold text-3xl text-stone-900 dark:text-white mb-8">
        Shopping Cart <span className="text-amber-700 dark:text-indigo-400 font-normal">({items.length} Items)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        <div className="lg:col-span-2 flex flex-col gap-4">
          {items.map(({ product, quantity }) => {
            const prodId = product._id || product.id!;
            return (
              <div
                key={prodId}
                className="glass-panel rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-5 transition-all"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 rounded-xl object-cover bg-stone-200 dark:bg-slate-900 border border-stone-200 dark:border-white/10 shrink-0"
                  />
                  <div>
                    <Link href={`/products/${prodId}`}>
                      <h3 className="font-bold text-sm sm:text-base text-stone-900 dark:text-white hover:text-amber-700 dark:hover:text-indigo-300 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="text-xs text-stone-500 dark:text-slate-400 mt-1">{product.category}</div>
                    <div className="text-sm font-extrabold text-amber-700 dark:text-cyan-400 mt-1 sm:hidden">
                      {formatPrice(product.price)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                  <div className="flex items-center border border-stone-300 dark:border-white/15 bg-stone-100 dark:bg-slate-900 rounded-full px-3 py-1">
                    <button
                      onClick={() => updateQuantity(prodId, quantity - 1)}
                      className="text-stone-500 hover:text-stone-900 dark:text-slate-400 dark:hover:text-white px-2 font-bold transition-colors"
                    >
                      -
                    </button>
                    <span className="font-bold text-xs text-stone-900 dark:text-white min-w-[20px] text-center">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(prodId, quantity + 1)}
                      className="text-stone-500 hover:text-stone-900 dark:text-slate-400 dark:hover:text-white px-2 font-bold transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <div className="font-heading font-bold text-base text-stone-900 dark:text-white min-w-[80px] text-right">
                    {formatPrice(product.price * quantity)}
                  </div>

                  <button
                    onClick={() => removeItem(prodId)}
                    className="text-stone-400 hover:text-rose-600 dark:text-slate-500 dark:hover:text-rose-400 p-2 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="flex justify-between items-center pt-2">
            <Link href="/" className="text-xs font-semibold text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white transition-colors">
              ← Continue Shopping
            </Link>
            <button
              onClick={clearCart}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
            >
              Empty Cart
            </button>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6 sm:p-7 sticky top-28 flex flex-col gap-6">
          <h2 className="font-heading font-bold text-xl text-stone-900 dark:text-white">Order Summary</h2>

          <form onSubmit={handleApplyCoupon} className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="w-4 h-4 text-stone-400 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Promo Code (e.g. SAVE10)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-full bg-white dark:bg-slate-950/80 border border-stone-300 dark:border-white/10 rounded-full pl-9 pr-3 py-2 text-xs text-stone-900 dark:text-slate-100 placeholder-stone-400 dark:placeholder-slate-500 focus:outline-none focus:border-stone-800 dark:focus:border-indigo-500 transition-colors"
              />
            </div>
            <Button variant="outline" size="sm" type="submit" disabled={isApplying}>
              Apply
            </Button>
          </form>

          {appliedCoupon && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold">
                <Check className="w-4 h-4" />
                <span>Coupon: {appliedCoupon.code}</span>
              </div>
              <button
                onClick={() => applyCoupon(null)}
                className="text-rose-600 dark:text-rose-400 font-bold hover:underline"
              >
                Remove
              </button>
            </div>
          )}

          <div className="space-y-3 text-xs sm:text-sm text-stone-600 dark:text-slate-400 border-t border-b border-stone-200 dark:border-white/10 py-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-stone-900 dark:text-slate-200">{formatPrice(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                <span>Promo Discount</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-bold text-stone-900 dark:text-slate-200">
                {shippingFee === 0 ? <span className="text-emerald-600 dark:text-emerald-400">FREE</span> : formatPrice(shippingFee)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Tax (5%)</span>
              <span className="font-bold text-stone-900 dark:text-slate-200">{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between text-base font-black text-stone-900 dark:text-white pt-2 border-t border-stone-200 dark:border-white/5">
              <span>Total</span>
              <span className="text-xl font-heading font-extrabold text-stone-900 dark:text-white">{formatPrice(total)}</span>
            </div>
          </div>

          <Link href="/checkout">
            <Button variant="primary" size="lg" className="w-full gap-2">
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
