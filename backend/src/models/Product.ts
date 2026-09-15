import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IReview {
  user?: mongoose.Types.ObjectId;
  name: string;
  rating: number;
  comment: string;
  createdAt?: Date;
}

export interface IProduct extends Document {
  name: string;
  slug?: string;
  description: string;
  price: number;
  oldPrice?: number;
  category: string;
  brand?: string;
  stock: number;
  rating: number;
  reviewsCount: number;
  image: string;
  images: string[];
  features: string[];
  isFeatured: boolean;
  reviews: IReview[];
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true }
  },
  { timestamps: true }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, lowercase: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    oldPrice: { type: Number, min: 0 },
    category: { type: String, required: true, trim: true },
    brand: { type: String, default: 'Nexus' },
    stock: { type: Number, required: true, default: 10, min: 0 },
    rating: { type: Number, default: 5, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0 },
    image: { type: String, required: true },
    images: [{ type: String }],
    features: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    reviews: [ReviewSchema]
  },
  { timestamps: true }
);

export const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
