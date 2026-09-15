import { Router } from 'express';
import { getProducts, getFeaturedProducts, getProductById, createProductReview } from '../controllers/productController';
import { register, login, getProfile, toggleWishlist, getWishlist } from '../controllers/authController';
import { createOrder, getOrderById, getMyOrders } from '../controllers/orderController';
import { applyCoupon, getCoupons } from '../controllers/couponController';
import { getCategories } from '../controllers/categoryController';
import { protect } from '../middleware/auth';

const router = Router();

// Products
router.get('/products', getProducts);
router.get('/products/featured', getFeaturedProducts);
router.get('/products/:id', getProductById);
router.post('/products/:id/reviews', protect, createProductReview);

// Categories
router.get('/categories', getCategories);

// Auth & Wishlist
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/profile', protect, getProfile);
router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/:productId', protect, toggleWishlist);
router.delete('/wishlist/:productId', protect, toggleWishlist);

// Coupons
router.post('/coupons/apply', applyCoupon);
router.get('/coupons', getCoupons);

// Orders
router.post('/orders', createOrder);
router.get('/orders/my-orders', protect, getMyOrders);
router.get('/orders/:id', getOrderById);

export default router;
