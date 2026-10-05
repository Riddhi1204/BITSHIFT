import { Request, Response, NextFunction } from 'express';
import { InventoryService } from '../services/inventoryService.js';

export class InventoryController {
  static async getAll(_req: Request, res: Response, next: NextFunction) {
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

  static async getSummary(_req: Request, res: Response, next: NextFunction) {
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
}
