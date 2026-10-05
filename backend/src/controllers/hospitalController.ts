import { Request, Response, NextFunction } from 'express';
import { HospitalService } from '../services/hospitalService.js';

export class HospitalController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { city, state, status, search } = req.query;
      const hospitals = await HospitalService.getHospitals({
        city: city as string,
        state: state as string,
        status: status as string,
        search: search as string,
      });

      res.json({
        success: true,
        data: hospitals,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const hospital = await HospitalService.getHospitalById(id);

      if (!hospital) {
        return res.status(404).json({
          success: false,
          message: 'Hospital not found',
        });
      }

      res.json({
        success: true,
        data: hospital,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const dashboard = await HospitalService.getHospitalDashboard(id);

      if (!dashboard) {
        return res.status(404).json({
          success: false,
          message: 'Hospital dashboard not found for ID: ' + id,
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

  static async updateStock(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { bloodGroup, change } = req.body;

      if (!bloodGroup || change === undefined) {
        return res.status(400).json({
          success: false,
          message: 'bloodGroup and change amount are required',
        });
      }

      const updated = await HospitalService.updateStock(id, bloodGroup, Number(change));

      res.json({
        success: true,
        data: updated,
        message: 'Stock updated successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  static async createPledge(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { donorName, phone, bloodGroup, age, gender, preferredSlot, notes } = req.body;

      if (!donorName || !phone || !bloodGroup) {
        return res.status(400).json({
          success: false,
          message: 'donorName, phone, and bloodGroup are required',
        });
      }

      const pledge = await HospitalService.createDonorPledge({
        hospitalId: id,
        donorName,
        phone,
        bloodGroup,
        age: Number(age) || 25,
        gender,
        preferredSlot,
        notes,
      });

      res.status(201).json({
        success: true,
        data: pledge,
        message: 'Thank you for stepping up! Hospital coordinators have received your donation offer.',
      });
    } catch (err) {
      next(err);
    }
  }
}
