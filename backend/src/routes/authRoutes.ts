import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

// Email / Password Authentication
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Profile & session resolution
router.get('/me', authenticate, AuthController.getMe);
router.post('/link-facility', authenticate, AuthController.linkFacility);

// Google OAuth redirect & callback routes
router.get('/google', AuthController.googleAuth);
router.get('/google/callback', AuthController.googleCallback);
router.post('/google/exchange', AuthController.exchangeGoogleCode);
router.post('/google/verify', AuthController.verifyGoogleToken);

export default router;
