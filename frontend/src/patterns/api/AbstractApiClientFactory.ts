import { IProduct, ICategory, IUser, ICouponResult } from '@/types';

export interface IQuizRecommendation {
  primaryProduct: IProduct;
  matchPercentage: number;
  narrativeExplanation: string;
  companionProducts: { product: IProduct; matchPercentage: number }[];
}

export interface IAdminStats {
  totalRevenue: number;
  totalOrders: number;
  pendingOrdersCount: number;
  deliveredOrdersCount: number;
  totalProducts: number;
  totalUsers: number;
  averageOrderValue: number;
}

export interface IApiClient {
  getProducts(params?: { category?: string; search?: string; sort?: string; page?: number; limit?: number }): Promise<{ products: IProduct[]; total: number }>;
  getFeaturedProducts(): Promise<IProduct[]>;
  getProductById(id: string): Promise<IProduct | null>;
  getCategories(): Promise<ICategory[]>;
  applyCoupon(code: string, orderAmount: number): Promise<ICouponResult | null>;
  createOrder(orderData: any): Promise<any>;
  getOrderById(id: string): Promise<any>;
  register(name: string, email: string, password: string, phone?: string): Promise<{ user: IUser; token: string }>;
  login(email: string, password: string): Promise<{ user: IUser; token: string }>;
  getProfile(token: string): Promise<IUser | null>;
  getWishlist(token: string): Promise<IProduct[]>;
  toggleWishlist(productId: string, token: string): Promise<boolean>;
  getQuizRecommendation(quizData: any): Promise<IQuizRecommendation | null>;
  trackOrder(identifier: string): Promise<any>;
  getLoyaltyProfile(token: string): Promise<any>;
  redeemLoyaltyPoints(token: string, pointsNeeded: number, discountAmount: number): Promise<any>;
  verifyAdmin(token: string): Promise<boolean>;
  getAdminStats(token: string): Promise<{ stats: IAdminStats; lowStockProducts: IProduct[]; recentOrders: any[] }>;
  createAdminProduct(token: string, productData: any): Promise<any>;
  updateAdminProduct(token: string, id: string, productData: any): Promise<any>;
  deleteAdminProduct(token: string, id: string): Promise<any>;
  updateOrderStatus(token: string, id: string, status: string, note?: string): Promise<any>;
}

