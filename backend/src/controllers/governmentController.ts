import { Request, Response, NextFunction } from 'express';
import { GovernmentService } from '../services/governmentService.js';

export class GovernmentController {
  static async getDashboard(_req: Request, res: Response, next: NextFunction) {
    try {
      const dashboard = await GovernmentService.getGovernmentDashboard();
      res.json({
        success: true,
        data: dashboard,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getVerifications(_req: Request, res: Response, next: NextFunction) {
    try {
      const requests = await GovernmentService.getVerificationRequests();
      res.json({
        success: true,
        data: requests,
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status, reviewNotes, reviewerId } = req.body;

      if (!status || !['approved', 'rejected', 'under_review'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Valid status is required: approved, rejected, or under_review',
        });
      }

      const updated = await GovernmentService.updateVerificationStatus(
        id,
        status,
        reviewerId,
        reviewNotes
      );

      res.json({
        success: true,
        data: updated,
        message: `Hospital verification request marked as ${status}`,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getHotspots(_req: Request, res: Response, next: NextFunction) {
    try {
      const hotspots = await GovernmentService.getHotspots();
      res.json({
        success: true,
        data: hotspots,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getSupply(_req: Request, res: Response, next: NextFunction) {
    try {
      const supply = await GovernmentService.getRegionalSupply();
      res.json({
        success: true,
        data: supply,
      });
    } catch (err) {
      next(err);
    }
  }
}
