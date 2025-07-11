import { Request, Response } from 'express';
import { ScheduleService } from '../services/scheduleService';
import { CreateScheduleDto } from '../dtos';
import { AuthRequest } from '../interfaces';

const scheduleService = new ScheduleService();

export class ScheduleController {
  async createSchedule(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const scheduleData: CreateScheduleDto = req.body;
      const schedule = await scheduleService.createSchedule(req.user.id, scheduleData);

      res.status(201).json({
        message: 'Schedule created successfully',
        schedule,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getSchedules(req: Request, res: Response): Promise<void> {
    try {
      const professionalId = parseInt(req.query.professional_id as string);

      if (!professionalId) {
        res.status(400).json({ error: 'Professional ID is required' });
        return;
      }

      const schedules = await scheduleService.getSchedulesByProfessional(professionalId);

      res.json({ schedules });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteSchedule(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const scheduleId = parseInt(req.params.id);
      await scheduleService.deleteSchedule(scheduleId, req.user.id);

      res.json({ message: 'Schedule deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
