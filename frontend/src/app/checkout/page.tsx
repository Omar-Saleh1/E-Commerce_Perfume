'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/utils';
import { ApiClient } from '@/patterns/api/AbstractApiClientFactory';
import { useToast } from '@/context/ToastContext';
import { CreditCard, DollarSign, CheckCircle2, ShieldCheck, ArrowRight, Sparkles, Gift, Truck, Crown, Package } from 'lucide-react';

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
    shippingTier: 'standard'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState<any | null>(null);

  // Dynamic shipping calculation matching Abstract Factory ecosystem
  let shippingFee = 0;
  if (formData.shippingTier === 'vip') {
    shippingFee = subtotal >= 500 || subtotal === 0 ? 0 : 75;
  } else if (formData.shippingTier === 'express') {
    shippingFee = subtotal >= 300 || subtotal === 0 ? 0 : 35;
  } else {
    shippingFee = subtotal >= 180 || subtotal === 0 ? 0 : 15;
  }

  const tax = subtotal * 0.05;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const total = Math.max(0, subtotal + shippingFee + tax - discountAmount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      showToast('Your shopping bag is empty', 'error');
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
        shippingTier: formData.shippingTier,
      };

      const res = await ApiClient.createOrder(orderPayload);
      if (res.success && res.order) {
        setOrderComplete({
          ...res.order,
          consignment: res.consignment
        });
        clearCart();
        showToast('Order confirmed! Welcome to the Maison Odoratus family. ✨');
      } else {
        showToast(res.message || 'Failed to place order', 'error');
      }
    } catch {
      showToast('Network error while processing order', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="bg-[#f8f6f0] dark:bg-[#0d0c0b] text-[#1a1816] dark:text-[#f8f6f0] min-h-[80vh] flex items-center justify-center py-20 transition-colors">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="w-16 h-16 border border-[#b38b4d]/40 bg-white dark:bg-[#141211] flex items-center justify-center text-[#8c6d3b] dark:text-[#c29b62] mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#8c6d3b] dark:text-[#c29b62] font-semibold">
            Order Confirmed &middot; Atelier Grasse
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#1a1816] dark:text-[#f8f6f0] mt-2 mb-3">
            Thank You, {orderComplete.customerName}
          </h1>
          <p className="text-xs text-[#7a746e] dark:text-[#a6a096] max-w-md mx-auto mb-8">
            Your flacons are now being prepared and numbered under reference{' '}
            <span className="font-serif font-bold text-[#8c6d3b] dark:text-[#c29b62]">#{orderComplete._id?.slice(-8).toUpperCase()}</span>.
          </p>

          <div className="bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 p-6 text-left mb-8 space-y-3 text-xs shadow-sm">
            <div className="flex justify-between text-[#7a746e] dark:text-[#a6a096]">
              <span>Consignment Ref:</span>
              <span className="font-mono font-bold text-[#8c6d3b] dark:text-[#c29b62]">{orderComplete.trackingNumber || `#${orderComplete._id?.slice(-8).toUpperCase()}`}</span>
            </div>
            <div className="flex justify-between text-[#7a746e] dark:text-[#a6a096]">
              <span>Logistics Tier:</span>
              <span className="font-medium text-[#1a1816] dark:text-white">{orderComplete.fulfillmentTier || 'Standard Maison Ground'}</span>
            </div>
            {orderComplete.packaging?.boxType && (
              <div className="flex justify-between text-[#7a746e] dark:text-[#a6a096]">
                <span>Atelier Packaging:</span>
                <span className="font-medium text-[#8c6d3b] dark:text-[#c29b62]">{orderComplete.packaging.boxType}</span>
              </div>
            )}
            <div className="flex justify-between text-[#7a746e] dark:text-[#a6a096]">
              <span>Carrier:</span>
              <span className="font-medium text-[#1a1816] dark:text-white">{orderComplete.carrier || 'DHL Express Aviation'}</span>
            </div>
            <div className="flex justify-between text-[#7a746e] dark:text-[#a6a096]">
              <span>Settlement Protocol:</span>
              <span className="font-medium text-[#1a1816] dark:text-white">{orderComplete.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-[#7a746e] dark:text-[#a6a096]">
              <span>Destination:</span>
              <span className="font-medium text-[#1a1816] dark:text-white">{orderComplete.shippingAddress.street}, {orderComplete.shippingAddress.city}</span>
            </div>
            <div className="flex justify-between items-baseline text-[#7a746e] dark:text-[#a6a096] border-t border-[#e8e2d4] dark:border-white/10 pt-3">
              <span>Grand Total Settled:</span>
              <span className="font-serif text-lg font-bold text-[#1a1816] dark:text-white">{formatPrice(orderComplete.total)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={`/orders/${orderComplete._id}`}>
              <button className="w-full sm:w-auto px-8 py-3.5 bg-[#1a1816] text-[#f8f6f0] dark:bg-[#f8f6f0] dark:text-[#1a1816] text-xs uppercase tracking-widest font-semibold hover:bg-[#b38b4d] dark:hover:bg-[#c29b62] transition-colors flex items-center justify-center gap-2">
                <Package className="w-4 h-4" />
                <span>View Order Details</span>
              </button>
            </Link>
            <Link href={`/orders/${orderComplete._id}/track`}>
              <button className="w-full sm:w-auto px-8 py-3.5 bg-[#b38b4d] text-white hover:bg-[#8c6d3b] text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center gap-2">
                <Truck className="w-4 h-4" />
                <span>Track Live Consignment</span>
              </button>
            </Link>
            <Link href="/">
              <button className="w-full sm:w-auto px-8 py-3.5 border border-[#e8e2d4] dark:border-white/10 text-[#1a1816] dark:text-[#f8f6f0] hover:bg-[#f3efe6] dark:hover:bg-[#1a1816] text-xs uppercase tracking-widest font-semibold transition-colors">
                Maison Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f6f0] dark:bg-[#0d0c0b] text-[#1a1816] dark:text-[#f8f6f0] py-12 transition-colors min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 pb-4 border-b border-[#e8e2d4] dark:border-white/10">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#8c6d3b] dark:text-[#c29b62] font-semibold">
            Haute Parfumerie Dispatch
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#1a1816] dark:text-[#f8f6f0]">
            Secure Maison Checkout
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Inputs Section */}
          <div className="lg:col-span-8 space-y-6">
            {/* Step 1: Connoisseur Information */}
            <div className="bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 p-6 sm:p-8 space-y-5 shadow-sm">
              <h2 className="font-serif text-xl font-normal text-[#1a1816] dark:text-[#f8f6f0] flex items-center gap-3">
                <span className="w-6 h-6 bg-[#1a1816] text-[#f8f6f0] dark:bg-[#f8f6f0] dark:text-[#1a1816] text-[11px] font-serif font-bold flex items-center justify-center">
                  1
                </span>
                Connoisseur Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#7a746e] dark:text-[#a6a096] block mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#f8f6f0] dark:bg-[#1a1816] border border-[#e8e2d4] dark:border-white/10 px-4 py-2.5 text-xs text-[#1a1816] dark:text-[#f8f6f0] focus:outline-none focus:border-[#b38b4d]"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#7a746e] dark:text-[#a6a096] block mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#f8f6f0] dark:bg-[#1a1816] border border-[#e8e2d4] dark:border-white/10 px-4 py-2.5 text-xs text-[#1a1816] dark:text-[#f8f6f0] focus:outline-none focus:border-[#b38b4d]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#7a746e] dark:text-[#a6a096] block mb-1.5">
                    Telephone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#f8f6f0] dark:bg-[#1a1816] border border-[#e8e2d4] dark:border-white/10 px-4 py-2.5 text-xs text-[#1a1816] dark:text-[#f8f6f0] focus:outline-none focus:border-[#b38b4d]"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Delivery Destination */}
            <div className="bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 p-6 sm:p-8 space-y-5 shadow-sm">
              <h2 className="font-serif text-xl font-normal text-[#1a1816] dark:text-[#f8f6f0] flex items-center gap-3">
                <span className="w-6 h-6 bg-[#1a1816] text-[#f8f6f0] dark:bg-[#f8f6f0] dark:text-[#1a1816] text-[11px] font-serif font-bold flex items-center justify-center">
                  2
                </span>
                Bespoke Delivery Destination
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#7a746e] dark:text-[#a6a096] block mb-1.5">
                    Street & Residence Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full bg-[#f8f6f0] dark:bg-[#1a1816] border border-[#e8e2d4] dark:border-white/10 px-4 py-2.5 text-xs text-[#1a1816] dark:text-[#f8f6f0] focus:outline-none focus:border-[#b38b4d]"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#7a746e] dark:text-[#a6a096] block mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-[#f8f6f0] dark:bg-[#1a1816] border border-[#e8e2d4] dark:border-white/10 px-4 py-2.5 text-xs text-[#1a1816] dark:text-[#f8f6f0] focus:outline-none focus:border-[#b38b4d]"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#7a746e] dark:text-[#a6a096] block mb-1.5">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full bg-[#f8f6f0] dark:bg-[#1a1816] border border-[#e8e2d4] dark:border-white/10 px-4 py-2.5 text-xs text-[#1a1816] dark:text-[#f8f6f0] focus:outline-none focus:border-[#b38b4d]"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Logistics & Packaging Ecosystem (Abstract Factory Tier) */}
            <div className="bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 p-6 sm:p-8 space-y-5 shadow-sm">
              <h2 className="font-serif text-xl font-normal text-[#1a1816] dark:text-[#f8f6f0] flex items-center gap-3">
                <span className="w-6 h-6 bg-[#1a1816] text-[#f8f6f0] dark:bg-[#f8f6f0] dark:text-[#1a1816] text-[11px] font-serif font-bold flex items-center justify-center">
                  3
                </span>
                Consignment Logistics &amp; Flacon Packaging Tier
              </h2>
              <div className="space-y-3">
                {[
                  {
                    id: 'standard',
                    title: 'Standard Maison Ground Priority',
                    desc: 'Artisanal Sandboard Box + 2 Discovery Vials • Maison Ground Post (3-5 days)',
                    priceText: subtotal >= 180 ? 'Complimentary' : '$15.00',
                    icon: Truck
                  },
                  {
                    id: 'express',
                    title: 'Express Global Air Consignment (DHL Aviation)',
                    desc: 'IATA Thermal HazMat Flacon Shielding + 3 Discovery Vials • DHL Air (1-3 days)',
                    priceText: subtotal >= 300 ? 'Complimentary' : '$35.00',
                    icon: Sparkles
                  },
                  {
                    id: 'vip',
                    title: 'VIP White-Glove Atelier Concierge',
                    desc: 'Handcrafted Ebony Velvet Coffer + Burgundy Wax Seal + 5 Bespoke Vials • Dedicated Chauffeur',
                    priceText: subtotal >= 500 ? 'Complimentary' : '$75.00',
                    icon: Crown
                  }
                ].map((tier) => (
                  <label
                    key={tier.id}
                    className={`flex items-start gap-4 p-4 border cursor-pointer transition-all ${
                      formData.shippingTier === tier.id
                        ? 'bg-[#f8f6f0] border-[#1a1816] dark:bg-[#1a1816] dark:border-[#c29b62]'
                        : 'bg-white dark:bg-[#141211] border-[#e8e2d4] dark:border-white/10 hover:border-[#b38b4d]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="shippingTier"
                      value={tier.id}
                      checked={formData.shippingTier === tier.id}
                      onChange={(e) => setFormData({ ...formData, shippingTier: e.target.value })}
                      className="accent-[#b38b4d] mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#1a1816] dark:text-[#f8f6f0] flex items-center gap-1.5">
                          <tier.icon className="w-3.5 h-3.5 text-[#8c6d3b] dark:text-[#c29b62]" />
                          {tier.title}
                        </span>
                        <span className="font-serif font-bold text-xs text-[#8c6d3b] dark:text-[#c29b62]">
                          {tier.priceText}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#7a746e] dark:text-[#a6a096] mt-1">
                        {tier.desc}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Step 4: Payment Method */}
            <div className="bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 p-6 sm:p-8 space-y-5 shadow-sm">
              <h2 className="font-serif text-xl font-normal text-[#1a1816] dark:text-[#f8f6f0] flex items-center gap-3">
                <span className="w-6 h-6 bg-[#1a1816] text-[#f8f6f0] dark:bg-[#f8f6f0] dark:text-[#1a1816] text-[11px] font-serif font-bold flex items-center justify-center">
                  4
                </span>
                Payment Protocol
              </h2>
              <div className="space-y-3">
                {[
                  { id: 'Credit Card / Visa & Mastercard', title: 'Credit / Debit Card (Visa, Mastercard, Amex)', icon: CreditCard },
                  { id: 'Apple Pay / Digital Wallet', title: 'Apple Pay / Google Pay Instant', icon: ShieldCheck },
                  { id: 'Cash on Delivery (COD)', title: 'Cash on Delivery (COD)', icon: DollarSign },
                ].map((m) => (
                  <label
                    key={m.id}
                    className={`flex items-center gap-4 p-4 border cursor-pointer transition-all ${
                      formData.paymentMethod === m.id
                        ? 'bg-[#f8f6f0] border-[#1a1816] dark:bg-[#1a1816] dark:border-[#c29b62]'
                        : 'bg-white dark:bg-[#141211] border-[#e8e2d4] dark:border-white/10 hover:border-[#b38b4d]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={m.id}
                      checked={formData.paymentMethod === m.id}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="accent-[#b38b4d]"
                    />
                    <m.icon className="w-4 h-4 text-[#8c6d3b] dark:text-[#c29b62]" />
                    <span className="text-xs font-semibold text-[#1a1816] dark:text-[#f8f6f0]">{m.title}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-4 bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 p-6 sm:p-7 sticky top-28 space-y-6 shadow-sm">
            <h3 className="font-serif text-xl font-normal text-[#1a1816] dark:text-[#f8f6f0]">
              Flacon Summary
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map(({ product, quantity }) => (
                <div key={product._id || product.id} className="flex items-center justify-between text-xs gap-3">
                  <div className="truncate flex-1">
                    <span className="font-serif font-medium text-[#1a1816] dark:text-white">{product.name}</span>
                    <span className="text-[#7a746e] dark:text-[#a6a096] text-[10px] ml-1.5">&times; {quantity}</span>
                  </div>
                  <span className="font-serif font-semibold text-[#1a1816] dark:text-[#f8f6f0] shrink-0">
                    {formatPrice(product.price * quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-[#f3efe6] dark:bg-[#1a1816] border border-[#e8e2d4] dark:border-white/10 flex items-center gap-2.5 text-[11px] text-[#7a746e] dark:text-[#a6a096]">
              <Gift className="w-4 h-4 text-[#8c6d3b] dark:text-[#c29b62] shrink-0" />
              <span>Includes 2 complimentary 2ml discovery vials.</span>
            </div>

            <div className="space-y-3 text-xs text-[#7a746e] dark:text-[#a6a096] border-t border-b border-[#e8e2d4] dark:border-white/10 py-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-serif font-bold text-sm text-[#1a1816] dark:text-[#f8f6f0]">{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Privilege ({appliedCoupon?.code})</span>
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#1a1816] hover:bg-[#b38b4d] text-[#f8f6f0] dark:bg-[#f8f6f0] dark:hover:bg-[#c29b62] dark:text-[#1a1816] text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Authenticating Order...' : 'Confirm Maison Order'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
