import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface IOrderTimelineEvent {
  status: string;
  title: string;
  description: string;
  timestamp: Date;
  completed: boolean;
}

export interface IOrder extends Document {
  user?: mongoose.Types.ObjectId;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    postalCode?: string;
    country?: string;
    notes?: string;
  };
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  shippingFee: number;
  discount: number;
  total: number;
  appliedCoupon?: string;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  orderStatus: 'pending' | 'processing' | 'blending' | 'shipped' | 'delivered' | 'cancelled';
  fulfillmentTier?: string;
  packaging?: {
    tierName?: string;
    boxType?: string;
    insulationType?: string;
    complimentarySamplesCount?: number;
    specialInstructions?: string;
  };
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: Date;
  timeline: IOrderTimelineEvent[];
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: String,
      country: { type: String, default: 'Global' },
      notes: String
    },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
        image: { type: String, required: true }
      }
    ],
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    shippingFee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    appliedCoupon: { type: String },
    paymentMethod: { type: String, required: true, default: 'Cash on Delivery (COD)' },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    orderStatus: {
      type: String,
      enum: ['pending', 'processing', 'blending', 'shipped', 'delivered', 'cancelled'],
      default: 'processing'
    },
    fulfillmentTier: { type: String, default: 'Standard Maison Ground' },
    packaging: {
      tierName: String,
      boxType: String,
      insulationType: String,
      complimentarySamplesCount: Number,
      specialInstructions: String
    },
    trackingNumber: { type: String, default: () => `ODR-STD-${Math.floor(100000 + Math.random() * 900000)}` },
    carrier: { type: String, default: 'Maison National Postal & Ground Network' },
    estimatedDelivery: { type: Date, default: () => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
    timeline: [
      {
        status: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        completed: { type: Boolean, default: true }
      }
    ]
  },
  { timestamps: true }
);

export const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
