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

export interface AuthRequest extends Request {
  user?: User;
}
