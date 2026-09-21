import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { Order } from '../models/Order';
import { User } from '../models/User';

export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const [
      totalOrders,
      orders,
      totalProducts,
      totalUsers,
      lowStockProducts,
      recentOrders
    ] = await Promise.all([
      Order.countDocuments(),
      Order.find({}),
      Product.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Product.find({ stock: { $lte: 15 } }).limit(5),
      Order.find({}).sort({ createdAt: -1 }).limit(6)
    ]);

    const totalRevenue = orders.reduce((acc, curr) => acc + (curr.total || 0), 0);
    const pendingOrdersCount = orders.filter((o) => o.orderStatus === 'pending' || o.orderStatus === 'processing' || o.orderStatus === 'blending').length;
    const deliveredOrdersCount = orders.filter((o) => o.orderStatus === 'delivered').length;

    res.json({
      success: true,
      stats: {
        totalRevenue: Math.round(totalRevenue),
        totalOrders,
        pendingOrdersCount,
        deliveredOrdersCount,
        totalProducts,
        totalUsers,
        averageOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0
      },
      lowStockProducts,
      recentOrders
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createAdminProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      subtitle,
      description,
      price,
      oldPrice,
      category,
      archetype,
      concentration,
      volume,
      stock = 20,
      image,
      images,
      notes,
      features,
      isFeatured = false
    } = req.body;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newProduct = new Product({
      name,
      subtitle: subtitle || `${name} Artisanal Extrait`,
      slug,
      description,
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : undefined,
      category: category || 'Woody & Earthy',
      archetype: archetype || 'Woody',
      concentration: concentration || 'Extrait de Parfum (30% Conc.)',
      volume: volume || '50ml / 1.7 fl.oz',
      brand: 'Odoratus',
      stock: Number(stock),
      image: image || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=80',
      images: images || [image || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=80'],
      notes: notes || {
        top: ['Italian Bergamot', 'Cardamom'],
        heart: ['Orris', 'Sandalwood'],
        base: ['Vanilla', 'Musk']
      },
      features: features || ['Distilled in Grasse', 'Includes 2 Discovery Vials'],
      isFeatured: Boolean(isFeatured),
      rating: 5.0,
      reviewsCount: 1
    });

    await newProduct.save();
    res.status(201).json({ success: true, message: 'Flacon created successfully', product: newProduct });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAdminProduct = async (req: Request, res: Response) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Flacon updated', product: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAdminProduct = async (req: Request, res: Response) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Flacon removed from catalog' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.orderStatus = status;

    const statusDescriptions: Record<string, string> = {
      pending: 'Order registered and awaiting atelier confirmation.',
      processing: 'Order verified and queued for formulation.',
      blending: 'Artisanal flacon bottling, numbered certificate, and wax sealing in progress.',
      shipped: 'Order handed over to DHL Express priority air courier.',
      delivered: 'Package safely delivered to connoisseur residence.',
      cancelled: 'Order has been cancelled upon request.'
    };

    order.timeline.push({
      status,
      title: `Status: ${status.toUpperCase()}`,
      description: note || statusDescriptions[status] || `Order status updated to ${status}`,
      timestamp: new Date(),
      completed: true
    });

    await order.save();
    res.json({ success: true, message: `Order status updated to ${status}`, order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
