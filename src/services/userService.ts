import prisma from '../config/database';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from '../interfaces';
import { CreateUserDto, LoginDto, UpdateUserDto } from '../dtos';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export class UserService {
  async createUser(userData: CreateUserDto): Promise<User> {
    const { email, password, name, role = 'CLIENT' } = userData;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      },
    });

    return user;
  }

  async login(loginData: LoginDto): Promise<{ user: User; token: string }> {
    const { email, password } = loginData;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' },
    );

    return { user, token };
  }

  async getUserById(id: number): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  async updateUser(id: number, userData: UpdateUserDto): Promise<User> {
    const updateData: any = {};

    if (userData.name) updateData.name = userData.name;
    if (userData.email) updateData.email = userData.email;
    if (userData.password) {
      updateData.password = await bcrypt.hash(userData.password, 10);
    }

    return await prisma.user.update({
      where: { id },
      data: updateData,
    });
  }
}
