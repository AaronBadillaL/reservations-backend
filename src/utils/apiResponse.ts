import { Response } from 'express';
import { BookingResponseDto, NotificationResponseDto, ScheduleResponseDto, UserResponseDto } from '../dtos';
import { User } from '../interfaces/user';

export class ApiResponseHandler {
  static success(res: Response, message: string, data?: any, statusCode: number = 200): void {
    res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  static created(res: Response, message: string, data?: any): void {
    this.success(res, message, data, 201);
  }

  static badRequest(res: Response, message: string = 'Bad Request'): void {
    res.status(400).json({
      success: false,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  static unauthorized(res: Response, message: string = 'Unauthorized'): void {
    res.status(401).json({
      success: false,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  static forbidden(res: Response, message: string = 'Forbidden'): void {
    res.status(403).json({
      success: false,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  static notFound(res: Response, message: string = 'Not Found'): void {
    res.status(404).json({
      success: false,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  static validationError(res: Response, message: string = 'Validation Error'): void {
    res.status(422).json({
      success: false,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  static internalError(res: Response, message: string = 'Internal Server Error'): void {
    res.status(500).json({
      success: false,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}

// Utility functions to transform data
export function transformUserToResponse(user: User): UserResponseDto {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function transformBookingToResponse(booking: any): BookingResponseDto {
  const transformedBooking: BookingResponseDto = {
    id: booking.id,
    clientId: booking.clientId,
    professionalId: booking.professionalId,
    date: booking.date,
    startTime: booking.startTime,
    endTime: booking.endTime,
    status: booking.status,
  };

  if (booking.client) {
    transformedBooking.client = transformUserToResponse(booking.client);
  }

  if (booking.professional) {
    transformedBooking.professional = transformUserToResponse(booking.professional);
  }

  return transformedBooking;
}

export function transformNotificationToResponse(notification: any): NotificationResponseDto {
  const transformedNotification: NotificationResponseDto = {
    id: notification.id,
    userId: notification.userId,
    message: notification.message,
    read: notification.read,
  };

  if (notification.user) {
    transformedNotification.user = transformUserToResponse(notification.user);
  }

  return transformedNotification;
}

export function transformScheduleToResponse(schedule: any): ScheduleResponseDto {
  const transformedSchedule: ScheduleResponseDto = {
    id: schedule.id,
    userId: schedule.userId,
    date: schedule.date,
    startTime: schedule.startTime,
    endTime: schedule.endTime,
  };

  if (schedule.user) {
    transformedSchedule.user = transformUserToResponse(schedule.user);
  }

  return transformedSchedule;
}
