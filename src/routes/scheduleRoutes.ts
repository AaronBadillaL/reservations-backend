import { Router } from 'express';
import { ScheduleController } from '../controllers/scheduleController';
import { authMiddleware, requireRole } from '../middlewares/auth';

const router = Router();
const scheduleController = new ScheduleController();

// Public route to view schedules
router.get('/', scheduleController.getSchedules);

// Protected routes (only professionals)
router.post('/', authMiddleware, requireRole(['PROFESSIONAL']), scheduleController.createSchedule.bind(scheduleController));
router.delete('/:id', authMiddleware, requireRole(['PROFESSIONAL']), scheduleController.deleteSchedule.bind(scheduleController));

export default router;
