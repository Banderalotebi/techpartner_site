import { Router } from 'express';
import * as payoutController from '../controllers/payout.controller';

const router = Router();

router.get('/', payoutController.getAllPayouts);
router.get('/:id', payoutController.getPayoutById);
router.post('/', payoutController.createPayout);
router.put('/:id', payoutController.updatePayout);
router.delete('/:id', payoutController.deletePayout);

export default router;
s