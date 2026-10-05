import { Router } from 'express';
import { DonationController } from '../controllers/donationController.js';

const router = Router();

router.get('/', DonationController.getAll);
router.post('/', DonationController.create);
router.patch('/:id/status', DonationController.updateStatus);

export default router;
