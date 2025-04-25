import { Router } from 'express';
import userRoutes from './user.routes';
import dsrRoutes from './dsr.routes';

const router = Router();

// Mount versioned routes
router.use('/users', userRoutes);
router.use('/users', dsrRoutes); // Assuming DSR routes fall under users too

export default router;
