'use client';
import React from 'react';
import { ICategory } from '@/types';
import { SlidersHorizontal, RotateCcw, Sparkles, Check } from 'lucide-react';

interface CatalogSidebarProps {
  categories: ICategory[];
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedNotes: string[];
  onToggleNote: (note: string) => void;
  selectedConcentration: string;
  onSelectConcentration: (conc: string) => void;
  maxPrice: number;
  onPriceChange: (price: number) => void;
  onReset: () => void;
}

const AVAILABLE_NOTES = [
  'Cardamom',
  'Bergamot',
  'Sandalwood',
  'Orris Root',
  'Bourbon Vanilla',
  'Ambergris',
  'May Rose',
  'Smoked Oud',
  'Neroli',
  'Pink Pepper'
];

export const CatalogSidebar: React.FC<CatalogSidebarProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  selectedNotes,
  onToggleNote,
  selectedConcentration,
  onSelectConcentration,
  maxPrice,
  onPriceChange,
  onReset,
}) => {
  return (
    <aside className="w-full lg:w-64 bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 p-6 space-y-8 shadow-sm">
      {/* Sidebar Title */}
      <div className="flex items-center justify-between border-b border-[#e8e2d4] dark:border-white/10 pb-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold text-[#1a1816] dark:text-[#f8f6f0]">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#8c6d3b] dark:text-[#c29b62]" />
          <span>Olfactory Filters</span>
        </div>
        <button
          onClick={onReset}
          className="text-[10px] uppercase tracking-wider text-[#8c6d3b] dark:text-[#c29b62] hover:text-[#1a1816] dark:hover:text-white flex items-center gap-1 font-semibold transition-colors"
          title="Reset all filters"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* 1. Olfactory Families / Categories */}
      <div className="space-y-3">
        <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#1a1816] dark:text-[#f8f6f0]">
          Fragrance Family
        </h4>
        <div className="space-y-1.5">
          <button
            onClick={() => onSelectCategory('all')}
            className={`w-full text-left text-xs py-1.5 px-2.5 transition-all flex items-center justify-between ${
              activeCategory === 'all'
                ? 'bg-[#1a1816] text-[#f8f6f0] dark:bg-[#f8f6f0] dark:text-[#1a1816] font-semibold'
                : 'text-[#7a746e] dark:text-[#a6a096] hover:text-[#1a1816] dark:hover:text-white hover:bg-[#f8f6f0] dark:hover:bg-[#1a1816]'
            }`}
          >
            <span>All Fragrances</span>
            {activeCategory === 'all' && <Check className="w-3 h-3" />}
          </button>

          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => onSelectCategory(cat.name)}
              className={`w-full text-left text-xs py-1.5 px-2.5 transition-all flex items-center justify-between ${
                activeCategory === cat.name
                  ? 'bg-[#1a1816] text-[#f8f6f0] dark:bg-[#f8f6f0] dark:text-[#1a1816] font-semibold'
                  : 'text-[#7a746e] dark:text-[#a6a096] hover:text-[#1a1816] dark:hover:text-white hover:bg-[#f8f6f0] dark:hover:bg-[#1a1816]'
              }`}
            >
              <span>{cat.name}</span>
              {activeCategory === cat.name && <Check className="w-3 h-3" />}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Price Range */}
      <div className="space-y-3 border-t border-[#e8e2d4]/70 dark:border-white/10 pt-6">
        <div className="flex items-center justify-between text-xs">
          <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#1a1816] dark:text-[#f8f6f0]">
            Price Cap
          </h4>
          <span className="font-serif font-bold text-[#8c6d3b] dark:text-[#c29b62]">
            Up to ${maxPrice}
          </span>
        </div>
        <input
          type="range"
          min="100"
          max="500"
          step="10"
          value={maxPrice}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          className="w-full accent-[#b38b4d] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-[#7a746e] dark:text-[#a6a096]">
          <span>$100</span>
          <span>$500+</span>
        </div>
      </div>

      {/* 3. Concentration Filter */}
      <div className="space-y-3 border-t border-[#e8e2d4]/70 dark:border-white/10 pt-6">
        <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#1a1816] dark:text-[#f8f6f0]">
          Concentration
        </h4>
        <div className="space-y-1.5">
          {['all', 'Extrait de Parfum', 'Eau de Parfum'].map((c) => (
            <button
              key={c}
              onClick={() => onSelectConcentration(c)}
              className={`w-full text-left text-xs py-1.5 px-2.5 transition-all flex items-center justify-between ${
                selectedConcentration === c
                  ? 'bg-[#1a1816] text-[#f8f6f0] dark:bg-[#f8f6f0] dark:text-[#1a1816] font-semibold'
                  : 'text-[#7a746e] dark:text-[#a6a096] hover:text-[#1a1816] dark:hover:text-white hover:bg-[#f8f6f0] dark:hover:bg-[#1a1816]'
              }`}
            >
              <span>{c === 'all' ? 'All Concentrations' : c}</span>
              {selectedConcentration === c && <Check className="w-3 h-3" />}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Rare Botanical Notes */}
      <div className="space-y-3 border-t border-[#e8e2d4]/70 dark:border-white/10 pt-6">
        <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#1a1816] dark:text-[#f8f6f0]">
          Botanical Notes
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {AVAILABLE_NOTES.map((note) => {
            const isSelected = selectedNotes.includes(note);
            return (
              <button
                key={note}
                onClick={() => onToggleNote(note)}
                className={`text-[10px] uppercase tracking-wider px-2.5 py-1 transition-all border ${
                  isSelected
                    ? 'bg-[#1a1816] text-[#f8f6f0] dark:bg-[#f8f6f0] dark:text-[#1a1816] border-transparent font-semibold shadow-sm'
                    : 'bg-[#f8f6f0] dark:bg-[#1a1816] text-[#7a746e] dark:text-[#a6a096] border-[#e8e2d4] dark:border-white/10 hover:border-[#b38b4d]'
                }`}
              >
                {note}
              </button>
            );
          })}
        </div>
      </div>

    </aside>
  );
};
