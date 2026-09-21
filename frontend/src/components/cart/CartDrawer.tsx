'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { X, Trash2, ShoppingBag, ArrowRight, Gift, Sparkles } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeItem, clearCart, subtotal } = useCart();

  if (!isOpen) return null;

  const shippingFee = subtotal > 180 || subtotal === 0 ? 0 : 20;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#f8f6f0] dark:bg-[#0d0c0b] text-[#1a1816] dark:text-[#f8f6f0] border-l border-[#e8e2d4] dark:border-white/10 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-[#e8e2d4] dark:border-white/10 flex items-center justify-between bg-white/60 dark:bg-[#141211]/80 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#8c6d3b] dark:text-[#c29b62]" />
              <span className="font-serif text-lg font-normal tracking-wide">
                Your Shopping Bag ({items.length})
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#7a746e] hover:text-[#1a1816] dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 border border-[#b38b4d]/40 flex items-center justify-center text-[#8c6d3b] dark:text-[#c29b62] mb-4 bg-white dark:bg-[#141211]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-lg text-[#1a1816] dark:text-[#f8f6f0] mb-1">Your Bag is Empty</h4>
                <p className="text-xs text-[#7a746e] dark:text-[#a6a096] max-w-xs mb-6">
                  Discover our artisanal flacons and choose your signature fragrance.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#1a1816] text-[#f8f6f0] dark:bg-[#f8f6f0] dark:text-[#1a1816] text-xs uppercase tracking-widest font-semibold hover:bg-[#b38b4d] transition-colors"
                >
                  Explore Flacons
                </button>
              </div>
            ) : (
              <>
                {items.map(({ product, quantity }) => {
                  const prodId = product._id || product.id!;
                  return (
                    <div
                      key={prodId}
                      className="bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 p-3.5 flex gap-3.5 items-center shadow-sm"
                    >
                      <div className="w-16 h-16 bg-[#f3efe6] dark:bg-[#1a1816] border border-[#e8e2d4] dark:border-white/10 p-1 shrink-0 flex items-center justify-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] uppercase tracking-wider text-[#8c6d3b] dark:text-[#c29b62] block">
                          {product.archetype || product.category} &middot; {product.volume || '50ml'}
                        </span>
                        <h4 className="font-serif text-sm font-medium text-[#1a1816] dark:text-[#f8f6f0] truncate">
                          {product.name}
                        </h4>
                        <div className="font-serif text-xs font-semibold text-[#1a1816] dark:text-[#f8f6f0] mt-0.5">
                          {formatPrice(product.price)}
                        </div>

                        {/* Quantity Counter */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center border border-[#e8e2d4] dark:border-white/10 bg-[#f8f6f0] dark:bg-[#1a1816] px-2 py-0.5 text-xs">
                            <button
                              onClick={() => updateQuantity(prodId, quantity - 1)}
                              className="text-[#7a746e] hover:text-[#1a1816] dark:hover:text-white px-1"
                            >
                              -
                            </button>
                            <span className="font-serif font-bold text-[11px] px-2">{quantity}</span>
                            <button
                              onClick={() => updateQuantity(prodId, quantity + 1)}
                              className="text-[#7a746e] hover:text-[#1a1816] dark:hover:text-white px-1"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(prodId)}
                            className="text-[#7a746e] hover:text-rose-600 p-1 transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="font-serif text-sm font-semibold text-[#1a1816] dark:text-[#f8f6f0] text-right shrink-0">
                        {formatPrice(product.price * quantity)}
                      </div>
                    </div>
                  );
                })}

                {/* Discovery Vial Notification */}
                <div className="p-3 bg-[#f3efe6] dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 flex items-center gap-2 text-[11px] text-[#7a746e] dark:text-[#a6a096]">
                  <Gift className="w-4 h-4 text-[#8c6d3b] dark:text-[#c29b62] shrink-0" />
                  <span>Includes 2 complimentary 2ml discovery vials.</span>
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer / Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#e8e2d4] dark:border-white/10 bg-white/80 dark:bg-[#141211]/90 backdrop-blur-sm space-y-4">
              <div className="space-y-1.5 text-xs text-[#7a746e] dark:text-[#a6a096]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-serif font-bold text-sm text-[#1a1816] dark:text-[#f8f6f0]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bespoke Shipping</span>
                  <span className="font-serif text-xs font-semibold text-[#1a1816] dark:text-[#f8f6f0]">
                    {shippingFee === 0 ? <span className="text-emerald-700 dark:text-emerald-400 font-sans">COMPLIMENTARY</span> : formatPrice(shippingFee)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link href="/cart" onClick={onClose} className="flex-1">
                  <button className="w-full py-3 border border-[#1a1816] dark:border-white/20 text-[#1a1816] dark:text-[#f8f6f0] text-xs uppercase tracking-wider font-semibold hover:bg-[#1a1816] hover:text-[#f8f6f0] dark:hover:bg-white dark:hover:text-black transition-colors">
                    View Bag
                  </button>
                </Link>

                <Link href="/checkout" onClick={onClose} className="flex-1">
                  <button className="w-full py-3 bg-[#1a1816] hover:bg-[#b38b4d] text-[#f8f6f0] dark:bg-[#f8f6f0] dark:hover:bg-[#c29b62] dark:text-[#1a1816] text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                    <span>Checkout</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
