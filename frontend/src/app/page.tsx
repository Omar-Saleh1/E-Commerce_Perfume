'use client';
import React, { useState, useEffect } from 'react';
import { Hero } from '@/components/products/Hero';
import { BentoGrid } from '@/components/products/BentoGrid';
import { FilterControls } from '@/components/products/FilterControls';
import { ProductCard } from '@/components/products/ProductCard';
import { ApiClient } from '@/patterns/api/AbstractApiClientFactory';
import { IProduct, ICategory } from '@/types';
import { PackageSearch, Sparkles } from 'lucide-react';

export default function HomePage() {
  const [allProducts, setAllProducts] = useState<IProduct[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const [cats, featured] = await Promise.all([
        ApiClient.getCategories(),
        ApiClient.getFeaturedProducts()
      ]);
      setCategories(cats);
      setAllProducts(featured);
    }
    init();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const res = await ApiClient.getProducts({
        category: activeCategory !== 'all' ? activeCategory : undefined,
        search: search || undefined,
        sort: sort || undefined,
      });
      setProducts(res.products);
      if (allProducts.length === 0 && res.products.length > 0) {
        setAllProducts(res.products);
      }
      setLoading(false);
    }

    const timer = setTimeout(() => {
      fetchProducts();
    }, 150);

    return () => clearTimeout(timer);
  }, [activeCategory, search, sort]);

  return (
    <div className="pb-28">
      {/* 1. Hero Showcase */}
      <Hero />

      {/* 2. Curated Bento Spotlight */}
      <BentoGrid products={allProducts.length > 0 ? allProducts : products} />

      {/* 3. Catalog Section with Filters */}
      <div id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-400 mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Full Product Catalog</span>
        </div>
        <h2 className="font-heading font-black text-2xl sm:text-3xl text-white mb-6">
          Explore All <span className="gradient-text">Hardware & Gear</span>
        </h2>

        <FilterControls
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          search={search}
          onSearchChange={setSearch}
          sort={sort}
          onSortChange={setSort}
          totalProducts={products.length}
        />

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-96 rounded-3xl bg-slate-900/40 border border-white/5 animate-pulse"></div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="glass-card rounded-3xl p-16 text-center max-w-md mx-auto">
            <PackageSearch className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
            <h3 className="font-heading font-bold text-xl text-white mb-2">No matching products found</h3>
            <p className="text-sm text-slate-400">Try adjusting your search terms or choosing another category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
