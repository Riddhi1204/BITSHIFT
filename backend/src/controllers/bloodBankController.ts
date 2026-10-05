import { Request, Response, NextFunction } from 'express';
import { BloodBankService } from '../services/bloodBankService.js';

export class BloodBankController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { city, state, search, verified } = req.query;
      const bloodBanks = await BloodBankService.getBloodBanks({
        city: city as string,
        state: state as string,
        search: search as string,
        verified: verified !== undefined ? verified === 'true' : undefined,
      });

      res.json({
        success: true,
        data: bloodBanks,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const bloodBank = await BloodBankService.getBloodBankById(id);

      if (!bloodBank) {
        return res.status(404).json({
          success: false,
          message: 'Blood bank not found',
        });
      }

      res.json({
        success: true,
        data: bloodBank,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const dashboard = await BloodBankService.getBloodBankDashboard(id);

      if (!dashboard) {
        return res.status(404).json({
          success: false,
          message: 'Blood bank dashboard not found for ID: ' + id,
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

  static async updateInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { bloodGroup, units, component } = req.body;

      if (!bloodGroup || units === undefined) {
        return res.status(400).json({
          success: false,
          message: 'bloodGroup and units are required',
        });
      }

      const updated = await BloodBankService.updateInventory(
        id,
        bloodGroup,
        Number(units),
        component || 'whole_blood'
      );

      res.json({
        success: true,
        data: updated,
        message: 'Inventory updated successfully',
      });
    } catch (err) {
      next(err);
    }
  }
}