export class RestApiClient implements IApiClient {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  async getProducts(params: any = {}): Promise<{ products: IProduct[]; total: number }> {
    try {
      const cleanedParams: Record<string, string> = {};
      Object.keys(params).forEach((key) => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '' && params[key] !== 'all') {
          cleanedParams[key] = String(params[key]);
        }
      });
      const q = new URLSearchParams(cleanedParams).toString();
      const url = q ? `${this.baseUrl}/products?${q}` : `${this.baseUrl}/products`;
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error();
      const data = await res.json();
      return { products: data.products || [], total: data.total || 0 };
    } catch {
      return { products: [], total: 0 };
    }
  }

  async getFeaturedProducts(): Promise<IProduct[]> {
    try {
      const res = await fetch(`${this.baseUrl}/products/featured`, { cache: 'no-store' });
      const data = await res.json();
      return data.products || [];
    } catch {
      return [];
    }
  }

  async getProductById(id: string): Promise<IProduct | null> {
    try {
      const res = await fetch(`${this.baseUrl}/products/${id}`, { cache: 'no-store' });
      const data = await res.json();
      return data.product || null;
    } catch {
      return null;
    }
  }

  async getCategories(): Promise<ICategory[]> {
    try {
      const res = await fetch(`${this.baseUrl}/categories`, { cache: 'no-store' });
      const data = await res.json();
      return data.categories || [];
    } catch {
      return [];
    }
  }

  async applyCoupon(code: string, orderAmount: number): Promise<ICouponResult | null> {
    try {
      const res = await fetch(`${this.baseUrl}/coupons/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, orderAmount }),
      });
      const data = await res.json();
      if (data.success && data.coupon) return data.coupon;
      return null;
    } catch {
      return null;
    }
  }

  async createOrder(orderData: any): Promise<any> {
    const res = await fetch(`${this.baseUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    return await res.json();
  }

  async getOrderById(id: string): Promise<any> {
    try {
      const res = await fetch(`${this.baseUrl}/orders/${id}`, { cache: 'no-store' });
      return await res.json();
    } catch {
      return { success: false, message: 'Failed to fetch order details' };
    }
  }

  async register(name: string, email: string, password: string, phone?: string): Promise<{ user: IUser; token: string }> {
    const res = await fetch(`${this.baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Registration failed');
    return { user: data.user, token: data.token };
  }

  async login(email: string, password: string): Promise<{ user: IUser; token: string }> {
    const res = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Login failed');
    return { user: data.user, token: data.token };
  }

  async getProfile(token: string): Promise<IUser | null> {
    try {
      const res = await fetch(`${this.baseUrl}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      return data.user || null;
    } catch {
      return null;
    }
  }

  async getWishlist(token: string): Promise<IProduct[]> {
    try {
      const res = await fetch(`${this.baseUrl}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store'
      });
      const data = await res.json();
      return data.wishlist || [];
    } catch {
      return [];
    }
  }

  async toggleWishlist(productId: string, token: string): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/wishlist/${productId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      return !!data.inWishlist;
    } catch {
      return false;
    }
  }

  async getQuizRecommendation(quizData: any): Promise<IQuizRecommendation | null> {
    try {
      const res = await fetch(`${this.baseUrl}/quiz/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quizData)
      });
      const data = await res.json();
      if (data.success && data.recommendation) return data.recommendation;
      return null;
    } catch {
      return null;
    }
  }

  async trackOrder(identifier: string): Promise<any> {
    try {
      const res = await fetch(`${this.baseUrl}/orders/${identifier}/track`, { cache: 'no-store' });
      return await res.json();
    } catch {
      return { success: false, message: 'Could not connect to tracking server' };
    }
  }

  async getLoyaltyProfile(token: string): Promise<any> {
    try {
      const res = await fetch(`${this.baseUrl}/loyalty/profile`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store'
      });
      return await res.json();
    } catch {
      return null;
    }
  }

  async redeemLoyaltyPoints(token: string, pointsNeeded: number, discountAmount: number): Promise<any> {
    try {
      const res = await fetch(`${this.baseUrl}/loyalty/redeem`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ pointsNeeded, discountAmount })
      });
      return await res.json();
    } catch {
      return { success: false, message: 'Failed to redeem points' };
    }
  }

  async verifyAdmin(token: string): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/admin/verify`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store'
      });
      const data = await res.json();
      return !!(data.success && data.user?.role === 'admin');
    } catch {
      return false;
    }
  }

  async getAdminStats(token: string): Promise<{ stats: IAdminStats; lowStockProducts: IProduct[]; recentOrders: any[] }> {
    try {
      const res = await fetch(`${this.baseUrl}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store'
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return data;
    } catch (e: any) {
      throw new Error(e.message || 'Unauthorized admin access');
    }
  }

  async createAdminProduct(token: string, productData: any): Promise<any> {
    const res = await fetch(`${this.baseUrl}/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });
    return await res.json();
  }

  async updateAdminProduct(token: string, id: string, productData: any): Promise<any> {
    const res = await fetch(`${this.baseUrl}/admin/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });
    return await res.json();
  }

  async deleteAdminProduct(token: string, id: string): Promise<any> {
    const res = await fetch(`${this.baseUrl}/admin/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    return await res.json();
  }

  async updateOrderStatus(token: string, id: string, status: string, note?: string): Promise<any> {
    const res = await fetch(`${this.baseUrl}/admin/orders/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status, note })
    });
    return await res.json();
  }
}

export interface IApiClientFactory {
  createClient(): IApiClient;
}

export class EnterpriseApiClientFactory implements IApiClientFactory {
  createClient(): IApiClient {
    return new RestApiClient();
  }
}

export const ApiClient = new EnterpriseApiClientFactory().createClient();
