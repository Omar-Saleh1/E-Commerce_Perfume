'use client';
import React from 'react';
import { Search, SlidersHorizontal, X, Sparkles, Flame, Flower2, Citrus, Wind } from 'lucide-react';
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
  if (n.includes('wood') || n.includes('amber')) return Flame;
  if (n.includes('flor') || n.includes('rose')) return Flower2;
  if (n.includes('citrus') || n.includes('fresh')) return Citrus;
  return Wind;
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
    <div className="bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 p-6 mb-10 shadow-sm flex flex-col gap-6">
      {/* Top Search & Filter Strip */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-lg">
          <Search className="w-4 h-4 text-[#8c6d3b] dark:text-[#c29b62] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search notes (e.g. Cardamom, Amber, Solstice, Rose)..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#f8f6f0] dark:bg-[#1a1816] border border-[#e8e2d4] dark:border-white/10 pl-11 pr-10 py-3 text-xs sm:text-sm text-[#1a1816] dark:text-[#f8f6f0] placeholder-[#a6a096] dark:placeholder-stone-500 focus:outline-none focus:border-[#b38b4d] dark:focus:border-[#c29b62] transition-all font-sans"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7a746e] hover:text-[#1a1816] dark:hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Counter and Sort Selection */}
        <div className="flex items-center justify-between md:justify-end gap-4">
          <div className="text-[11px] uppercase tracking-wider font-medium text-[#7a746e] dark:text-[#a6a096] bg-[#f8f6f0] dark:bg-[#1a1816] px-3.5 py-2.5 border border-[#e8e2d4] dark:border-white/10">
            <span className="text-[#8c6d3b] dark:text-[#c29b62] font-serif font-bold text-sm">{totalProducts}</span> Flacons Available
          </div>

          <div className="flex items-center gap-2 bg-[#f8f6f0] dark:bg-[#1a1816] border border-[#e8e2d4] dark:border-white/10 px-3.5 py-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#8c6d3b] dark:text-[#c29b62]" />
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-transparent text-xs font-medium text-[#1a1816] dark:text-[#f8f6f0] focus:outline-none cursor-pointer pr-2 font-sans"
            >
              <option value="" className="bg-white dark:bg-[#141211] text-[#1a1816] dark:text-[#f8f6f0]">Curated Signatures</option>
              <option value="price-asc" className="bg-white dark:bg-[#141211] text-[#1a1816] dark:text-[#f8f6f0]">Price: Low to High</option>
              <option value="price-desc" className="bg-white dark:bg-[#141211] text-[#1a1816] dark:text-[#f8f6f0]">Price: High to Low</option>
              <option value="rating-desc" className="bg-white dark:bg-[#141211] text-[#1a1816] dark:text-[#f8f6f0]">Highest Rated</option>
              <option value="name-asc" className="bg-white dark:bg-[#141211] text-[#1a1816] dark:text-[#f8f6f0]">Flacon A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills Bar with Icons */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none border-t border-[#e8e2d4]/70 dark:border-white/10 pt-4">
        <button
          onClick={() => onSelectCategory('all')}
          className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all duration-300 flex items-center gap-2 border ${
            activeCategory === 'all'
              ? 'bg-[#1a1816] text-[#f8f6f0] dark:bg-[#f8f6f0] dark:text-[#1a1816] border-transparent shadow-sm'
              : 'bg-[#f8f6f0] hover:bg-[#eae4d5] dark:bg-[#1a1816] dark:hover:bg-[#25221e] border-[#e8e2d4] dark:border-white/10 text-[#7a746e] dark:text-[#a6a096] hover:text-[#1a1816] dark:hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#b38b4d] dark:text-[#c29b62]" />
          <span>All Fragrances</span>
        </button>

        {categories.map((cat) => {
          const Icon = getCategoryIcon(cat.name);
          const isActive = activeCategory === cat.name;
          return (
            <button
              key={cat.slug}
              onClick={() => onSelectCategory(cat.name)}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all duration-300 flex items-center gap-2 border ${
                isActive
                  ? 'bg-[#1a1816] text-[#f8f6f0] dark:bg-[#f8f6f0] dark:text-[#1a1816] border-transparent shadow-sm'
                  : 'bg-[#f8f6f0] hover:bg-[#eae4d5] dark:bg-[#1a1816] dark:hover:bg-[#25221e] border-[#e8e2d4] dark:border-white/10 text-[#7a746e] dark:text-[#a6a096] hover:text-[#1a1816] dark:hover:text-white'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#b38b4d] dark:text-[#c29b62]' : 'text-[#8c6d3b] dark:text-[#a6a096]'}`} />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
