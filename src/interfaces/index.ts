import { Request } from 'express';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'PROFESSIONAL' | 'CLIENT';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AvailableSlot {
  id: number;
  userId: number;
  date: Date;
  startTime: Date;
  endTime: Date;
  user?: User;
}

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

export interface Notification {
  id: number;
  userId: number;
  message: string;
  read: boolean;
  user?: User;
}

export interface AuthRequest extends Request {
  user?: User;
}

export * from './user';
export * from './schedule';
export * from './booking';
export * from './notification';
