import { Router } from 'express';
import { BloodBankController } from '../controllers/bloodBankController.js';

const router = Router();

router.get('/', BloodBankController.getAll);
router.get('/:id', BloodBankController.getById);
router.get('/:id/dashboard', BloodBankController.getDashboard);
router.patch('/:id/inventory', BloodBankController.updateInventory);

export default router;
