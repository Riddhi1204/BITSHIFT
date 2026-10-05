import { Request, Response, NextFunction } from 'express';
import { InventoryService } from '../services/inventoryService.js';
import { WasteService } from '../services/wasteService.js';

export class InventoryController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const inventories = await InventoryService.getAllInventory();
      res.json({
        success: true,
        data: inventories,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const summary = await InventoryService.getGridSummary();
      res.json({
        success: true,
        data: summary,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/inventory/expiry
   * Dynamic expiry telemetry for batches
   */
  static async getExpiry(req: Request, res: Response, next: NextFunction) {
    try {
      const { bloodBankId, hospitalId, warningDays, bloodGroup, status, component, search, state, city } = req.query;
      const data = await WasteService.getExpiryBatches({
        bloodBankId: bloodBankId as string,
        hospitalId: hospitalId as string,
        warningDays: warningDays ? parseInt(warningDays as string) : 7,
        bloodGroup: bloodGroup as string,
        status: status as any,
        component: component as string,
        search: search as string,
        state: state as string,
        city: city as string,
      });

      res.json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/inventory/expiry/soon
   */
  static async getExpiringSoon(req: Request, res: Response, next: NextFunction) {
    try {
      const { bloodBankId, hospitalId, warningDays } = req.query;
      const data = await WasteService.getExpiryBatches({
        bloodBankId: bloodBankId as string,
        hospitalId: hospitalId as string,
        warningDays: warningDays ? parseInt(warningDays as string) : 7,
        status: 'expiring_soon',
      });

      res.json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/inventory/expired
   */
  static async getExpired(req: Request, res: Response, next: NextFunction) {
    try {
      const { bloodBankId, hospitalId } = req.query;
      const data = await WasteService.getExpiryBatches({
        bloodBankId: bloodBankId as string,
        hospitalId: hospitalId as string,
        status: 'expired',
      });

      res.json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/inventory/waste / analytics
   */
  static async getWasteAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const { bloodBankId, hospitalId, state, city, bloodGroup, dateRange } = req.query;
      const data = await WasteService.getWasteAnalytics({
        bloodBankId: bloodBankId as string,
        hospitalId: hospitalId as string,
        state: state as string,
        city: city as string,
        bloodGroup: bloodGroup as string,
        dateRange: dateRange as string,
      });

      res.json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/inventory/waste
   * Record a blood waste record
   */
  static async recordWaste(req: Request, res: Response, next: NextFunction) {
    try {
      const { batchId, inventoryId, bloodBankId, hospitalId, bloodGroup, component, units, reason, notes, recordedById } = req.body;

      if (!bloodGroup || !units || !reason) {
        return res.status(400).json({
          success: false,
          message: 'bloodGroup, units, and reason are required fields',
        });
      }

      const wasteRecord = await WasteService.recordWaste({
        batchId,
        inventoryId,
        bloodBankId,
        hospitalId,
        bloodGroup,
        component,
        units: Number(units),
        reason,
        notes,
        recordedById: recordedById || (req as any).user?.id,
      });

      res.status(201).json({
        success: true,
        data: wasteRecord,
        message: 'Blood unit waste recorded successfully',
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message || 'Failed to record waste',
      });
    }
  }

  /**
   * PATCH /api/inventory/batches/:id/status
   * Update batch status (e.g. used, wasted) with safety checks
   */
  static async updateBatchStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status, reason } = req.body;

      if (!status || !['available', 'used', 'wasted', 'reserved'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Valid status (available, used, wasted, reserved) is required',
        });
      }

      const updated = await WasteService.updateBatchStatus(
        id,
        status,
        (req as any).user?.id,
        reason
      );

      res.json({
        success: true,
        data: updated,
        message: `Batch status updated to ${status}`,
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message || 'Failed to update batch status',
      });
    }
  }

  /**
   * GET /api/inventory/insights
   */
  static async getInsights(req: Request, res: Response, next: NextFunction) {
    try {
      const { bloodBankId, hospitalId } = req.query;
      const insights = await WasteService.getWastePreventionInsights({
        bloodBankId: bloodBankId as string,
        hospitalId: hospitalId as string,
      });

      res.json({
        success: true,
        data: insights,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/inventory/alerts
   */
  static async getAlerts(req: Request, res: Response, next: NextFunction) {
    try {
      const { bloodBankId, hospitalId } = req.query;
      const alerts = await WasteService.getExpiryAlerts({
        bloodBankId: bloodBankId as string,
        hospitalId: hospitalId as string,
      });

      res.json({
        success: true,
        data: alerts,
      });
    } catch (err) {
      next(err);
    }
  }
}
