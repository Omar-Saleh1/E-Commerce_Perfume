'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Hero } from '@/components/products/Hero';
import { OlfactorySignatures } from '@/components/products/OlfactorySignatures';
import { ScentArchetypes } from '@/components/products/ScentArchetypes';
import { OccasionalCuration } from '@/components/products/OccasionalCuration';
import { SolsticeBanner } from '@/components/products/SolsticeBanner';
import { AtelierChronicles } from '@/components/products/AtelierChronicles';
import { ApiClient } from '@/patterns/api/AbstractApiClientFactory';
import { IProduct } from '@/types';
import { Sparkles, ArrowRight, Compass } from 'lucide-react';

const FALLBACK_FEATURED: IProduct[] = [
  {
    _id: 'prod-santal',
    name: 'Santal Parchment',
    subtitle: 'Australian Sandalwood • Tuscan Leather • French Orris',
    slug: 'santal-parchment',
    description: 'An evocative olfactory homage to ancient manuscript ateliers. Opening with dry cardamom and sparkling Italian bergamot, descending into a velvety heart of Florentine orris and warm leather.',
    price: 280,
    oldPrice: 320,
    category: 'Woody & Earthy',
    archetype: 'Woody',
    concentration: 'Extrait de Parfum (30% Conc.)',
    volume: '50ml / 1.7 fl.oz',
    brand: 'Odoratus',
    stock: 18,
    rating: 4.9,
    reviewsCount: 54,
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=80'],
    isFeatured: true,
  },
  {
    _id: 'prod-velvet',
    name: 'Velvet Noir Fumé',
    subtitle: 'Black Incense • Bourbon Vanilla • Guaiac Wood',
    slug: 'velvet-noir-fume',
    description: 'A dark and hypnotic nocturne distilled for twilight gatherings. Smoky Somalian frankincense swirls with black tea leaves and velvety Madagascar bourbon vanilla.',
    price: 310,
    oldPrice: 350,
    category: 'Oud & Smoked Oriental',
    archetype: 'Amber',
    concentration: 'Extrait de Parfum (32% Conc.)',
    volume: '50ml / 1.7 fl.oz',
    brand: 'Odoratus',
    stock: 12,
    rating: 5.0,
    reviewsCount: 68,
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80'],
    isFeatured: true,
  },
  {
    _id: 'prod-fleur',
    name: 'Fleur Blanche Solstice',
    subtitle: 'Solar Tuberose • Jasmine Sambac • Golden Neroli',
    slug: 'fleur-blanche-solstice',
    description: 'The euphoria of solstice daylight captured in nectar. Night-blooming Indian tuberose interlaces with sun-kissed Grasse jasmine and luminous solar aldehydes.',
    price: 260,
    oldPrice: 290,
    category: 'Floral & Botanical',
    archetype: 'Floral',
    concentration: 'Extrait de Parfum (28% Conc.)',
    volume: '50ml / 1.7 fl.oz',
    brand: 'Odoratus',
    stock: 22,
    rating: 4.8,
    reviewsCount: 46,
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=80'],
    isFeatured: true,
  },
  {
    _id: 'prod-citrus',
    name: 'Citrus Sauvage Vert',
    subtitle: 'Calabrian Bergamot • Wild Basil • Haitian Vetiver',
    slug: 'citrus-sauvage-vert',
    description: 'A burst of wild Mediterranean morning mist. Crushed green basil leaves, sun-drenched bergamot rinds, and crisp sea salt minerals rest atop vetiver root.',
    price: 240,
    oldPrice: 275,
    category: 'Citrus & Solar',
    archetype: 'Fresh',
    concentration: 'Eau de Parfum Intense (22% Conc.)',
    volume: '100ml / 3.4 fl.oz',
    brand: 'Odoratus',
    stock: 30,
    rating: 4.9,
    reviewsCount: 33,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80'],
    isFeatured: true,
  }
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<IProduct[]>(FALLBACK_FEATURED);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await ApiClient.getFeaturedProducts();
        if (res && res.length > 0) {
          setFeaturedProducts(res);
        }
      } catch (e) {
        console.warn('Using fallback featured flacons');
      }
    }
    loadFeatured();
  }, []);

  return (
    <div className="pb-16 bg-[#f8f6f0] dark:bg-[#0d0c0b] text-[#1a1816] dark:text-[#f8f6f0] transition-colors duration-300">
      {/* 1. Hero: Narrative In A Glass */}
      <Hero />

      {/* 2. Olfactory Signatures: 4 Flacons Showcase */}
      <div id="signatures">
        <OlfactorySignatures products={featuredProducts} />
      </div>

      {/* 3. Scent Archetypes: Woody, Floral, Amber, Citrus */}
      <div id="archetypes">
        <ScentArchetypes />
      </div>

      {/* 4. Solstice Banner: Le Jardin d'Or Solstice Collection */}
      <div id="solstice">
        <SolsticeBanner />
      </div>

      {/* 5. Occasional Scent Curation */}
      <OccasionalCuration />

      {/* 6. Discover Full Wardrobe Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-[#e8e2d4] dark:border-white/10">
        <div className="bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 p-8 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#8c6d3b] dark:text-[#c29b62] font-semibold flex items-center justify-center md:justify-start gap-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Full Fragrance Archive</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1a1816] dark:text-[#f8f6f0] font-normal">
              Explore The Complete Olfactory Wardrobe
            </h2>
            <p className="text-xs sm:text-sm text-[#7a746e] dark:text-[#a6a096] max-w-lg font-sans">
              Discover all 12+ extraits, filter by rare botanical notes, and select your custom volume in our dedicated boutique catalog.
            </p>
          </div>

          <Link href="/shop">
            <button className="px-8 py-4 bg-[#1a1816] hover:bg-[#b38b4d] text-[#f8f6f0] dark:bg-[#f8f6f0] dark:hover:bg-[#c29b62] dark:text-[#1a1816] text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 flex items-center gap-2.5 shadow-sm whitespace-nowrap">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Enter The Shop</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </section>

      {/* 7. Atelier Chronicles: VIP Newsletter */}
      <AtelierChronicles />
    </div>
  );
}
