import { UserResponseDto } from './user';

export interface NotificationResponseDto {
  id: number;
  userId: number;
  message: string;
  read: boolean;
  user?: UserResponseDto;
}
