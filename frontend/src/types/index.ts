export interface IReview {
  _id?: string;
  name: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

export interface IProduct {
  _id: string;
  id?: string;
  name: string;
  subtitle?: string;
  slug?: string;
  description: string;
  price: number;
  oldPrice?: number;
  category: string;
  archetype?: string;
  concentration?: string;
  volume?: string;
  brand?: string;
  stock: number;
  rating: number;
  reviewsCount: number;
  image: string;
  images?: string[];
  features?: string[];
  notes?: {
    top?: string[];
    heart?: string[];
    base?: string[];
  };
  isFeatured?: boolean;
  reviews?: IReview[];
}

export interface ICategory {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export interface IUser {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
}

export interface ICartItem {
  product: IProduct;
  quantity: number;
}

export interface ICouponResult {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
}
