import { Router } from 'express';
import { BloodRequestController } from '../controllers/bloodRequestController.js';

const router = Router();

router.get('/', BloodRequestController.getAll);
router.post('/', BloodRequestController.create);
router.patch('/:id/status', BloodRequestController.updateStatus);

export default router;
