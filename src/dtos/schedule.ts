import { UserResponseDto } from './user';

export interface CreateScheduleDto {
  date: string;
  startTime: string;
  endTime: string;
}

export interface CreateSchedulesDto {
  schedules: CreateScheduleDto[];
}

export interface ScheduleResponseDto {
  id: number;
  userId: number;
  date: Date;
  startTime: Date;
  endTime: Date;
  user?: UserResponseDto;
}
