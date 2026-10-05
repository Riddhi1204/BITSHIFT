import { Router } from 'express';
import { HospitalController } from '../controllers/hospitalController.js';

const router = Router();

router.get('/', HospitalController.getAll);
router.get('/:id', HospitalController.getById);
router.get('/:id/dashboard', HospitalController.getDashboard);
router.patch('/:id/stock', HospitalController.updateStock);
router.post('/:id/pledge', HospitalController.createPledge);

export default router;
