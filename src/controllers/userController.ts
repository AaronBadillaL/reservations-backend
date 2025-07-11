import { Response } from 'express';
import { UserService } from '../services/userService';
import { CreateUserDto, LoginDto, UpdateUserDto } from '../dtos';
import { AuthRequest } from '../interfaces';

const userService = new UserService();

export class UserController {
  async createUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userData: CreateUserDto = req.body;
      const user = await userService.createUser(userData);

      // Don't send password in response
      const { password, ...userWithoutPassword } = user;

      res.status(201).json({
        message: 'User created successfully',
        user: userWithoutPassword,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req: AuthRequest, res: Response): Promise<void> {
    try {
      const loginData: LoginDto = req.body;
      const { user, token } = await userService.login(loginData);

      // Don't send password in response
      const { password, ...userWithoutPassword } = user;

      res.json({
        message: 'Login successful',
        user: userWithoutPassword,
        token,
      });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);

      // Users can only access their own profile
      if (req.user?.id !== userId) {
        res.status(403).json({ error: 'Unauthorized' });
        return;
      }

      const user = await userService.getUserById(userId);

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      // Don't send password in response
      const { password, ...userWithoutPassword } = user;

      res.json({ user: userWithoutPassword });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const userData: UpdateUserDto = req.body;

      // Users can only update their own profile
      if (req.user?.id !== userId) {
        res.status(403).json({ error: 'Unauthorized' });
        return;
      }
      //TODO: Check if the user is updating their own profile and is updated successfully
      const user = await userService.updateUser(userId, userData);

      // Don't send password in response
      const { password, ...userWithoutPassword } = user;

      res.json({
        message: 'User updated successfully',
        user: userWithoutPassword,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
