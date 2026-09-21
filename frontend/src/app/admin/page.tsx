'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ApiClient, IAdminStats } from '@/patterns/api/AbstractApiClientFactory';
import { IProduct } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Package,
  Plus,
  Trash2,
  Edit,
  ArrowLeft,
  Truck,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  Lock,
  ShieldCheck,
  LogOut,
  KeyRound,
  UserCheck
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, token, login, logout, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<IAdminStats | null>(null);
  const [lowStock, setLowStock] = useState<IProduct[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAdminAuthorized, setIsAdminAuthorized] = useState(false);
  const { showToast } = useToast();

  // Admin login local state
  const [loginEmail, setLoginEmail] = useState('admin@store.com');
  const [loginPassword, setLoginPassword] = useState('admin123456');
  const [submittingLogin, setSubmittingLogin] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: '',
    subtitle: '',
    description: '',
    price: 280,
    category: 'Woody & Earthy',
    archetype: 'Woody',
    concentration: 'Extrait de Parfum (30% Conc.)',
    volume: '50ml / 1.7 fl.oz',
    stock: 20,
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=80'
  });

  // Verify Admin Access
  useEffect(() => {
    const verify = async () => {
      if (authLoading) return;
      if (!token || !user) {
        setIsAdminAuthorized(false);
        setIsVerifying(false);
        return;
      }

      if (user.role !== 'admin') {
        setIsAdminAuthorized(false);
        setIsVerifying(false);
        return;
      }

      try {
        const verified = await ApiClient.verifyAdmin(token);
        setIsAdminAuthorized(verified);
      } catch {
        setIsAdminAuthorized(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verify();
  }, [token, user, authLoading]);

  // Load Dashboard Data when verified
  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [adminRes, prodsRes] = await Promise.all([
        ApiClient.getAdminStats(token),
        ApiClient.getProducts({ limit: 50 })
      ]);
      setStats(adminRes.stats);
      setLowStock(adminRes.lowStockProducts || []);
      setRecentOrders(adminRes.recentOrders || []);
      setProducts(prodsRes.products || []);
    } catch (err: any) {
      showToast(err.message || 'Error loading admin analytics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminAuthorized && token) {
      loadData();
    }
  }, [isAdminAuthorized, token]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingLogin(true);
    try {
      const success = await login(loginEmail, loginPassword);
      if (success) {
        // Will trigger useEffect above
      }
    } finally {
      setSubmittingLogin(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const res = await ApiClient.createAdminProduct(token, newProduct);
      if (res.success) {
        showToast(`Flacon "${newProduct.name}" added to catalog ✨`);
        setShowAddModal(false);
        setNewProduct({
          name: '',
          subtitle: '',
          description: '',
          price: 280,
          category: 'Woody & Earthy',
          archetype: 'Woody',
          concentration: 'Extrait de Parfum (30% Conc.)',
          volume: '50ml / 1.7 fl.oz',
          stock: 20,
          image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=80'
        });
        loadData();
      } else {
        showToast(res.message || 'Error creating product', 'error');
      }
    } catch {
      showToast('Failed to create flacon', 'error');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!token) return;
    if (!confirm(`Are you sure you want to remove "${name}" from the catalog?`)) return;
    try {
      const res = await ApiClient.deleteAdminProduct(token, id);
      if (res.success) {
        showToast(`Removed "${name}" from catalog`);
        loadData();
      }
    } catch {
      showToast('Failed to delete flacon', 'error');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, nextStatus: string) => {
    if (!token) return;
    try {
      const res = await ApiClient.updateOrderStatus(token, orderId, nextStatus);
      if (res.success) {
        showToast(`Order status updated to "${nextStatus.toUpperCase()}" 🚚`);
        loadData();
      }
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  // 1. Loading state
  if (authLoading || isVerifying) {
    return (
      <div className="bg-[#f8f6f0] dark:bg-[#0d0c0b] text-[#1a1816] dark:text-[#f8f6f0] min-h-screen flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-[#b38b4d] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif text-sm tracking-widest text-[#7a746e] dark:text-[#a6a096] uppercase">
            Verifying Atelier Security Clearance...
          </p>
        </div>
      </div>
    );
  }

  // 2. Unauthorized screen / Admin Login Modal
  if (!isAdminAuthorized) {
    return (
      <div className="bg-[#f8f6f0] dark:bg-[#0d0c0b] text-[#1a1816] dark:text-[#f8f6f0] min-h-screen flex items-center justify-center p-4 sm:p-6 transition-colors duration-300">
        <div className="max-w-md w-full bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 p-8 sm:p-10 shadow-2xl relative overflow-hidden space-y-8">
          
          {/* Subtle Top Accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#b38b4d] via-[#e5c583] to-[#8c6d3b]" />

          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#8c6d3b]/10 dark:bg-[#c29b62]/10 border border-[#8c6d3b]/30 dark:border-[#c29b62]/30 flex items-center justify-center mx-auto text-[#8c6d3b] dark:text-[#c29b62]">
              <Lock className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8c6d3b] dark:text-[#c29b62] block">
              Restricted Chamber
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#1a1816] dark:text-white font-normal">
              Executive Atelier Access
            </h1>
            <p className="text-xs text-[#7a746e] dark:text-[#a6a096] leading-relaxed">
              This dashboard is strictly reserved for Maison Administrators. Backend authentication &amp; role verification are required.
            </p>
          </div>

          {user && user.role !== 'admin' && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs rounded-sm space-y-2">
              <div className="flex items-center gap-2 font-medium">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Logged in as Client: <strong>{user.email}</strong></span>
              </div>
              <p className="text-[11px] opacity-90">
                Your current account does not hold administrator privileges. Please log in with an administrator account.
              </p>
              <button
                onClick={logout}
                className="text-[11px] font-semibold underline hover:text-amber-900 dark:hover:text-amber-100"
              >
                Sign out of client account &rarr;
              </button>
            </div>
          )}

          {(!user || user.role !== 'admin') && (
            <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-[#7a746e] dark:text-[#a6a096]">
                  Administrator Email
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@store.com"
                  className="w-full bg-[#f8f6f0] dark:bg-[#1a1816] border border-[#e8e2d4] dark:border-white/10 px-3.5 py-2.5 text-xs text-[#1a1816] dark:text-white focus:outline-none focus:border-[#b38b4d]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-[#7a746e] dark:text-[#a6a096]">
                  Master Passkey
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#f8f6f0] dark:bg-[#1a1816] border border-[#e8e2d4] dark:border-white/10 px-3.5 py-2.5 text-xs text-[#1a1816] dark:text-white focus:outline-none focus:border-[#b38b4d]"
                />
              </div>

              <button
                type="submit"
                disabled={submittingLogin}
                className="w-full py-3 bg-[#1a1816] hover:bg-[#b38b4d] text-[#f8f6f0] dark:bg-[#f8f6f0] dark:hover:bg-[#c29b62] dark:text-[#1a1816] text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{submittingLogin ? 'Authenticating...' : 'Unlock Maison Dashboard'}</span>
              </button>

              {/* Demo Admin Preset Note */}
              <div className="p-3 bg-[#f8f6f0] dark:bg-[#1a1816] border border-[#e8e2d4] dark:border-white/10 text-[11px] text-[#7a746e] dark:text-[#a6a096] space-y-1">
                <div className="font-semibold text-[#1a1816] dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#8c6d3b]" />
                  <span>Atelier Admin Credentials (Seeded)</span>
                </div>
                <p>Email: <code className="text-[#8c6d3b] font-mono">admin@store.com</code></p>
                <p>Pass: <code className="text-[#8c6d3b] font-mono">admin123456</code></p>
              </div>
            </form>
          )}

          <div className="pt-2 text-center">
            <Link
              href="/"
              className="text-xs text-[#7a746e] dark:text-[#a6a096] hover:text-[#1a1816] dark:hover:text-white flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Boutique</span>
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // 3. Authorized Admin Dashboard
  return (
    <div className="bg-[#f8f6f0] dark:bg-[#0d0c0b] text-[#1a1816] dark:text-[#f8f6f0] py-10 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header with Admin Clearance Badge & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8e2d4] dark:border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-[#7a746e] dark:text-[#a6a096] mb-1">
              <Link href="/" className="hover:text-[#b38b4d] flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" /> Back to Store
              </Link>
              <span>/</span>
              <span className="text-[#8c6d3b] dark:text-[#c29b62] font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Maison Executive Control
              </span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-3xl sm:text-4xl text-[#1a1816] dark:text-white font-normal">
                Executive Atelier Dashboard
              </h1>
              <span className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-[10px] px-2.5 py-0.5 uppercase tracking-wider font-semibold rounded-full hidden sm:inline-flex items-center gap-1">
                <UserCheck className="w-3 h-3" /> Admin Verified
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2.5 border border-[#e8e2d4] dark:border-white/10 text-[#7a746e] hover:text-[#1a1816] dark:hover:text-white bg-white dark:bg-[#141211] transition-colors"
              title="Refresh Analytics"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 bg-[#1a1816] hover:bg-[#b38b4d] text-[#f8f6f0] dark:bg-[#f8f6f0] dark:hover:bg-[#c29b62] dark:text-[#1a1816] text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Flacon</span>
            </button>

            <button
              onClick={logout}
              className="p-2.5 border border-rose-200 dark:border-rose-900 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 bg-white dark:bg-[#141211] transition-colors"
              title="Sign Out of Atelier"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 p-6 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-[#8c6d3b] dark:text-[#c29b62]">
              <span className="text-[11px] uppercase tracking-wider font-semibold">Total Revenue</span>
              <DollarSign className="w-4 h-4" />
            </div>
            <div className="font-serif text-3xl font-medium text-[#1a1816] dark:text-white">
              {formatPrice(stats?.totalRevenue || 0)}
            </div>
            <p className="text-[10px] text-[#7a746e] dark:text-[#a6a096]">Gross sales across all flacon harvests</p>
          </div>

          <div className="bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 p-6 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-[#8c6d3b] dark:text-[#c29b62]">
              <span className="text-[11px] uppercase tracking-wider font-semibold">Total Consignments</span>
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div className="font-serif text-3xl font-medium text-[#1a1816] dark:text-white">
              {stats?.totalOrders || 0}
            </div>
            <p className="text-[10px] text-[#7a746e] dark:text-[#a6a096]">Lifetime client orders placed</p>
          </div>

          <div className="bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 p-6 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-[#8c6d3b] dark:text-[#c29b62]">
              <span className="text-[11px] uppercase tracking-wider font-semibold">Active Formulation</span>
              <Clock className="w-4 h-4" />
            </div>
            <div className="font-serif text-3xl font-medium text-amber-600 dark:text-amber-400">
              {stats?.pendingOrdersCount || 0}
            </div>
            <p className="text-[10px] text-[#7a746e] dark:text-[#a6a096]">Orders in atelier blending & preparation</p>
          </div>

          <div className="bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 p-6 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-[#8c6d3b] dark:text-[#c29b62]">
              <span className="text-[11px] uppercase tracking-wider font-semibold">Avg Flacon Value</span>
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="font-serif text-3xl font-medium text-[#1a1816] dark:text-white">
              {formatPrice(stats?.averageOrderValue || 0)}
            </div>
            <p className="text-[10px] text-[#7a746e] dark:text-[#a6a096]">Average cart checkout basket size</p>
          </div>
        </div>

        {/* Recent Orders & Status Stepper */}
        <div className="bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#e8e2d4] dark:border-white/10 pb-4">
            <h3 className="font-serif text-xl text-[#1a1816] dark:text-white font-normal flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#8c6d3b] dark:text-[#c29b62]" />
              <span>Live Order Management &amp; Dispatch</span>
            </h3>
            <span className="text-[11px] text-[#7a746e] dark:text-[#a6a096]">Advance status with 1-click</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#e8e2d4] dark:border-white/10 text-[10px] uppercase tracking-wider text-[#7a746e] dark:text-[#a6a096]">
                  <th className="py-3 px-2">Order / Ref</th>
                  <th className="py-3 px-2">Client</th>
                  <th className="py-3 px-2">Items</th>
                  <th className="py-3 px-2">Total</th>
                  <th className="py-3 px-2">Current Status</th>
                  <th className="py-3 px-2 text-right">Workflow Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8e2d4]/60 dark:divide-white/5">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-[#7a746e] dark:text-[#a6a096]">
                      No active orders in the atelier at this moment.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-[#f8f6f0]/50 dark:hover:bg-[#1a1816]/50 transition-colors">
                      <td className="py-3.5 px-2 font-mono text-[11px]">
                        <Link href={`/orders/${order._id}/track`} className="text-[#8c6d3b] dark:text-[#c29b62] hover:underline">
                          #{order._id.slice(-6).toUpperCase()}
                        </Link>
                      </td>
                      <td className="py-3.5 px-2">
                        <div className="font-semibold text-[#1a1816] dark:text-white">{order.customerName}</div>
                        <div className="text-[10px] text-[#7a746e] dark:text-[#a6a096]">{order.customerEmail}</div>
                      </td>
                      <td className="py-3.5 px-2 text-[#7a746e] dark:text-[#a6a096]">
                        {order.items?.length || 1} Flacon(s)
                      </td>
                      <td className="py-3.5 px-2 font-serif font-bold text-[#1a1816] dark:text-white">
                        {formatPrice(order.total)}
                      </td>
                      <td className="py-3.5 px-2">
                        <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold border ${
                          order.orderStatus === 'delivered'
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                            : order.orderStatus === 'shipped'
                            ? 'bg-sky-500/10 border-sky-500/30 text-sky-700 dark:text-sky-400'
                            : 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400'
                        }`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-right space-x-1.5">
                        {order.orderStatus === 'processing' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order._id, 'blending')}
                            className="px-2.5 py-1 bg-[#1a1816] text-[#f8f6f0] dark:bg-[#f8f6f0] dark:text-[#1a1816] text-[10px] uppercase tracking-wider font-semibold hover:bg-[#b38b4d]"
                          >
                            Blend at Atelier &rarr;
                          </button>
                        )}
                        {order.orderStatus === 'blending' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order._id, 'shipped')}
                            className="px-2.5 py-1 bg-[#1a1816] text-[#f8f6f0] dark:bg-[#f8f6f0] dark:text-[#1a1816] text-[10px] uppercase tracking-wider font-semibold hover:bg-[#b38b4d]"
                          >
                            Dispatch DHL &rarr;
                          </button>
                        )}
                        {order.orderStatus === 'shipped' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order._id, 'delivered')}
                            className="px-2.5 py-1 bg-emerald-700 text-white text-[10px] uppercase tracking-wider font-semibold hover:bg-emerald-800"
                          >
                            Mark Delivered &check;
                          </button>
                        )}
                        {order.orderStatus === 'delivered' && (
                          <span className="text-[11px] text-emerald-600 font-semibold">Completed</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Flacon Inventory Management Table */}
        <div className="bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#e8e2d4] dark:border-white/10 pb-4">
            <h3 className="font-serif text-xl text-[#1a1816] dark:text-white font-normal flex items-center gap-2">
              <Package className="w-4 h-4 text-[#8c6d3b] dark:text-[#c29b62]" />
              <span>Fragrance Inventory Catalog ({products.length} Flacons)</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((p) => {
              const prodId = p._id || p.id!;
              return (
                <div key={prodId} className="border border-[#e8e2d4] dark:border-white/10 p-4 bg-[#f8f6f0]/60 dark:bg-[#1a1816]/60 flex gap-4 items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-14 h-14 object-cover border border-[#e8e2d4] dark:border-white/10 bg-white" />
                    <div>
                      <h4 className="font-serif text-base font-normal text-[#1a1816] dark:text-white truncate max-w-[140px]">{p.name}</h4>
                      <span className="text-[10px] text-[#8c6d3b] uppercase block">{p.category}</span>
                      <span className="font-serif text-xs font-bold text-[#1a1816] dark:text-white">{formatPrice(p.price)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-[10px] px-2 py-0.5 font-bold ${
                      p.stock <= 10 ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-700'
                    }`}>
                      {p.stock} in stock
                    </span>
                    <button
                      onClick={() => handleDeleteProduct(prodId, p.name)}
                      className="text-stone-400 hover:text-rose-600 p-1 transition-colors"
                      title="Delete flacon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Add New Flacon Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif text-2xl text-[#1a1816] dark:text-white font-normal">
              Add New Artisanal Flacon
            </h3>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold block mb-1">Fragrance Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bois de Kyoto"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full bg-[#f8f6f0] dark:bg-[#1a1816] border border-[#e8e2d4] dark:border-white/10 px-3 py-2 text-xs text-[#1a1816] dark:text-white focus:outline-none focus:border-[#b38b4d]"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold block mb-1">Subtitle / Key Notes *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Japanese Cedar • Hinoki Wood • White Amber"
                  value={newProduct.subtitle}
                  onChange={(e) => setNewProduct({ ...newProduct, subtitle: e.target.value })}
                  className="w-full bg-[#f8f6f0] dark:bg-[#1a1816] border border-[#e8e2d4] dark:border-white/10 px-3 py-2 text-xs text-[#1a1816] dark:text-white focus:outline-none focus:border-[#b38b4d]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold block mb-1">Price ($) *</label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className="w-full bg-[#f8f6f0] dark:bg-[#1a1816] border border-[#e8e2d4] dark:border-white/10 px-3 py-2 text-xs text-[#1a1816] dark:text-white focus:outline-none focus:border-[#b38b4d]"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold block mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                    className="w-full bg-[#f8f6f0] dark:bg-[#1a1816] border border-[#e8e2d4] dark:border-white/10 px-3 py-2 text-xs text-[#1a1816] dark:text-white focus:outline-none focus:border-[#b38b4d]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold block mb-1">Olfactory Category</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full bg-[#f8f6f0] dark:bg-[#1a1816] border border-[#e8e2d4] dark:border-white/10 px-3 py-2 text-xs text-[#1a1816] dark:text-white focus:outline-none focus:border-[#b38b4d]"
                >
                  <option value="Woody & Earthy">Woody & Earthy</option>
                  <option value="Floral & Botanical">Floral & Botanical</option>
                  <option value="Citrus & Solar">Citrus & Solar</option>
                  <option value="Amber & Resins">Amber & Resins</option>
                  <option value="Oud & Smoked Oriental">Oud & Smoked Oriental</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold block mb-1">Narrative Description</label>
                <textarea
                  rows={3}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full bg-[#f8f6f0] dark:bg-[#1a1816] border border-[#e8e2d4] dark:border-white/10 p-2 text-xs text-[#1a1816] dark:text-white focus:outline-none focus:border-[#b38b4d]"
                  placeholder="Enter the poetic atelier story behind this formulation..."
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#e8e2d4] dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 border border-[#e8e2d4] text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#1a1816] hover:bg-[#b38b4d] text-white dark:bg-white dark:text-black text-xs uppercase tracking-wider font-semibold"
                >
                  Publish Flacon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

