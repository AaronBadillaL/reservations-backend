import { User } from './user';

export interface AvailableSlot {
  id: number;
  userId: number;
  date: Date;
  startTime: Date;
  endTime: Date;
  user?: User;
}
