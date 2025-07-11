export * from './user';
export * from './schedule';
export * from './booking';

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'PROFESSIONAL' | 'CLIENT';
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
}

export interface CreateScheduleDto {
  date: string;
  startTime: string;
  endTime: string;
}

export interface CreateBookingDto {
  professionalId: number;
  date: string;
  startTime: string;
  endTime: string;
}

export interface UpdateBookingStatusDto {
  status: 'CONFIRMED' | 'CANCELLED';
}
