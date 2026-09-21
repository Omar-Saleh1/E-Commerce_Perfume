import React from 'react';
import Link from 'next/link';
import { Sparkles, Shield, Gift, Truck, Clock } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-[#e8e2d4] dark:border-white/10 bg-[#f3efe6] dark:bg-[#0d0c0b] text-[#7a746e] dark:text-[#a6a096] transition-colors duration-300">
      {/* 4 Atelier Promises */}
      <div className="border-b border-[#e8e2d4] dark:border-white/10 bg-white/70 dark:bg-[#141211]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 border border-[#b38b4d]/40 dark:border-[#c29b62]/40 flex items-center justify-center text-[#8c6d3b] dark:text-[#c29b62] shrink-0 bg-[#f8f6f0] dark:bg-[#1a1816]">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-[#1a1816] dark:text-[#f8f6f0]">Bespoke Express Delivery</h4>
              <p className="text-[11px] text-[#7a746e] dark:text-[#a6a096] mt-0.5">Complimentary shipping on orders over $180</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 border border-[#b38b4d]/40 dark:border-[#c29b62]/40 flex items-center justify-center text-[#8c6d3b] dark:text-[#c29b62] shrink-0 bg-[#f8f6f0] dark:bg-[#1a1816]">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-[#1a1816] dark:text-[#f8f6f0]">Complimentary Discovery Vials</h4>
              <p className="text-[11px] text-[#7a746e] dark:text-[#a6a096] mt-0.5">Two 2ml samples with every full flacon</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 border border-[#b38b4d]/40 dark:border-[#c29b62]/40 flex items-center justify-center text-[#8c6d3b] dark:text-[#c29b62] shrink-0 bg-[#f8f6f0] dark:bg-[#1a1816]">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-[#1a1816] dark:text-[#f8f6f0]">Authenticity Guaranteed</h4>
              <p className="text-[11px] text-[#7a746e] dark:text-[#a6a096] mt-0.5">Artisanal distillation in Grasse, France</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 border border-[#b38b4d]/40 dark:border-[#c29b62]/40 flex items-center justify-center text-[#8c6d3b] dark:text-[#c29b62] shrink-0 bg-[#f8f6f0] dark:bg-[#1a1816]">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-[#1a1816] dark:text-[#f8f6f0]">Concierge Fragrance Advice</h4>
              <p className="text-[11px] text-[#7a746e] dark:text-[#a6a096] mt-0.5">Consultations available Mon-Sat 9am-8pm</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Manifesto */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-4 space-y-4">
          <Link href="/" className="inline-block">
            <span className="font-serif tracking-[0.3em] text-2xl font-bold text-[#1a1816] dark:text-[#f8f6f0] uppercase">
              ODORATUS
            </span>
          </Link>
          <p className="font-serif italic text-sm text-[#8c6d3b] dark:text-[#c29b62]">
            Haute Parfumerie &amp; Artisanal Flacons
          </p>
          <p className="text-xs text-[#7a746e] dark:text-[#a6a096] leading-relaxed max-w-sm">
            Crafted for discerning connoisseurs who view scent as an intimate invisible architecture. Every flacon is hand-blended and numbered in limited harvests.
          </p>
        </div>

        <div className="md:col-span-2 space-y-3">
          <h5 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#1a1816] dark:text-[#f8f6f0]">The Wardrobe</h5>
          <ul className="space-y-2 text-xs">
            <li><Link href="/shop" className="hover:text-[#b38b4d] dark:hover:text-[#c29b62] transition-colors">Shop All Fragrances</Link></li>
            <li><Link href="/occasions" className="hover:text-[#b38b4d] dark:hover:text-[#c29b62] transition-colors">Occasions Curation</Link></li>
            <li><Link href="/quiz" className="hover:text-[#b38b4d] dark:hover:text-[#c29b62] transition-colors flex items-center gap-1"><Sparkles className="w-3 h-3 text-[#b38b4d]" /> AI Scent Consultation</Link></li>
            <li><Link href="/shop" className="hover:text-[#b38b4d] dark:hover:text-[#c29b62] transition-colors">Discovery Wardrobe</Link></li>
          </ul>
        </div>

        <div className="md:col-span-3 space-y-3">
          <h5 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#1a1816] dark:text-[#f8f6f0]">Client Services</h5>
          <ul className="space-y-2 text-xs">
            <li><Link href="/track" className="hover:text-[#b38b4d] dark:hover:text-[#c29b62] transition-colors flex items-center gap-1.5"><Truck className="w-3 h-3" /> Track Consignment</Link></li>
            <li><Link href="/account" className="hover:text-[#b38b4d] dark:hover:text-[#c29b62] transition-colors">VIP Loyalty &amp; Rewards</Link></li>
            <li><Link href="/about" className="hover:text-[#b38b4d] dark:hover:text-[#c29b62] transition-colors">Grasse Atelier Heritage</Link></li>
            <li><Link href="/admin" className="hover:text-[#b38b4d] dark:hover:text-[#c29b62] transition-colors text-[#8c6d3b]">Executive Admin Panel</Link></li>
          </ul>
        </div>

        <div className="md:col-span-3 space-y-3">
          <h5 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#1a1816] dark:text-[#f8f6f0]">Flagship Boutiques</h5>
          <p className="text-xs leading-relaxed text-[#7a746e] dark:text-[#a6a096]">
            Place Vendôme, Paris &middot; 5th Avenue, New York &middot; Mayfair, London
          </p>
          <div className="pt-2">
            <span className="text-[10px] uppercase tracking-wider text-[#8c6d3b] dark:text-[#c29b62] block font-semibold">Concierge Line</span>
            <span className="text-xs font-serif text-[#1a1816] dark:text-[#f8f6f0]">+33 (0)1 42 68 00 00</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#e8e2d4] dark:border-white/10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#b38b4d] dark:text-[#c29b62]" />
          <span>&copy; {new Date().getFullYear()} ODORATUS MAISON DE PARFUM. All Rights Reserved.</span>
        </div>
        <div className="flex items-center gap-6 text-[11px] uppercase tracking-wider">
          <Link href="/privacy" className="hover:text-[#1a1816] dark:hover:text-white transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-[#1a1816] dark:hover:text-white transition-colors">Terms of Sale</Link>
          <Link href="/track" className="hover:text-[#1a1816] dark:hover:text-white transition-colors">Live Dispatch</Link>
        </div>
      </div>
    </footer>
  );
};
