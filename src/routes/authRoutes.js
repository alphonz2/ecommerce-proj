import express from 'express';
import authController from '../controllers/authController.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', isAuthenticated, authController.logout);
router.get('/me', isAuthenticated, authController.getCurrentUser);

// Example of a protected route
router.get('/protected', isAuthenticated, (req, res) => {
  res.status(200).json({
    success: true,
    message: `Welcome ${req.user.username}, this is a protected route`,
  });
});

export default router;
