import { User } from './user';

export interface Notification {
  id: number;
  userId: number;
  message: string;
  read: boolean;
  user?: User;
}
