import { Router } from 'express';
import { AuthService } from '../services/authService.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { authSchemas } from '../schemas/auth.js';
import { AuthError } from '../utils/errors.js';

const router = Router();

router.post('/google', validateRequest(authSchemas.google), async (req, res, next) => {
  try {
    const result = await AuthService.loginWithGoogle(req.body.token);
    res.json(result);
  } catch (error) {
    next(new AuthError('Google authentication failed', 'GOOGLE_AUTH_FAILED'));
  }
});

router.post('/register', validateRequest(authSchemas.register), async (req, res, next) => {
  try {
    const result = await AuthService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error && error.message === 'Email already registered') {
      next(new ValidationError('Email already registered', 'EMAIL_EXISTS'));
    } else {
      next(error);
    }
  }
});

router.post('/login', validateRequest(authSchemas.login), async (req, res, next) => {
  try {
    const result = await AuthService.login(req.body);
    res.json(result);
  } catch (error) {
    next(new AuthError('Invalid credentials', 'INVALID_CREDENTIALS'));
  }
});

router.post('/reset-password', validateRequest(authSchemas.resetPassword), async (req, res, next) => {
  try {
    await AuthService.initiatePasswordReset(req.body.email);
    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    next(error);
  }
});

router.post('/change-password', validateRequest(authSchemas.changePassword), async (req, res, next) => {
  try {
    await AuthService.changePassword(req.user?.userId, req.body);
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;