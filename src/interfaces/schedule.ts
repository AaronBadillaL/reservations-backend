import { User } from './user';

export interface AvailableSlot {
  id: number;
  userId: number;
  date: Date;
  startTime: Date;
  endTime: Date;
  user?: User;
  isAvailable?: boolean;
  status?: 'AVAILABLE' | 'RESERVED' | 'PENDING' | 'CANCELLED';
  booking?: {
    id: number;
    status: string;
    client: {
      id: number;
      name: string;
      email: string;
    };
  } | null;
}
