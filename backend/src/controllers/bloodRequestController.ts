import { Request, Response, NextFunction } from 'express';
import { BloodRequestService } from '../services/bloodRequestService.js';

export class BloodRequestController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { city, bloodGroup, urgency, status, hospitalId } = req.query;
      const requests = await BloodRequestService.getBloodRequests({
        city: city as string,
        bloodGroup: bloodGroup as string,
        urgency: urgency as string,
        status: status as string,
        hospitalId: hospitalId as string,
      });

      res.json({
        success: true,
        data: requests,
      });
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        requesterId,
        hospitalId,
        patientName,
        patientAge,
        patientGender,
        bloodGroup,
        unitsRequired,
        urgency,
        hospitalName,
        hospitalAddress,
        city,
        state,
        requiredBy,
        contactPhone,
        notes,
      } = req.body;

      if (!requesterId || !bloodGroup || !unitsRequired) {
        return res.status(400).json({
          success: false,
          message: 'requesterId, bloodGroup, and unitsRequired are required',
        });
      }

      const request = await BloodRequestService.createBloodRequest({
        requesterId,
        hospitalId,
        patientName,
        patientAge: patientAge ? Number(patientAge) : undefined,
        patientGender,
        bloodGroup,
        unitsRequired: Number(unitsRequired),
        urgency,
        hospitalName,
        hospitalAddress,
        city,
        state,
        requiredBy: requiredBy ? new Date(requiredBy) : undefined,
        contactPhone,
        notes,
      });

      res.status(201).json({
        success: true,
        data: request,
        message: 'Emergency blood requisition broadcasted successfully.',
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status, unitsFulfilled } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required',
        });
      }

      const updated = await BloodRequestService.updateStatus(
        id,
        status,
        unitsFulfilled ? Number(unitsFulfilled) : undefined
      );

      res.json({
        success: true,
        data: updated,
        message: 'Request status updated',
      });
    } catch (err) {
      next(err);
    }
  }
}
