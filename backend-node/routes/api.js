const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');

// Import controllers
const productController = require('../controllers/productController');
const cartController = require('../controllers/cartController');
const checkoutController = require('../controllers/checkoutController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

// Auth routes (public)
router.post('/auth/register', authController.signUp);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);

// Product routes (public)
router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.get('/products/search', productController.searchProducts);

// Cart routes (protected - require authentication)
router.get('/cart', authenticate, cartController.getCart);
router.post('/cart', authenticate, cartController.addToCart); // Assignment requirement: POST /api/cart
router.put('/cart/items/:id', authenticate, cartController.updateCartItem); // Update cart item quantity
router.delete('/cart/:id', authenticate, cartController.removeFromCart); // Assignment requirement: DELETE /api/cart/:id
router.delete('/cart', authenticate, cartController.clearCart); // Clear entire cart

// Checkout route (protected)
router.post('/checkout', authenticate, checkoutController.checkout); // Assignment requirement: POST /api/checkout

// User routes (protected)
router.get('/user/profile', authenticate, userController.getProfile);
router.put('/user/profile', authenticate, userController.updateProfile);

module.exports = router;

