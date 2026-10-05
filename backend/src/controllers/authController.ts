import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService.js';

export class AuthController {
  /**
   * GET /api/auth/me
   * Return authenticated user profile and resolved facility (Hospital / BloodBank)
   */
  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as any;
      const userId = authReq.user?.id || authReq.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication token is required',
        });
      }

      const profile = await AuthService.getCurrentUser(userId);
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: 'User profile not found',
        });
      }

      res.json({
        success: true,
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/link-facility
   * Associate an authenticated user with a registered facility
   */
  static async linkFacility(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as any;
      const userId = authReq.user?.id || authReq.user?.userId;
      const { facilityType, facilityId } = req.body;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }
      if (!facilityType || !facilityId) {
        return res.status(400).json({ success: false, message: 'facilityType and facilityId are required' });
      }

      const facility = await AuthService.linkFacility(userId, facilityType, facilityId);
      res.json({
        success: true,
        data: facility,
        message: `Successfully linked account to ${facility.name}`,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to link facility',
      });
    }
  }

  /**
   * GET /api/auth/google
   * Redirect user to Google OAuth consent screen
   */
  static async googleAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const { role, facilityId, returnUrl, mode } = req.query;
      const url = AuthService.getGoogleAuthUrl({
        role: (role as string) || 'citizen',
        facilityId: facilityId as string,
        returnUrl: returnUrl as string,
      });

      if (mode === 'json') {
        res.json({ success: true, url });
      } else {
        res.redirect(url);
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/auth/google/callback
   * Google OAuth redirect handler
   */
  static async googleCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, state, error } = req.query;
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

      if (error) {
        return res.redirect(`${clientUrl}/auth/callback?error=${encodeURIComponent(error as string)}`);
      }

      if (!code) {
        return res.redirect(`${clientUrl}/auth/callback?error=missing_authorization_code`);
      }

      const { token, user, facility, state: decodedState } = await AuthService.handleGoogleCallback(
        code as string,
        state as string
      );

      const params = new URLSearchParams({
        token,
        userId: user.id,
        role: user.role,
        name: user.fullName,
        email: user.email,
        avatar: user.avatarUrl || '',
        facilityId: facility?.id || decodedState.facilityId || '',
        facilityName: facility?.name || '',
        facilityType: facility?.type || '',
        returnUrl: decodedState.returnUrl || '',
      });

      res.redirect(`${clientUrl}/auth/callback?${params.toString()}`);
    } catch (error: any) {
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
      res.redirect(`${clientUrl}/auth/callback?error=${encodeURIComponent(error.message || 'Authentication failed')}`);
    }
  }

  /**
   * POST /api/auth/google/exchange
   * Exchange authorization code received directly by frontend
   */
  static async exchangeGoogleCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, state, redirectUri } = req.body;
      if (!code) {
        return res.status(400).json({ success: false, message: 'Google authorization code is required' });
      }

      const result = await AuthService.handleGoogleCallback(code, state, redirectUri);
      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to exchange authorization code',
      });
    }
  }

  /**
   * POST /api/auth/google/verify
   * Verify Google ID token from frontend client
   */
  static async verifyGoogleToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { idToken, role, facilityId } = req.body;
      if (!idToken) {
        return res.status(400).json({ success: false, message: 'Google ID token is required' });
      }

      const result = await AuthService.verifyGoogleIdToken(idToken, { role, facilityId });
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/register
   * Register a new user with email & password
   */
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { fullName, email, password, phone, role, bloodGroup, city, state, address, gender, age } = req.body;
      if (!fullName || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Full name, email, and password are required',
        });
      }

      const result = await AuthService.register({
        fullName,
        email,
        password,
        phone,
        role: role || 'citizen',
        bloodGroup,
        city,
        state,
        address,
        gender,
        age: age ? parseInt(age, 10) : undefined,
      });

      res.status(201).json({
        success: true,
        data: result,
        message: 'Account registered successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Registration failed',
      });
    }
  }

  /**
   * POST /api/auth/login
   * Authenticate user with email & password
   */
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required',
        });
      }

      const result = await AuthService.login(email, password);
      res.json({
        success: true,
        data: result,
        message: 'Welcome back!',
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message || 'Invalid email or password',
      });
    }
  }
}
