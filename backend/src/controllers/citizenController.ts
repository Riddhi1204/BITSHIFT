import { Request, Response, NextFunction } from 'express';
import { CitizenService } from '../services/citizenService.js';

export class CitizenController {
  static async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const dashboard = await CitizenService.getCitizenDashboard(userId);

      if (!dashboard) {
        return res.status(404).json({
          success: false,
          message: 'Citizen user not found',
        });
      }

      res.json({
        success: true,
        data: dashboard,
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const updated = await CitizenService.updateCitizenProfile(userId, req.body);

      res.json({
        success: true,
        data: updated,
        message: 'Profile updated successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  static async searchNearby(req: Request, res: Response, next: NextFunction) {
    try {
      const { bloodGroup, city } = req.query;

      if (!bloodGroup) {
        return res.status(400).json({
          success: false,
          message: 'bloodGroup parameter is required',
        });
      }

      const results = await CitizenService.searchNearbyAvailability(
        bloodGroup as string,
        city as string
      );

      res.json({
        success: true,
        data: results,
      });
    } catch (err) {
      next(err);
    }
  }
}
