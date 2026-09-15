import { IProduct, Product } from '../../models/Product';
import { IUser, User } from '../../models/User';
import { IOrder, Order } from '../../models/Order';
import { ICoupon, Coupon } from '../../models/Coupon';

export interface IBaseRepository<T> {
  findById(id: string): Promise<T | null>;
  find(filter?: any, sort?: any, limit?: number, skip?: number): Promise<T[]>;
  count(filter?: any): Promise<number>;
  create(item: Partial<T>): Promise<T>;
  update(id: string, item: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

export interface IDataRepositoryFactory {
  createProductRepository(): IBaseRepository<IProduct>;
  createUserRepository(): IBaseRepository<IUser>;
  createOrderRepository(): IBaseRepository<IOrder>;
  createCouponRepository(): IBaseRepository<ICoupon>;
}

export class MongoProductRepository implements IBaseRepository<IProduct> {
  async findById(id: string): Promise<IProduct | null> { return Product.findById(id); }
  async find(filter: any = {}, sort: any = { createdAt: -1 }, limit = 50, skip = 0): Promise<IProduct[]> {
    return Product.find(filter).sort(sort as any).skip(skip).limit(limit);
  }
  async count(filter = {}): Promise<number> { return Product.countDocuments(filter); }
  async create(item: Partial<IProduct>): Promise<IProduct> { return Product.create(item); }
  async update(id: string, item: Partial<IProduct>): Promise<IProduct | null> {
    return Product.findByIdAndUpdate(id, item, { new: true });
  }
  async delete(id: string): Promise<boolean> {
    const res = await Product.findByIdAndDelete(id);
    return !!res;
  }
}

export class MongoUserRepository implements IBaseRepository<IUser> {
  async findById(id: string): Promise<IUser | null> { return User.findById(id).select('-password'); }
  async find(filter: any = {}, sort: any = { createdAt: -1 }, limit = 50, skip = 0): Promise<IUser[]> {
    return User.find(filter).select('-password').sort(sort as any).skip(skip).limit(limit);
  }
  async count(filter = {}): Promise<number> { return User.countDocuments(filter); }
  async create(item: Partial<IUser>): Promise<IUser> { return User.create(item); }
  async update(id: string, item: Partial<IUser>): Promise<IUser | null> {
    return User.findByIdAndUpdate(id, item, { new: true }).select('-password');
  }
  async delete(id: string): Promise<boolean> {
    const res = await User.findByIdAndDelete(id);
    return !!res;
  }
}

export class MongoOrderRepository implements IBaseRepository<IOrder> {
  async findById(id: string): Promise<IOrder | null> { return Order.findById(id); }
  async find(filter: any = {}, sort: any = { createdAt: -1 }, limit = 50, skip = 0): Promise<IOrder[]> {
    return Order.find(filter).sort(sort as any).skip(skip).limit(limit);
  }
  async count(filter = {}): Promise<number> { return Order.countDocuments(filter); }
  async create(item: Partial<IOrder>): Promise<IOrder> { return Order.create(item); }
  async update(id: string, item: Partial<IOrder>): Promise<IOrder | null> {
    return Order.findByIdAndUpdate(id, item, { new: true });
  }
  async delete(id: string): Promise<boolean> {
    const res = await Order.findByIdAndDelete(id);
    return !!res;
  }
}

export class MongoCouponRepository implements IBaseRepository<ICoupon> {
  async findById(id: string): Promise<ICoupon | null> { return Coupon.findById(id); }
  async find(filter: any = {}, sort: any = { createdAt: -1 }, limit = 50, skip = 0): Promise<ICoupon[]> {
    return Coupon.find(filter).sort(sort as any).skip(skip).limit(limit);
  }
  async count(filter = {}): Promise<number> { return Coupon.countDocuments(filter); }
  async create(item: Partial<ICoupon>): Promise<ICoupon> { return Coupon.create(item); }
  async update(id: string, item: Partial<ICoupon>): Promise<ICoupon | null> {
    return Coupon.findByIdAndUpdate(id, item, { new: true });
  }
  async delete(id: string): Promise<boolean> {
    const res = await Coupon.findByIdAndDelete(id);
    return !!res;
  }
}

export class MongoRepositoryFactory implements IDataRepositoryFactory {
  createProductRepository(): IBaseRepository<IProduct> { return new MongoProductRepository(); }
  createUserRepository(): IBaseRepository<IUser> { return new MongoUserRepository(); }
  createOrderRepository(): IBaseRepository<IOrder> { return new MongoOrderRepository(); }
  createCouponRepository(): IBaseRepository<ICoupon> { return new MongoCouponRepository(); }
}

export const RepositoryFactory = new MongoRepositoryFactory();
