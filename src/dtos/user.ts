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
}

export interface UserResponseDto {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'PROFESSIONAL' | 'CLIENT';
  createdAt?: Date;
  updatedAt?: Date;
}
