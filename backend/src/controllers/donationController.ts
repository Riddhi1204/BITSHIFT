import { Request, Response, NextFunction } from 'express';
import { DonationService } from '../services/donationService.js';

export class DonationController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { donorId, hospitalId, bloodBankId, status } = req.query;
      const donations = await DonationService.getDonations({
        donorId: donorId as string,
        hospitalId: hospitalId as string,
        bloodBankId: bloodBankId as string,
        status: status as string,
      });

      res.json({
        success: true,
        data: donations,
      });
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { donorId, hospitalId, bloodBankId, bloodGroup, units, notes, status } = req.body;

      if (!donorId || !bloodGroup) {
        return res.status(400).json({
          success: false,
          message: 'donorId and bloodGroup are required',
        });
      }

      const donation = await DonationService.createDonation({
        donorId,
        hospitalId,
        bloodBankId,
        bloodGroup,
        units: units ? Number(units) : 1,
        notes,
        status,
      });

      res.status(201).json({
        success: true,
        data: donation,
        message: 'Donation recorded successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'status is required',
        });
      }

      const updated = await DonationService.updateDonationStatus(id, status, notes);

      res.json({
        success: true,
        data: updated,
        message: `Donation status updated to ${status}`,
      });
    } catch (err) {
      next(err);
    }
  }
}
