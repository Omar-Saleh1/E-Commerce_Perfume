'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/patterns/ui-factory/AbstractComponentFactory';
import { ApiClient } from '@/patterns/api/AbstractApiClientFactory';
import { useToast } from '@/context/ToastContext';
import { CreditCard, DollarSign, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export default function CheckoutPage() {
  const { items, subtotal, appliedCoupon, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    postalCode: '',
    country: 'United States',
    notes: '',
    paymentMethod: 'Credit Card / Visa & Mastercard',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState<any | null>(null);

  const shippingFee = subtotal > 150 || subtotal === 0 ? 0 : 15;
  const tax = subtotal * 0.05;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const total = Math.max(0, subtotal + shippingFee + tax - discountAmount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      showToast('Your cart is empty', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
          notes: formData.notes,
        },
        items: items.map((i) => ({
          product: i.product._id || i.product.id,
          name: i.product.name,
          quantity: i.quantity,
          price: i.product.price,
          image: i.product.image,
        })),
        subtotal,
        tax,
        shippingFee,
        discount: discountAmount,
        total,
        appliedCoupon: appliedCoupon?.code,
        paymentMethod: formData.paymentMethod,
      };

      const res = await ApiClient.createOrder(orderPayload);
      if (res.success && res.order) {
        setOrderComplete(res.order);
        clearCart();
        showToast('Order placed successfully! 🎉');
      } else {
        showToast(res.message || 'Failed to place order', 'error');
      }
    } catch {
      showToast('Network error while placing order', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-stone-900 dark:text-white mb-3">Order Confirmed!</h1>
        <p className="text-stone-600 dark:text-slate-400 text-sm max-w-md mx-auto mb-8">
          Thank you, <strong className="text-stone-900 dark:text-white">{orderComplete.customerName}</strong>. Your order{' '}
          <code className="text-amber-700 dark:text-indigo-400 font-bold">#{orderComplete._id}</code> has been confirmed.
        </p>

        <div className="glass-panel rounded-3xl p-6 text-left mb-8 space-y-3 text-xs sm:text-sm">
          <div className="flex justify-between text-stone-600 dark:text-slate-400">
            <span>Payment Method:</span>
            <span className="font-bold text-stone-900 dark:text-white">{orderComplete.paymentMethod}</span>
          </div>
          <div className="flex justify-between text-stone-600 dark:text-slate-400">
            <span>Delivery To:</span>
            <span className="font-bold text-stone-900 dark:text-white">{orderComplete.shippingAddress.street}, {orderComplete.shippingAddress.city}</span>
          </div>
          <div className="flex justify-between text-stone-600 dark:text-slate-400 border-t border-stone-200 dark:border-white/10 pt-3">
            <span>Total Paid:</span>
            <span className="font-extrabold text-base text-stone-900 dark:text-white">{formatPrice(orderComplete.total)}</span>
          </div>
        </div>

        <Link href="/">
          <Button variant="primary" size="lg">Return to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-heading font-extrabold text-3xl text-stone-900 dark:text-white mb-8">
        Secure <span className="text-amber-700 dark:text-indigo-400">Checkout</span>
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-5">
            <h2 className="font-heading font-bold text-xl text-stone-900 dark:text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-stone-900 text-stone-100 dark:bg-indigo-500/20 dark:text-indigo-400 text-xs font-black flex items-center justify-center border border-stone-700 dark:border-indigo-500/30">1</span>
              Customer Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-600 dark:text-slate-400 block mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white dark:bg-slate-950/80 border border-stone-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-stone-900 dark:text-white focus:outline-none focus:border-stone-800 dark:focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-600 dark:text-slate-400 block mb-1.5">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white dark:bg-slate-950/80 border border-stone-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-stone-900 dark:text-white focus:outline-none focus:border-stone-800 dark:focus:border-indigo-500 transition-colors"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-stone-600 dark:text-slate-400 block mb-1.5">Phone *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-white dark:bg-slate-950/80 border border-stone-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-stone-900 dark:text-white focus:outline-none focus:border-stone-800 dark:focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-5">
            <h2 className="font-heading font-bold text-xl text-stone-900 dark:text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-stone-900 text-stone-100 dark:bg-indigo-500/20 dark:text-indigo-400 text-xs font-black flex items-center justify-center border border-stone-700 dark:border-indigo-500/30">2</span>
              Delivery Address
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-stone-600 dark:text-slate-400 block mb-1.5">Street Address *</label>
                <input
                  type="text"
                  required
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full bg-white dark:bg-slate-950/80 border border-stone-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-stone-900 dark:text-white focus:outline-none focus:border-stone-800 dark:focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-600 dark:text-slate-400 block mb-1.5">City *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-white dark:bg-slate-950/80 border border-stone-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-stone-900 dark:text-white focus:outline-none focus:border-stone-800 dark:focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-600 dark:text-slate-400 block mb-1.5">Postal Code</label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full bg-white dark:bg-slate-950/80 border border-stone-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-stone-900 dark:text-white focus:outline-none focus:border-stone-800 dark:focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-5">
            <h2 className="font-heading font-bold text-xl text-stone-900 dark:text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-stone-900 text-stone-100 dark:bg-indigo-500/20 dark:text-indigo-400 text-xs font-black flex items-center justify-center border border-stone-700 dark:border-indigo-500/30">3</span>
              Payment Method
            </h2>
            <div className="space-y-3">
              {[
                { id: 'Credit Card / Visa & Mastercard', title: 'Credit / Debit Card', icon: CreditCard },
                { id: 'Apple Pay / Biometric Instant', title: 'Apple Pay / Digital Wallet', icon: ShieldCheck },
                { id: 'Cash on Delivery (COD)', title: 'Cash on Delivery (COD)', icon: DollarSign },
              ].map((m) => (
                <label
                  key={m.id}
                  className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                    formData.paymentMethod === m.id
                      ? 'bg-stone-200/70 border-stone-800 dark:bg-indigo-600/15 dark:border-indigo-500/50'
                      : 'bg-white/70 border-stone-300/80 hover:border-stone-400 dark:bg-slate-950/60 dark:border-white/10 dark:hover:border-white/20'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={m.id}
                    checked={formData.paymentMethod === m.id}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="text-stone-900 dark:text-indigo-600"
                  />
                  <m.icon className="w-5 h-5 text-stone-800 dark:text-indigo-400" />
                  <span className="text-sm font-bold text-stone-900 dark:text-white">{m.title}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6 sm:p-7 sticky top-28 space-y-6">
          <h3 className="font-heading font-bold text-xl text-stone-900 dark:text-white">Order Summary</h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {items.map(({ product, quantity }) => (
              <div key={product._id || product.id} className="flex items-center justify-between text-xs gap-3">
                <div className="truncate flex-1">
                  <span className="font-bold text-stone-900 dark:text-white">{product.name}</span>
                  <span className="text-stone-500 dark:text-slate-400 ml-1.5">× {quantity}</span>
                </div>
                <span className="font-bold text-stone-900 dark:text-slate-200 shrink-0">{formatPrice(product.price * quantity)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-stone-600 dark:text-slate-400 border-t border-b border-stone-200 dark:border-white/10 py-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-stone-900 dark:text-slate-200">{formatPrice(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                <span>Promo ({appliedCoupon?.code})</span>
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
              <span>Tax (5%)</span>
              <span className="font-bold text-stone-900 dark:text-slate-200">{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between text-base font-black text-stone-900 dark:text-white pt-2 border-t border-stone-200 dark:border-white/5">
              <span>Total</span>
              <span className="text-xl font-heading font-extrabold text-stone-900 dark:text-white">{formatPrice(total)}</span>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
            className="w-full gap-2"
          >
            <span>{isSubmitting ? 'Processing Order...' : 'Complete Purchase'}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
