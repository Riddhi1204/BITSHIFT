import { Router } from 'express';
import { CitizenController } from '../controllers/citizenController.js';

const router = Router();

router.get('/search', CitizenController.searchNearby);
router.get('/:userId/dashboard', CitizenController.getDashboard);
router.put('/:userId/profile', CitizenController.updateProfile);

export default router;
