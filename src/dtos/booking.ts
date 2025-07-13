import { UserResponseDto } from './user';

export interface CreateBookingDto {
  professionalId: number;
  date: string;
  startTime: string;
  endTime: string;
}

export interface UpdateBookingStatusDto {
  status: 'CONFIRMED' | 'CANCELLED';
}

export interface BookingResponseDto {
  id: number;
  clientId: number;
  professionalId: number;
  date: Date;
  startTime: Date;
  endTime: Date;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  client?: UserResponseDto;
  professional?: UserResponseDto;
}
