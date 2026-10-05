import { Router } from 'express';
import { InventoryController } from '../controllers/inventoryController.js';

const router = Router();

router.get('/', InventoryController.getAll);
router.get('/summary', InventoryController.getSummary);

export default router;
