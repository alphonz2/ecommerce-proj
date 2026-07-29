import express from 'express';
import productController from '../controllers/productController.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes — anyone can view products, no login required
router.get('/available', productController.getAvailableProducts); // 7
router.get('/unavailable', productController.getUnavailableProducts); // 8
router.get('/name/:name', productController.getProductByName); // 9
router.get('/category/:category', productController.getProductByCategory); // 10
router.get('/:id', productController.getProductById); // 2
router.get('/', productController.getAllProducts); // 3

// Protected routes — must be logged in
router.post('/', isAuthenticated, productController.addProduct); // 1
router.put('/:id', isAuthenticated, productController.updateProduct); // 4
router.delete('/:id', isAuthenticated, productController.deleteProduct); // 5
router.delete('/', isAuthenticated, productController.deleteAllProducts); // 6

export default router;
