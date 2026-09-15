'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ApiClient } from '@/patterns/api/AbstractApiClientFactory';
import { IProduct } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { Button, Badge } from '@/patterns/ui-factory/AbstractComponentFactory';
import { Star, ArrowLeft, ShoppingBag, CheckCircle2 } from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    async function load() {
      if (id) {
        const p = await ApiClient.getProductById(String(id));
        setProduct(p);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-block w-8 h-8 border-4 border-stone-800 dark:border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-stone-500 dark:text-slate-400 text-sm">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-4">Product Not Found</h2>
        <Link href="/">
          <Button variant="primary">Return to Catalog</Button>
        </Link>
      </div>
    );
  }

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 dark:text-slate-400 mb-8">
        <Link href="/" className="hover:text-stone-900 dark:hover:text-white flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
        </Link>
        <span>/</span>
        <span className="text-stone-700 dark:text-slate-200">{product.category}</span>
        <span>/</span>
        <span className="text-stone-900 dark:text-indigo-400 font-bold truncate max-w-xs">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
        <div className="glass-panel rounded-3xl p-6 relative overflow-hidden bg-white/80 dark:bg-slate-950">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Badge variant="default">{product.category}</Badge>
              <Badge variant="stock">In Stock ({product.stock} Units)</Badge>
              {discount > 0 && <Badge variant="sale">-{discount}% OFF</Badge>}
            </div>

            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-stone-900 dark:text-white tracking-tight leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mt-3">
              <div className="flex text-amber-500 dark:text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500 dark:fill-amber-400" />
                ))}
              </div>
              <span className="text-sm font-bold text-stone-900 dark:text-slate-200">{Number(product.rating).toFixed(1)}</span>
              <span className="text-xs text-stone-500 dark:text-slate-400">({product.reviewsCount} customer reviews)</span>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 flex items-baseline gap-4">
            <span className="font-heading font-black text-3xl sm:text-4xl text-stone-900 dark:text-white">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-lg text-stone-400 dark:text-slate-400 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          <p className="text-sm sm:text-base text-stone-600 dark:text-slate-300 leading-relaxed">
            {product.description}
          </p>

          {product.features && product.features.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400">Key Highlights</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-stone-800 dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-cyan-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-stone-200 dark:border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="flex items-center justify-between border border-stone-300 dark:border-white/15 bg-stone-100 dark:bg-slate-900 rounded-full px-4 py-2 w-full sm:w-36">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-lg font-bold text-stone-500 hover:text-stone-900 dark:text-slate-400 dark:hover:text-white px-2 transition-colors"
              >
                -
              </button>
              <span className="font-bold text-sm text-stone-900 dark:text-white">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="text-lg font-bold text-stone-500 hover:text-stone-900 dark:text-slate-400 dark:hover:text-white px-2 transition-colors"
              >
                +
              </button>
            </div>

            <Button
              onClick={() => addItem(product, quantity)}
              variant="primary"
              size="lg"
              className="flex-1 gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Add to Cart • {formatPrice(product.price * quantity)}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
