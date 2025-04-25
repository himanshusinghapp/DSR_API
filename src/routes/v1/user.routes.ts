import { Router } from 'express';
import UserController from '@controllers/user.controller';
import  {AuthMiddleware} from '@middlewares/auth.middleware';

const router = Router();

router.post('/api/v1/signup', UserController.signup);
router.post('/api/v1/login', UserController.login);
router.post('/api/v1/send-otp', UserController.sendOtp);
router.post('/api/v1/verify-otp', UserController.verifyOtp);
router.post('/api/v1/forget-password', UserController.forgetPassword);
router.get('/api/v1/profile', AuthMiddleware.authenticate(), UserController.getProfile);
router.patch('/api/v1/profile', AuthMiddleware.authenticate(), UserController.updateProfile);

export default router;