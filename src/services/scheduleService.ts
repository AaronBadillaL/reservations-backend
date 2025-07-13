import prisma from '../config/database';
import { ScheduleResponseDto, CreateScheduleDto } from '../dtos';
import { transformScheduleToResponse } from '../utils/apiResponse';

export class ScheduleService {
  async createSchedule(userId: number, scheduleData: CreateScheduleDto): Promise<ScheduleResponseDto> {
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

    const schedule = await prisma.availableSlot.create({
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

    return transformScheduleToResponse(schedule);
  }

  async createSchedules(userId: number, schedulesData: CreateScheduleDto[]): Promise<ScheduleResponseDto[]> {
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

    // Validate each schedule and check for overlaps
    const createdSchedules: ScheduleResponseDto[] = [];
    const errors: string[] = [];

    for (let i = 0; i < schedulesData.length; i++) {
      const scheduleData = schedulesData[i];
      const { date, startTime, endTime } = scheduleData;

      try {
        // Check for overlapping schedules with existing ones
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
          errors.push(`Schedule ${i + 1} overlaps with existing time slot`);
          continue;
        }

        // Check for overlaps within the current batch
        const hasOverlapInBatch = createdSchedules.some((existingSchedule) => {
          const existingStart = new Date(existingSchedule.startTime);
          const existingEnd = new Date(existingSchedule.endTime);
          const newStart = new Date(startTime);
          const newEnd = new Date(endTime);
          const existingDate = new Date(existingSchedule.date);
          const newDate = new Date(date);

          return (
            existingDate.getTime() === newDate.getTime() &&
            ((newStart >= existingStart && newStart < existingEnd) ||
              (newEnd > existingStart && newEnd <= existingEnd) ||
              (newStart <= existingStart && newEnd >= existingEnd))
          );
        });

        if (hasOverlapInBatch) {
          errors.push(`Schedule ${i + 1} overlaps with another schedule in the batch`);
          continue;
        }

        const schedule = await prisma.availableSlot.create({
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

        createdSchedules.push(transformScheduleToResponse(schedule));
      } catch (error: any) {
        errors.push(`Schedule ${i + 1}: ${error.message}`);
      }
    }

    if (errors.length > 0) {
      throw new Error(`Some schedules could not be created: ${errors.join(', ')}`);
    }

    return createdSchedules;
  }

  async getSchedulesByProfessional(professionalId: number): Promise<any[]> {
    // Obtener todos los horarios disponibles del profesional
    const schedules = await prisma.availableSlot.findMany({
      where: {
        userId: professionalId,
        // date: {
        //   gte: new Date(),
        // },
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Para cada horario, verificar si está reservado (incluyendo pending)
    const schedulesWithStatus = await Promise.all(
      schedules.map(async (schedule) => {
        // Buscar si existe una reserva que coincida por startTime y endTime
        const booking = await prisma.booking.findFirst({
          where: {
            professionalId: professionalId,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
          },
        });

        // Determinar el estado del horario basado en el booking
        let status: 'AVAILABLE' | 'RESERVED' | 'PENDING' | 'CANCELLED' = 'AVAILABLE';

        if (booking) {
          switch (booking.status.toLowerCase()) {
          case 'confirmed':
            status = 'RESERVED';
            break;
          case 'pending':
            status = 'PENDING';
            break;
          case 'cancelled':
            status = 'CANCELLED';
            break;
          default:
            status = 'RESERVED';
          }
        }

        return {
          status,
          id: schedule.id,
          userId: schedule.userId,
          date: schedule.date,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
        };
      }),
    );

    return schedulesWithStatus;
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
