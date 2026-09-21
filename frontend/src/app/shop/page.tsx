'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { CatalogSidebar } from '@/components/products/CatalogSidebar';
import { ProductCard } from '@/components/products/ProductCard';
import { ApiClient } from '@/patterns/api/AbstractApiClientFactory';
import { IProduct, ICategory } from '@/types';
import { Sparkles, PackageSearch, Search, SlidersHorizontal, ArrowLeft } from 'lucide-react';

const FALLBACK_PRODUCTS: IProduct[] = [
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
  },
  {
    _id: 'prod-solstice',
    name: "Le Jardin d'Or Solstice",
    subtitle: 'Bitter Orange • Solar Neroli • Honeyed Amber',
    slug: 'le-jardin-dor-solstice',
    description: 'The crowning creation of the Solstice Collection. Golden rays over a Mediterranean terrace lined with orange trees, wild ginger blooms, and golden beeswax amber.',
    price: 340,
    oldPrice: 390,
    category: 'Citrus & Solar',
    archetype: 'Fresh',
    concentration: 'Extrait de Parfum (30% Conc.)',
    volume: '100ml / 3.4 fl.oz',
    brand: 'Odoratus',
    stock: 14,
    rating: 5.0,
    reviewsCount: 52,
    image: 'https://images.unsplash.com/photo-1583445013765-46c20c4a6772?w=800&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1583445013765-46c20c4a6772?w=800&auto=format&fit=crop&q=80'],
    isFeatured: true,
  },
  {
    _id: 'prod-rose',
    name: 'Rose Impériale de Mai',
    subtitle: 'Centifolia Rose • Pink Peppercorn • White Amber',
    slug: 'rose-imperiale-de-mai',
    description: 'An architectural rendering of the mythical May Rose harvested at dawn in Grasse. Dew-covered petals enveloped in spicy pink pepper and translucent white musk.',
    price: 295,
    oldPrice: 330,
    category: 'Floral & Botanical',
    archetype: 'Floral',
    concentration: 'Extrait de Parfum (29% Conc.)',
    volume: '50ml / 1.7 fl.oz',
    brand: 'Odoratus',
    stock: 16,
    rating: 4.9,
    reviewsCount: 41,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80'],
    isFeatured: false,
  },
  {
    _id: 'prod-ambre',
    name: 'Ambre Nocturne Royal',
    subtitle: 'Golden Amber • Cardamom Absolute • Cedarwood',
    slug: 'ambre-nocturne-royal',
    description: 'A radiant amber accord enriched with toasted cardamom, dry labdanum, and royal Virginia cedarwood. Warm, enveloping, and endlessly refined.',
    price: 275,
    oldPrice: 310,
    category: 'Amber & Resins',
    archetype: 'Amber',
    concentration: 'Extrait de Parfum (28% Conc.)',
    volume: '50ml / 1.7 fl.oz',
    brand: 'Odoratus',
    stock: 20,
    rating: 4.8,
    reviewsCount: 29,
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&auto=format&fit=crop&q=80'],
    isFeatured: false,
  },
  {
    _id: 'prod-oud',
    name: 'Oud Céleste Impérial',
    subtitle: 'Cambodian Oud • Saffron Stigmas • Smoked Leather',
    slug: 'oud-celeste-imperial',
    description: 'A sacred high-altitude extraction of sustainably harvested Cambodian agarwood, illuminated by vibrant crimson saffron threads and vintage leather.',
    price: 360,
    oldPrice: 420,
    category: 'Oud & Smoked Oriental',
    archetype: 'Amber',
    concentration: 'Extrait de Parfum (35% Conc.)',
    volume: '50ml / 1.7 fl.oz',
    brand: 'Odoratus',
    stock: 9,
    rating: 5.0,
    reviewsCount: 75,
    image: 'https://images.unsplash.com/photo-1563178406-4cdc2923acbc?w=800&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1563178406-4cdc2923acbc?w=800&auto=format&fit=crop&q=80'],
    isFeatured: true,
  }
];

