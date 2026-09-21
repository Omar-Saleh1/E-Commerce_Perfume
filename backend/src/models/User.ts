import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  phone?: string;
  wishlist: mongoose.Types.ObjectId[];
  loyaltyPoints: number;
  vipTier: 'Bronze' | 'Silver' | 'Gold' | 'Atelier Connoisseur';
  referralCode: string;
  createdAt: Date;
  updatedAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    phone: { type: String, trim: true },
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    loyaltyPoints: { type: Number, default: 150 },
    vipTier: {
      type: String,
      enum: ['Bronze', 'Silver', 'Gold', 'Atelier Connoisseur'],
      default: 'Bronze'
    },
    referralCode: {
      type: String,
      default: () => `ODR-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
    }
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password || '');
};

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
