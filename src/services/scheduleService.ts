import prisma from '../config/database';
import { AvailableSlot } from '../interfaces';
import { CreateScheduleDto } from '../dtos';

export class ScheduleService {
  async createSchedule(userId: number, scheduleData: CreateScheduleDto): Promise<AvailableSlot> {
    const { date, startTime, endTime } = scheduleData;

    // Validate that the professional exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.role !== 'PROFESSIONAL') {
      throw new Error('Only professionals can create schedules');
    }

    // Check for overlapping schedules
    const overlappingSchedule = await prisma.availableSlot.findFirst({
      where: {
        userId,
        date: new Date(date),
        OR: [
          {
            AND: [
              { startTime: { lte: new Date(startTime) } },
              { endTime: { gt: new Date(startTime) } },
            ],
          },
          {
            AND: [
              { startTime: { lt: new Date(endTime) } },
              { endTime: { gte: new Date(endTime) } },
            ],
          },
        ],
      },
    });

    if (overlappingSchedule) {
      throw new Error('Schedule overlaps with existing time slot');
    }

    return await prisma.availableSlot.create({
      data: {
        userId,
        date: new Date(date),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
      include: {
        user: true,
      },
    });
  }

  async getSchedulesByProfessional(professionalId: number): Promise<AvailableSlot[]> {
    return await prisma.availableSlot.findMany({
      where: {
        userId: professionalId,
        // date: {
        //   gte: new Date(),
        // },
      },
      include: {
        user: true,
      },
      orderBy: {
        date: 'asc',
      },
    });
  }

  async deleteSchedule(scheduleId: number, userId: number): Promise<void> {
    const schedule = await prisma.availableSlot.findUnique({
      where: { id: scheduleId },
    });

    if (!schedule) {
      throw new Error('Schedule not found');
    }

    if (schedule.userId !== userId) {
      throw new Error('Unauthorized to delete this schedule');
    }

    await prisma.availableSlot.delete({
      where: { id: scheduleId },
    });
  }
}
