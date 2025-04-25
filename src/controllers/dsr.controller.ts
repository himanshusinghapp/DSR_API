import { Request, Response } from 'express';
import DSR from '@models/DSR.model';
import { successResponse, errorResponse } from '@utils/response';
import { HttpStatus } from '@utils/httpStatus';
import { Messages } from '@utils/messages';
import { logger } from '@config/logger';
import { Op } from 'sequelize';

class DSRController {
  static async createDSR(req: Request, res: Response):Promise<void> {
    try {
      const { project, date, estimatedHour, description } = req.body;
      const userId = (req as any).user.id;

      if (estimatedHour > 8) {
        logger.warn(`DSR creation failed: Estimated hours exceed 8 for user ${userId}`);
        errorResponse(res, HttpStatus.BAD_REQUEST, Messages.LIMIT_REACHED);
        return;
      }

      const existing = await DSR.sum('estimatedHour', {
        where: { userId, date }
      });

      if ((existing || 0) + estimatedHour > 8) {
        logger.warn(`DSR creation failed: Total hours exceed 8 on ${date} for user ${userId}`);
         errorResponse(res, HttpStatus.BAD_REQUEST, Messages.LIMIT_REACHED);
         return;
      }

      const dsr = await DSR.create({ project, date, estimatedHour, description, userId });
      logger.info(`DSR created for user ${userId} on ${date}`);
      successResponse(res, HttpStatus.CREATED, Messages.DSR_CREATED, dsr);
    } catch (error: any) {
      logger.error(`DSR creation error for user ${(req as any).user.id}: ${error.message}`);
      errorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, Messages.DSR_CRAETED_FAILED);
    }
  }

  static async updateDSR(req: Request, res: Response):Promise<void>  {
    try {
      const { id, estimatedHour, description } = req.body;
      const userId = (req as any).user.id;

      const dsr = await DSR.findOne({ where: { id, userId } });
      if (!dsr) {
        logger.warn(`DSR update failed: DSR not found for user ${userId} and DSR ID ${id}`);
         errorResponse(res, HttpStatus.NOT_FOUND, Messages.DSR_NOT_FOUND);
        return;
      }

      if (estimatedHour > 8) {
        logger.warn(`DSR update failed: Estimated hours exceed 8 for DSR ID ${id}`);
         errorResponse(res, HttpStatus.BAD_REQUEST, Messages.LIMIT_REACHED);
        return;
      }

      dsr.estimatedHour = estimatedHour;
      dsr.description = description;
      await dsr.save();

      logger.info(`DSR updated for user ${userId}, DSR ID ${id}`);
      successResponse(res, HttpStatus.OK, Messages.DSR_UPDATED, dsr);
    } catch (error: any) {
      logger.error(`DSR update error for user ${(req as any).user.id}: ${error.message}`);
      errorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, Messages.DSR_UPDATION_FAILED);
    }
  }

  static async listDSRs(req: Request, res: Response) :Promise<void> {
    try {
      const userId = (req as any).user.id;
      const { startDate, endDate, page = 1, limit = 10 } = req.query;

      const where: any = { userId };
      if (startDate && endDate) {
        where.date = { [Op.between]: [startDate, endDate] };
      }

      const dsrs = await DSR.findAndCountAll({
        where,
        limit: +limit,
        offset: (+page - 1) * +limit,
        order: [['date', 'DESC']],
      });

      logger.info(`Fetched DSR list for user ${userId}`);
      successResponse(res, HttpStatus.OK, Messages.DSR_FETCH, {
        total: dsrs.count,
        page: +page,
        limit: +limit,
        records: dsrs.rows
      });
    } catch (error: any) {
      logger.error(`DSR list fetch error for user ${(req as any).user.id}: ${error.message}`);
      errorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, Messages.DSR_FETCHED_FAIL);
    }
  }

  static async getDSRById(req: Request, res: Response):Promise<void>  {
    try {
      const userId = (req as any).user.id;
      const { dsrId } = req.params;

      const dsr = await DSR.findOne({ where: { id: dsrId, userId } });
      if (!dsr) {
        logger.warn(`Fetch DSR by ID failed: Not found for user ${userId}, DSR ID ${dsrId}`);
         errorResponse(res, HttpStatus.NOT_FOUND, Messages.DSR_NOT_FOUND);
        return;
      }

      logger.info(`Fetched DSR ID ${dsrId} for user ${userId}`);
      successResponse(res, HttpStatus.OK, Messages.DSR_FETCH, dsr);
    } catch (error: any) {
      logger.error(`DSR fetch by ID error for user ${(req as any).user.id}: ${error.message}`);
      errorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, Messages.DSR_FETCHED_FAIL);
    }
  }
}

export default DSRController;
