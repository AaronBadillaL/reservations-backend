export interface CreateScheduleDto {
  date: string;
  startTime: string;
  endTime: string;
}

export interface CreateSchedulesDto {
  schedules: CreateScheduleDto[];
}
