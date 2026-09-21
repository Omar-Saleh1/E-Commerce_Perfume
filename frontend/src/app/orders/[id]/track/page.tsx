'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ApiClient } from '@/patterns/api/AbstractApiClientFactory';
import { formatPrice } from '@/lib/utils';
import { Truck, ArrowLeft, CheckCircle2, Clock, PackageCheck, Sparkles } from 'lucide-react';

export default function DirectOrderTrackPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [trackingData, setTrackingData] = useState<any | null>(null);

  useEffect(() => {
    async function load() {
      if (id) {
        setLoading(true);
        const res = await ApiClient.trackOrder(String(id));
        if (res.success && res.tracking) {
          setTrackingData(res.tracking);
        }
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-32 text-center">
        <div className="w-8 h-8 border-2 border-[#b38b4d] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-xs font-serif uppercase tracking-widest text-[#8c6d3b]">
          Contacting Global Dispatch Network...
        </p>
      </div>
    );
  }

  if (!trackingData) {
    return (
      <div className="max-w-md mx-auto px-4 py-28 text-center space-y-4">
        <h2 className="font-serif text-2xl text-[#1a1816] dark:text-white">Consignment Not Found</h2>
        <p className="text-xs text-[#7a746e]">No active shipment found with reference #{String(id)}.</p>
        <Link href="/track">
          <button className="px-6 py-2.5 bg-[#1a1816] text-white text-xs uppercase tracking-wider font-semibold">
            Track Another Reference
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f6f0] dark:bg-[#0d0c0b] text-[#1a1816] dark:text-[#f8f6f0] py-12 min-h-screen transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-[#7a746e] dark:text-[#a6a096]">
          <Link href="/" className="hover:text-[#b38b4d] flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Maison Home
          </Link>
          <span>/</span>
          <span className="text-[#8c6d3b] dark:text-[#c29b62] font-semibold">Order Tracking</span>
        </div>

        {/* Live Consignment Result */}
        <div className="bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 p-6 sm:p-10 shadow-lg space-y-8 animate-in fade-in zoom-in-95 duration-400">
          
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8e2d4] dark:border-white/10 pb-6">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#8c6d3b] dark:text-[#c29b62] block">
                Carrier: {trackingData.carrier} &middot; Dispatch Grasse
              </span>
              <h1 className="font-mono text-xl sm:text-2xl font-bold text-[#1a1816] dark:text-white">
                {trackingData.trackingNumber}
              </h1>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] uppercase tracking-wider text-[#7a746e] dark:text-[#a6a096] block">
                Estimated Delivery
              </span>
              <span className="font-serif text-lg font-semibold text-emerald-700 dark:text-emerald-400">
                {new Date(trackingData.estimatedDelivery).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Visual Stepper */}
          <div className="py-6">
            <div className="grid grid-cols-4 gap-2 relative">
              {[
                { key: 'pending', title: 'Registered', icon: CheckCircle2 },
                { key: 'blending', title: 'Atelier Blending', icon: Clock },
                { key: 'shipped', title: 'In Transit Air', icon: Truck },
                { key: 'delivered', title: 'Delivered', icon: PackageCheck },
              ].map((stepItem, idx) => {
                const statuses = ['pending', 'processing', 'blending', 'shipped', 'delivered'];
                const currentIndex = statuses.indexOf(trackingData.status);
                const stepIndex = statuses.indexOf(stepItem.key);
                const isDone = currentIndex >= stepIndex;

                return (
                  <div key={stepItem.key} className="flex flex-col items-center text-center space-y-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                      isDone
                        ? 'bg-[#1a1816] text-[#f8f6f0] dark:bg-[#f8f6f0] dark:text-[#1a1816] border-transparent shadow-md'
                        : 'bg-[#f8f6f0] dark:bg-[#1a1816] text-[#a6a096] border-[#e8e2d4] dark:border-white/10'
                    }`}>
                      <stepItem.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1a1816] dark:text-white">
                      {stepItem.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Consignment Items Summary */}
          <div className="border-t border-[#e8e2d4] dark:border-white/10 pt-6 space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-[#8c6d3b] dark:text-[#c29b62]">
              Flacons in Consignment ({trackingData.items?.length || 1})
            </h4>
            <div className="divide-y divide-[#e8e2d4]/50 dark:divide-white/5">
              {trackingData.items?.map((it: any, idx: number) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={it.image} alt={it.name} className="w-10 h-10 object-cover border border-[#e8e2d4] dark:border-white/10" />
                    <div>
                      <span className="font-serif font-medium text-[#1a1816] dark:text-white">{it.name}</span>
                      <span className="text-[10px] text-[#7a746e] block">&times; {it.quantity}</span>
                    </div>
                  </div>
                  <span className="font-serif font-bold text-sm text-[#1a1816] dark:text-white">
                    {formatPrice(it.price * it.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
