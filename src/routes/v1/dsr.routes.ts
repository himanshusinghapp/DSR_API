// routes/dsr.routes.ts
import { Router } from 'express';
import DSRController from '@controllers/dsr.controller';
import { AuthMiddleware } from '@middlewares/auth.middleware';

const router = Router();

router.post('/api/v1/dsr', AuthMiddleware.authenticate(), DSRController.createDSR);
router.put('/api/v1/dsr', AuthMiddleware.authenticate(), DSRController.updateDSR);
router.get('/api/v1/dsr', AuthMiddleware.authenticate(), DSRController.listDSRs);
router.get('/api/v1/dsr/:dsrId', AuthMiddleware.authenticate(), DSRController.getDSRById);

export default router;
