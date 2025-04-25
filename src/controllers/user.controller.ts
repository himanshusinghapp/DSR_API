import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import redisClient from '@config/redis';
import { sendOTP } from '@services/mail.services';
import { generateOTP } from '@utils/otp';
import User from '@models/User.model';
import { HttpStatus } from '@utils/httpStatus';
import { Messages } from '@utils/messages';
import { successResponse, errorResponse } from '@utils/response';
import { logger } from '@config/logger';

class UserController {
  // Signup method 
  static async signup(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        logger.warn(`Signup failed: User with email ${email} already exists`);
        errorResponse(res, HttpStatus.BAD_REQUEST, Messages.USER_EXISTS);
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hashedPassword });

      logger.info(`New user created: ${email}`);
      successResponse(res, HttpStatus.CREATED, Messages.USER_CREATED, { id: user.id, email: user.email });
    } catch (err: any) {
      logger.error(`Signup error for ${req.body.email}: ${err.message}`);
      errorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, Messages.INTERNAL_ERROR);
    }
  }

  // Login method
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      logger.info(`Login attempt for email: ${email}`);

      const user = await User.findOne({ where: { email } });
      if (!user) {
        logger.warn(`Login failed: User not found - ${email}`);
        errorResponse(res, HttpStatus.NOT_FOUND, Messages.USER_NOT_FOUND);
        return;
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        logger.warn(`Login failed: Invalid password for ${email}`);
        errorResponse(res, HttpStatus.UNAUTHORIZED, Messages.INVALID_CREDENTIALS);
        return;
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
      logger.info(`User logged in: ${email}`);
      successResponse(res, HttpStatus.OK, Messages.LOGIN_SUCCESS, { token });
    } catch (err: any) {
      logger.error(`Login error for ${req.body.email}: ${err.message}`);
      errorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, Messages.INTERNAL_ERROR);
    }
  }

   // Send OTP
   static async forgetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        logger.warn(`OTP sending failed: Email not provided`);
        errorResponse(res, HttpStatus.BAD_REQUEST, "Email is required");
        return;
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        logger.warn(`OTP sending failed: User not found - ${email}`);
        errorResponse(res, HttpStatus.NOT_FOUND, Messages.USER_NOT_FOUND);
        return;
      }

      const otp = generateOTP();
      await redisClient.setEx(`otp:${email}`, 300, otp);
      await sendOTP(email, otp);
      logger.info(`OTP sent to: ${email}`);

      successResponse(res, HttpStatus.OK, Messages.OTP_SENT);
    } catch (err: any) {
      logger.error(`Error sending OTP to ${req.body.email}: ${err.message}`);
      errorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, Messages.INTERNAL_ERROR);
    }
  }

  // Send OTP
  static async sendOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        logger.warn(`OTP sending failed: Email not provided`);
        errorResponse(res, HttpStatus.BAD_REQUEST, "Email is required");
        return;
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        logger.warn(`OTP sending failed: User not found - ${email}`);
        errorResponse(res, HttpStatus.NOT_FOUND, Messages.USER_NOT_FOUND);
        return;
      }

      const otp = generateOTP();
      await redisClient.setEx(`otp:${email}`, 300, otp);
      await sendOTP(email, otp);
      logger.info(`OTP sent to: ${email}`);

      successResponse(res, HttpStatus.OK, Messages.OTP_RESENT);
    } catch (err: any) {
      logger.error(`Error sending OTP to ${req.body.email}: ${err.message}`);
      errorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, Messages.INTERNAL_ERROR);
    }
  }

  // Forget Password
static async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, newPassword, otp } = req.body;
  
      if (!email || !newPassword || !otp) {
        logger.warn(`Password reset failed: Missing parameters`);
        errorResponse(res, HttpStatus.BAD_REQUEST, "Email, OTP and new password are required");
        return;
      }
  
      const storedOtp = await redisClient.get(`otp:${email}`);
      if (!storedOtp || storedOtp !== otp) {
        logger.warn(`Password reset failed: Invalid or expired OTP for ${email}`);
        errorResponse(res, HttpStatus.BAD_REQUEST, Messages.INVALID_OTP);
        return;
      }
  
      const user = await User.findOne({ where: { email } });
      if (!user) {
        logger.warn(`Password reset failed: User not found - ${email}`);
        errorResponse(res, HttpStatus.NOT_FOUND, Messages.USER_NOT_FOUND);
        return;
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.update({ password: hashedPassword }, { where: { email } });
  
      // Remove OTP from Redis after successful use
      await redisClient.del(`otp:${email}`);
  
      logger.info(`Password reset successful for: ${email}`);
      successResponse(res, HttpStatus.OK, Messages.PASSWORD_RESET);
    } catch (err: any) {
      logger.error(`Password reset error for ${req.body.email}: ${err.message}`);
      errorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, Messages.INTERNAL_ERROR);
    }
  }
  
  // Get User Profile
  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findByPk((req as any).user.id);
      if (!user) {
        logger.warn(`Profile fetch failed: User not found`);
        errorResponse(res, HttpStatus.NOT_FOUND, Messages.USER_NOT_FOUND);
        return;
      }

      logger.info(`Profile fetched for user ID: ${(req as any).user.id}`);
      successResponse(res, HttpStatus.OK, Messages.PROFILE_FETCHED, user);
    } catch (err: any) {
      logger.error(`Profile fetch error: ${err.message}`);
      errorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, Messages.INTERNAL_ERROR);
    }
  }

  // Update User Profile
  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const { name, profilePicture } = req.body;
      const user = await User.findByPk((req as any).user.id);
      if (!user) {
        logger.warn(`Profile update failed: User not found`);
        errorResponse(res, HttpStatus.NOT_FOUND, Messages.USER_NOT_FOUND);
        return;
      }

      user.name = name || user.name;
      user.profilePicture = profilePicture || user.profilePicture;
      await user.save();

      logger.info(`Profile updated for user ID: ${(req as any).user.id}`);
      successResponse(res, HttpStatus.OK, Messages.PROFILE_UPDATED, user);
    } catch (err: any) {
      logger.error(`Profile update error: ${err.message}`);
      errorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, Messages.INTERNAL_ERROR);
    }
  }
}

export default UserController;