export default function ShopPage() {
  const [products, setProducts] = useState<IProduct[]>(FALLBACK_PRODUCTS);
  const [categories, setCategories] = useState<ICategory[]>([]);
  
  // Filters state
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [selectedConcentration, setSelectedConcentration] = useState('all');
  const [maxPrice, setMaxPrice] = useState(500);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const cats = await ApiClient.getCategories();
        if (cats && cats.length > 0) setCategories(cats);
      } catch (err) {
        console.warn('Using default categories');
      }
    }
    init();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await ApiClient.getProducts({
          category: activeCategory !== 'all' ? activeCategory : undefined,
          search: search || undefined,
          sort: sort || undefined,
        });
        if (res.products && res.products.length > 0) {
          setProducts(res.products);
        }
      } catch {
        let local = [...FALLBACK_PRODUCTS];
        if (activeCategory !== 'all') {
          local = local.filter(p => p.category.toLowerCase().includes(activeCategory.toLowerCase()));
        }
        if (search) {
          const s = search.toLowerCase();
          local = local.filter(p => 
            p.name.toLowerCase().includes(s) || 
            p.description.toLowerCase().includes(s) ||
            p.subtitle?.toLowerCase().includes(s)
          );
        }
        setProducts(local);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchProducts();
    }, 100);

    return () => clearTimeout(timer);
  }, [activeCategory, search, sort]);

  const filteredProducts = useMemo(() => {
    const list = products.length > 0 ? products : FALLBACK_PRODUCTS;
    return list.filter((p) => {
      if (p.price > maxPrice) return false;

      if (selectedConcentration !== 'all') {
        const concLower = (p.concentration || '').toLowerCase();
        if (!concLower.includes(selectedConcentration.toLowerCase())) return false;
      }

      if (selectedNotes.length > 0) {
        const topStr = typeof p.notes?.top === 'string' ? p.notes.top : Array.isArray(p.notes?.top) ? p.notes.top.join(' ') : '';
        const heartStr = typeof p.notes?.heart === 'string' ? p.notes.heart : Array.isArray(p.notes?.heart) ? p.notes.heart.join(' ') : '';
        const baseStr = typeof p.notes?.base === 'string' ? p.notes.base : Array.isArray(p.notes?.base) ? p.notes.base.join(' ') : '';

        const allText = [
          topStr,
          heartStr,
          baseStr,
          p.description,
          p.subtitle || '',
          p.name || ''
        ].join(' ').toLowerCase();

        const matchesAny = selectedNotes.some(n => allText.includes(n.toLowerCase()));
        if (!matchesAny) return false;
      }

      return true;
    });
  }, [products, maxPrice, selectedConcentration, selectedNotes]);

  const handleToggleNote = (note: string) => {
    setSelectedNotes((prev) =>
      prev.includes(note) ? prev.filter((n) => n !== note) : [...prev, note]
    );
  };

  const handleResetFilters = () => {
    setActiveCategory('all');
    setSearch('');
    setSort('');
    setSelectedNotes([]);
    setSelectedConcentration('all');
    setMaxPrice(500);
  };

  return (
    <div className="bg-[#f8f6f0] dark:bg-[#0d0c0b] text-[#1a1816] dark:text-[#f8f6f0] py-10 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-[#7a746e] dark:text-[#a6a096] mb-6">
          <Link href="/" className="hover:text-[#b38b4d] flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Maison Home
          </Link>
          <span>/</span>
          <span className="text-[#8c6d3b] dark:text-[#c29b62] font-semibold">Fragrance Shop</span>
        </div>

        {/* Shop Page Banner */}
        <div className="flex flex-col items-center text-center mb-12 border-b border-[#e8e2d4] dark:border-white/10 pb-8">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#8c6d3b] dark:text-[#c29b62] font-semibold mb-2 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Artisanal Perfumery Archives</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#1a1816] dark:text-[#f8f6f0]">
            The Complete <span className="italic font-serif text-[#8c6d3b] dark:text-[#c29b62]">Fragrance Wardrobe</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#7a746e] dark:text-[#a6a096] max-w-xl mt-3 font-sans leading-relaxed">
            Distilled in limited seasonal batches. Filter by olfactory family, pure botanical notes, and extraction concentrations.
          </p>
        </div>

        {/* Main Shop Grid with Left Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Sidebar Filter */}
          <CatalogSidebar
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            selectedNotes={selectedNotes}
            onToggleNote={handleToggleNote}
            selectedConcentration={selectedConcentration}
            onSelectConcentration={setSelectedConcentration}
            maxPrice={maxPrice}
            onPriceChange={setMaxPrice}
            onReset={handleResetFilters}
          />

          {/* Right Product Grid Area */}
          <div className="flex-1 w-full space-y-6">
            
            {/* Top Search & Sort Toolbar */}
            <div className="bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-sm">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-[#8c6d3b] dark:text-[#c29b62] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search notes (e.g. Cardamom, Amber, Vanilla, Sandalwood)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#f8f6f0] dark:bg-[#1a1816] border border-[#e8e2d4] dark:border-white/10 pl-9 pr-3 py-2 text-xs text-[#1a1816] dark:text-[#f8f6f0] placeholder-[#a6a096] focus:outline-none focus:border-[#b38b4d]"
                />
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3">
                <span className="text-[11px] uppercase tracking-wider text-[#7a746e] dark:text-[#a6a096]">
                  <strong className="font-serif text-[#1a1816] dark:text-white">{filteredProducts.length}</strong> Flacons
                </span>

                <div className="flex items-center gap-1.5 bg-[#f8f6f0] dark:bg-[#1a1816] border border-[#e8e2d4] dark:border-white/10 px-3 py-1.5 text-xs">
                  <SlidersHorizontal className="w-3 h-3 text-[#8c6d3b] dark:text-[#c29b62]" />
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="bg-transparent text-xs text-[#1a1816] dark:text-[#f8f6f0] focus:outline-none cursor-pointer pr-1"
                  >
                    <option value="" className="bg-white dark:bg-[#141211] text-[#1a1816] dark:text-white">Curated Signatures</option>
                    <option value="price-asc" className="bg-white dark:bg-[#141211] text-[#1a1816] dark:text-white">Price: Low to High</option>
                    <option value="price-desc" className="bg-white dark:bg-[#141211] text-[#1a1816] dark:text-white">Price: High to Low</option>
                    <option value="rating-desc" className="bg-white dark:bg-[#141211] text-[#1a1816] dark:text-white">Highest Rated</option>
                    <option value="name-asc" className="bg-white dark:bg-[#141211] text-[#1a1816] dark:text-white">Flacon A-Z</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-96 bg-white/50 dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 animate-pulse"></div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 p-16 text-center max-w-md mx-auto">
                <PackageSearch className="w-12 h-12 text-[#8c6d3b] dark:text-[#c29b62] mx-auto mb-4" />
                <h3 className="font-serif font-bold text-xl text-[#1a1816] dark:text-white mb-2">No Matching Fragrances</h3>
                <p className="text-xs text-[#7a746e] dark:text-[#a6a096] mb-4">
                  Try adjusting the sidebar filters or clear your note selection.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2 bg-[#1a1816] text-[#f8f6f0] dark:bg-[#f8f6f0] dark:text-[#1a1816] text-xs uppercase tracking-wider font-semibold"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id || product.id} product={product} />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
