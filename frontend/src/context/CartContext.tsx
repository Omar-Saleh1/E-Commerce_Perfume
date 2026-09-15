'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { IProduct, ICartItem, ICouponResult } from '@/types';
import { useToast } from './ToastContext';

interface CartContextType {
  items: ICartItem[];
  addItem: (product: IProduct, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
  appliedCoupon: ICouponResult | null;
  applyCoupon: (coupon: ICouponResult | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ICartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<ICouponResult | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('nexus_cart');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('nexus_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product: IProduct, quantity = 1) => {
    setItems((prev) => {
      const prodId = product._id || product.id!;
      const existing = prev.find((item) => (item.product._id || item.product.id) === prodId);
      if (existing) {
        return prev.map((item) =>
          (item.product._id || item.product.id) === prodId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added "${product.name}" to cart 🛍️`);
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => (item.product._id || item.product.id) !== productId));
    showToast('Item removed from cart');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        (item.product._id || item.product.id) === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        itemCount,
        appliedCoupon,
        applyCoupon: setAppliedCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
