'use client';
import React from 'react';
import { Search, SlidersHorizontal, X, Sparkles, Headphones, Laptop, Shirt, Home, LayoutGrid } from 'lucide-react';
import { ICategory } from '@/types';

interface FilterControlsProps {
  categories: ICategory[];
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  search: string;
  onSearchChange: (search: string) => void;
  sort: string;
  onSortChange: (sort: string) => void;
  totalProducts: number;
}

const getCategoryIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('audio') || n.includes('headphone')) return Headphones;
  if (n.includes('electron') || n.includes('tech')) return Laptop;
  if (n.includes('fashion') || n.includes('wear') || n.includes('lifestyle')) return Shirt;
  if (n.includes('home') || n.includes('living')) return Home;
  return LayoutGrid;
};

export const FilterControls: React.FC<FilterControlsProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  search,
  onSearchChange,
  sort,
  onSortChange,
  totalProducts,
}) => {
  return (
    <div className="glass-card rounded-3xl p-6 mb-12 shadow-sm flex flex-col gap-6">
      {/* Top Search & Filter Strip */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-lg">
          <Search className="w-4 h-4 text-stone-400 dark:text-indigo-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search audio gear, titanium chrono, displays..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-stone-100/80 dark:bg-slate-950/90 border border-stone-200 dark:border-white/10 rounded-full pl-11 pr-10 py-3 text-xs sm:text-sm text-stone-900 dark:text-slate-100 placeholder-stone-400 dark:placeholder-slate-400 focus:outline-none focus:border-stone-800 dark:focus:border-indigo-500 focus:ring-1 focus:ring-stone-800 dark:focus:ring-indigo-500 transition-all shadow-inner"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-900 dark:text-slate-400 dark:hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Counter and Sort Selection */}
        <div className="flex items-center justify-between md:justify-end gap-4">
          <div className="text-xs font-bold text-stone-600 dark:text-slate-400 bg-stone-100 dark:bg-white/5 px-3.5 py-2 rounded-full border border-stone-200 dark:border-white/10 shadow-sm">
            <span className="text-amber-800 dark:text-indigo-400 font-extrabold">{totalProducts}</span> Items Available
          </div>

          <div className="flex items-center gap-2 bg-stone-100/90 dark:bg-slate-950/90 border border-stone-200 dark:border-white/10 rounded-full px-3.5 py-1.5 shadow-sm">
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500 dark:text-indigo-400" />
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-transparent text-xs font-bold text-stone-800 dark:text-slate-200 focus:outline-none cursor-pointer pr-2"
            >
              <option value="" className="bg-white dark:bg-slate-900 text-stone-900 dark:text-white">Default Sorting</option>
              <option value="price-asc" className="bg-white dark:bg-slate-900 text-stone-900 dark:text-white">Price: Low to High</option>
              <option value="price-desc" className="bg-white dark:bg-slate-900 text-stone-900 dark:text-white">Price: High to Low</option>
              <option value="rating-desc" className="bg-white dark:bg-slate-900 text-stone-900 dark:text-white">Highest Rated</option>
              <option value="name-asc" className="bg-white dark:bg-slate-900 text-stone-900 dark:text-white">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills Bar with Icons */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => onSelectCategory('all')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 flex items-center gap-2 border ${
            activeCategory === 'all'
              ? 'glow-button text-white border-transparent shadow-md'
              : 'bg-stone-100/90 hover:bg-stone-200/90 dark:bg-white/5 border-stone-200/90 dark:border-white/10 text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>All Gear</span>
        </button>

        {categories.map((cat) => {
          const Icon = getCategoryIcon(cat.name);
          const isActive = activeCategory === cat.name;
          return (
            <button
              key={cat.slug}
              onClick={() => onSelectCategory(cat.name)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 flex items-center gap-2 border ${
                isActive
                  ? 'glow-button text-white border-transparent shadow-md'
                  : 'bg-stone-100/90 hover:bg-stone-200/90 dark:bg-white/5 border-stone-200/90 dark:border-white/10 text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-stone-500 dark:text-slate-400'}`} />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
