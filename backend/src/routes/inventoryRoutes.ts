import { Router } from 'express';
import { InventoryController } from '../controllers/inventoryController.js';

const router = Router();

// Base inventory routes
router.get('/', InventoryController.getAll);
router.get('/summary', InventoryController.getSummary);

// Expiry & Waste Management routes
router.get('/expiry', InventoryController.getExpiry);
router.get('/expiry/soon', InventoryController.getExpiringSoon);
router.get('/expired', InventoryController.getExpired);
router.get('/waste', InventoryController.getWasteAnalytics);
router.get('/analytics', InventoryController.getWasteAnalytics);
router.get('/insights', InventoryController.getInsights);
router.get('/alerts', InventoryController.getAlerts);

router.post('/waste', InventoryController.recordWaste);
router.patch('/batches/:id/status', InventoryController.updateBatchStatus);

export default router;
