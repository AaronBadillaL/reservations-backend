import { Request, Response } from 'express';
import { ScheduleService } from '../services/scheduleService';
import { CreateScheduleDto } from '../dtos';
import { AuthRequest } from '../interfaces';
import { ApiResponseHandler } from '../utils/apiResponse';

const scheduleService = new ScheduleService();

export class ScheduleController {
  async createSchedule(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ApiResponseHandler.unauthorized(res);
        return;
      }

      const body = req.body;

      // Check if it's an array of schedules or a single schedule
      if (Array.isArray(body.schedules)) {
        // Handle multiple schedules
        const schedulesData: CreateScheduleDto[] = body.schedules;
        const schedules = await scheduleService.createSchedules(req.user.id, schedulesData);

        ApiResponseHandler.created(res, 'Schedules created successfully', {
          schedules,
          count: schedules.length,
        });
      } else {
        // Handle single schedule (backward compatibility)
        const scheduleData: CreateScheduleDto = body;
        const schedule = await scheduleService.createSchedule(req.user.id, scheduleData);

        ApiResponseHandler.created(res, 'Schedule created successfully', { schedule });
      }
    } catch (error: any) {
      ApiResponseHandler.validationError(res, error.message);
    }
  }

  async getSchedules(req: Request, res: Response): Promise<void> {
    try {
      const professionalId = parseInt(req.query.professional_id as string);

      if (!professionalId) {
        ApiResponseHandler.validationError(res, 'Professional ID is required');
        return;
      }

      const schedules = await scheduleService.getSchedulesByProfessional(professionalId);

      ApiResponseHandler.success(res, 'Schedules with availability status fetched successfully', { schedules });
    } catch (error: any) {
      ApiResponseHandler.internalError(res, error.message);
    }
  }

  async deleteSchedule(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ApiResponseHandler.unauthorized(res);
        return;
      }

      const scheduleId = parseInt(req.params.id);
      await scheduleService.deleteSchedule(scheduleId, req.user.id);

      ApiResponseHandler.success(res, 'Schedule deleted successfully');
    } catch (error: any) {
      ApiResponseHandler.validationError(res, error.message);
    }
  }
}
