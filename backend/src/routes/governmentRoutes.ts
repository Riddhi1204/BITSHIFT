import { Router } from 'express';
import { GovernmentController } from '../controllers/governmentController.js';

const router = Router();

router.get('/dashboard', GovernmentController.getDashboard);
router.get('/verifications', GovernmentController.getVerifications);
router.patch('/verifications/:id', GovernmentController.updateVerification);
router.get('/hotspots', GovernmentController.getHotspots);
router.get('/supply', GovernmentController.getSupply);

export default router;
