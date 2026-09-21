import { Router } from 'express';
import { getProducts, getFeaturedProducts, getProductById, createProductReview } from '../controllers/productController';
import { register, login, getProfile, toggleWishlist, getWishlist } from '../controllers/authController';
import { createOrder, getOrderById, getMyOrders, trackOrder } from '../controllers/orderController';
import { applyCoupon, getCoupons } from '../controllers/couponController';
import { getCategories } from '../controllers/categoryController';
import { recommendFragrance } from '../controllers/quizController';
import { getLoyaltyProfile, redeemLoyaltyPoints } from '../controllers/loyaltyController';
import {
  getAdminStats,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  updateOrderStatus
} from '../controllers/adminController';
import { protect, adminOnly, AuthRequest } from '../middleware/auth';
import { Response } from 'express';

const router = Router();

// Products
router.get('/products', getProducts);
router.get('/products/featured', getFeaturedProducts);
router.get('/products/:id', getProductById);
router.post('/products/:id/reviews', protect, createProductReview);

// AI Fragrance Finder Quiz
router.post('/quiz/recommend', recommendFragrance);

// Categories
router.get('/categories', getCategories);

// Auth & Wishlist
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/profile', protect, getProfile);
router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/:productId', protect, toggleWishlist);
router.delete('/wishlist/:productId', protect, toggleWishlist);

// Loyalty & VIP Privilege
router.get('/loyalty/profile', protect, getLoyaltyProfile);
router.post('/loyalty/redeem', protect, redeemLoyaltyPoints);

// Coupons
router.post('/coupons/apply', applyCoupon);
router.get('/coupons', getCoupons);

// Orders & Live Tracking
router.post('/orders', createOrder);
router.get('/orders/my-orders', protect, getMyOrders);
router.get('/orders/:identifier/track', trackOrder);
router.get('/orders/:id', getOrderById);

// Executive Admin Control Panel (Protected strictly with protect + adminOnly)
router.get('/admin/verify', protect, adminOnly, (req: AuthRequest, res: Response) => {
  res.json({ success: true, message: 'Admin verified successfully', user: req.user });
});
router.get('/admin/stats', protect, adminOnly, getAdminStats);
router.post('/admin/products', protect, adminOnly, createAdminProduct);
router.put('/admin/products/:id', protect, adminOnly, updateAdminProduct);
router.delete('/admin/products/:id', protect, adminOnly, deleteAdminProduct);
router.put('/admin/orders/:id/status', protect, adminOnly, updateOrderStatus);

export default router;
