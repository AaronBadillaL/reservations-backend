import { User } from './user';

export interface Booking {
  id: number;
  clientId: number;
  professionalId: number;
  date: Date;
  startTime: Date;
  endTime: Date;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  client?: User;
  professional?: User;
}
