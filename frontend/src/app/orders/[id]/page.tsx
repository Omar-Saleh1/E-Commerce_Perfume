'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ApiClient } from '@/patterns/api/AbstractApiClientFactory';
import { formatPrice } from '@/lib/utils';
import {
  Truck,
  CheckCircle2,
  Clock,
  Package,
  ArrowLeft,
  Printer,
  ShieldCheck,
  Mail,
  MapPin,
  Calendar,
  Sparkles,
  Crown
} from 'lucide-react';

export default function ViewOrderPage() {
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await ApiClient.getOrderById(orderId);
        if (res.success && res.order) {
          setOrder(res.order);
        } else {
          setError(res.message || 'Consignment order not found');
        }
      } catch {
        setError('Could not connect to the Maison order servers');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="bg-[#f8f6f0] dark:bg-[#0d0c0b] text-[#1a1816] dark:text-[#f8f6f0] min-h-[80vh] flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-[#b38b4d] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif text-sm tracking-widest text-[#7a746e] dark:text-[#a6a096] uppercase">
            Retrieving Maison Consignment Archive...
          </p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-[#f8f6f0] dark:bg-[#0d0c0b] text-[#1a1816] dark:text-[#f8f6f0] min-h-[80vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6 bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 p-8 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
            <Package className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h1 className="font-serif text-2xl text-[#1a1816] dark:text-white">Consignment Not Found</h1>
            <p className="text-xs text-[#7a746e] dark:text-[#a6a096]">{error || 'Unable to locate this order.'}</p>
          </div>
          <Link href="/shop" className="block">
            <button className="w-full py-3 bg-[#1a1816] text-[#f8f6f0] dark:bg-[#f8f6f0] dark:text-[#1a1816] text-xs uppercase tracking-widest font-semibold">
              Return to Catalog
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const steps = [
    { key: 'processing', label: 'Registered' },
    { key: 'blending', label: 'Atelier Blending' },
    { key: 'shipped', label: 'Dispatched DHL' },
    { key: 'delivered', label: 'Handover Complete' }
  ];

  const currentStepIdx = steps.findIndex((s) => s.key === order.orderStatus);
  const activeIdx = currentStepIdx === -1 ? 0 : currentStepIdx;

  return (
    <div className="bg-[#f8f6f0] dark:bg-[#0d0c0b] text-[#1a1816] dark:text-[#f8f6f0] py-12 transition-colors min-h-screen print:bg-white print:text-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8e2d4] dark:border-white/10 pb-6 print:hidden">
          <div>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-[#7a746e] dark:text-[#a6a096] mb-1">
              <Link href="/" className="hover:text-[#b38b4d] flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" /> Home
              </Link>
              <span>/</span>
              <span className="text-[#8c6d3b] dark:text-[#c29b62] font-semibold">Order #{order._id.slice(-8).toUpperCase()}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1a1816] dark:text-white font-normal">
              Consignment Invoice &amp; Details
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 text-xs text-[#1a1816] dark:text-[#f8f6f0] hover:border-[#b38b4d] flex items-center gap-2 transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
            <Link href={`/orders/${order._id}/track`}>
              <button className="px-5 py-2.5 bg-[#1a1816] text-[#f8f6f0] dark:bg-[#f8f6f0] dark:text-[#1a1816] text-xs uppercase tracking-wider font-semibold hover:bg-[#b38b4d] dark:hover:bg-[#c29b62] flex items-center gap-2 transition-colors shadow-sm">
                <Truck className="w-3.5 h-3.5" />
                <span>Live Consignment Tracking</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Consignment Status Banner */}
        <div className="bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8e2d4] dark:border-white/10 pb-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8c6d3b] dark:text-[#c29b62] block">
                Fulfillment Status
              </span>
              <div className="font-serif text-2xl font-normal text-[#1a1816] dark:text-white capitalize mt-1">
                {order.orderStatus}
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#7a746e] dark:text-[#a6a096] block">Tracking Number</span>
                <span className="font-mono font-bold text-[#8c6d3b] dark:text-[#c29b62]">{order.trackingNumber}</span>
              </div>
              <div className="border-l border-[#e8e2d4] dark:border-white/10 pl-4">
                <span className="text-[10px] uppercase tracking-wider text-[#7a746e] dark:text-[#a6a096] block">Carrier</span>
                <span className="font-semibold text-[#1a1816] dark:text-white">{order.carrier}</span>
              </div>
            </div>
          </div>

          {/* Stepper */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            {steps.map((step, idx) => {
              const isPastOrCurrent = idx <= activeIdx;
              return (
                <div key={step.key} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isPastOrCurrent
                        ? 'bg-[#1a1816] text-[#f8f6f0] dark:bg-[#f8f6f0] dark:text-[#1a1816]'
                        : 'bg-[#f3efe6] dark:bg-[#1a1816] text-[#7a746e] border border-[#e8e2d4] dark:border-white/10'
                    }`}>
                      {isPastOrCurrent ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    <span className={`text-xs font-semibold ${isPastOrCurrent ? 'text-[#1a1816] dark:text-white' : 'text-[#7a746e] dark:text-[#a6a096]'}`}>
                      {step.label}
                    </span>
                  </div>
                  <div className={`h-1 w-full rounded-full ${isPastOrCurrent ? 'bg-[#b38b4d]' : 'bg-[#e8e2d4] dark:bg-white/10'}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* 2-Column Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Destination Details */}
          <div className="bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 p-6 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-[#8c6d3b] dark:text-[#c29b62] text-[11px] uppercase tracking-wider font-semibold">
              <MapPin className="w-4 h-4" />
              <span>Consignee Destination</span>
            </div>
            <div className="text-xs space-y-1 text-[#7a746e] dark:text-[#a6a096]">
              <div className="font-semibold text-sm text-[#1a1816] dark:text-white">{order.customerName}</div>
              <div>{order.customerEmail}</div>
              <div>{order.customerPhone}</div>
              <div className="pt-2 text-[#1a1816] dark:text-white font-medium">
                {order.shippingAddress?.street}, {order.shippingAddress?.city}
              </div>
              <div>{order.shippingAddress?.postalCode} {order.shippingAddress?.country || 'Global'}</div>
            </div>
          </div>

          {/* Logistics & Packaging Tier */}
          <div className="bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 p-6 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-[#8c6d3b] dark:text-[#c29b62] text-[11px] uppercase tracking-wider font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Packaging &amp; Tier</span>
            </div>
            <div className="text-xs space-y-2 text-[#7a746e] dark:text-[#a6a096]">
              <div>
                <span className="text-[10px] uppercase block">Fulfillment Tier</span>
                <span className="font-semibold text-[#1a1816] dark:text-white">{order.fulfillmentTier || 'Standard Maison Ground'}</span>
              </div>
              {order.packaging?.boxType && (
                <div>
                  <span className="text-[10px] uppercase block">Box Specification</span>
                  <span className="text-[#8c6d3b] dark:text-[#c29b62]">{order.packaging.boxType}</span>
                </div>
              )}
              <div>
                <span className="text-[10px] uppercase block">Estimated Delivery</span>
                <span className="font-medium text-[#1a1816] dark:text-white">
                  {new Date(order.estimatedDelivery).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          {/* Settlement Protocol */}
          <div className="bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 p-6 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-[#8c6d3b] dark:text-[#c29b62] text-[11px] uppercase tracking-wider font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Settlement Protocol</span>
            </div>
            <div className="text-xs space-y-2 text-[#7a746e] dark:text-[#a6a096]">
              <div>
                <span className="text-[10px] uppercase block">Payment Method</span>
                <span className="font-semibold text-[#1a1816] dark:text-white">{order.paymentMethod}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase block">Payment Status</span>
                <span className="inline-block px-2 py-0.5 text-[10px] uppercase font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  {order.paymentStatus}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase block">Maison Concierge Sender</span>
                <span className="font-mono text-[11px] text-[#8c6d3b]">os6100050@gmail.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Itemized Flacon Table */}
        <div className="bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="font-serif text-xl font-normal text-[#1a1816] dark:text-white border-b border-[#e8e2d4] dark:border-white/10 pb-4">
            Commissioned Flacons ({order.items?.length || 0})
          </h3>

          <div className="divide-y divide-[#e8e2d4]/60 dark:divide-white/5">
            {order.items?.map((item: any, idx: number) => (
              <div key={idx} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1594035910387-fea47794261f'}
                    alt={item.name}
                    className="w-16 h-16 object-cover border border-[#e8e2d4] dark:border-white/10 bg-[#f8f6f0]"
                  />
                  <div>
                    <h4 className="font-serif text-base font-normal text-[#1a1816] dark:text-white">{item.name}</h4>
                    <span className="text-[10px] text-[#8c6d3b] uppercase tracking-wider">Artisanal Extrait • 50ml</span>
                    <div className="text-xs text-[#7a746e] dark:text-[#a6a096] mt-0.5">
                      Qty: {item.quantity} &times; {formatPrice(item.price)}
                    </div>
                  </div>
                </div>

                <div className="font-serif text-lg font-bold text-[#1a1816] dark:text-white">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          {/* Totals Summary */}
          <div className="border-t border-[#1a1816] dark:border-white/20 pt-6 max-w-sm ml-auto space-y-2 text-xs">
            <div className="flex justify-between text-[#7a746e] dark:text-[#a6a096]">
              <span>Subtotal:</span>
              <span className="text-[#1a1816] dark:text-white">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-[#7a746e] dark:text-[#a6a096]">
              <span>Shipping Fee:</span>
              <span className="text-[#1a1816] dark:text-white">
                {order.shippingFee === 0 ? 'Complimentary' : formatPrice(order.shippingFee)}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-[#8c6d3b] dark:text-[#c29b62]">
                <span>Privilege Discount:</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between items-baseline pt-3 border-t border-[#e8e2d4] dark:border-white/10 font-serif text-xl font-bold text-[#1a1816] dark:text-white">
              <span>Grand Total Settled:</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Footer Support Banner */}
        <div className="p-6 bg-[#f8f6f0] dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 text-center space-y-2 text-xs text-[#7a746e] dark:text-[#a6a096]">
          <p>
            Have questions regarding your formulation or consignment dispatch? Contact our private concierge at{' '}
            <a href="mailto:os6100050@gmail.com" className="text-[#8c6d3b] dark:text-[#c29b62] underline font-semibold">
              os6100050@gmail.com
            </a>
          </p>
          <p className="text-[10px]">Maison Odoratus &bull; Grasse Atelier, France &bull; All Rights Reserved 2026</p>
        </div>

      </div>
    </div>
  );
}
