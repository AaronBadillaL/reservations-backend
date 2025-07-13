import { Response } from 'express';
import { UserService } from '../services/userService';
import { CreateUserDto, LoginDto, UpdateUserDto } from '../dtos';
import { AuthRequest } from '../interfaces';
import { ApiResponseHandler } from '../utils/apiResponse';

const userService = new UserService();

// Helper function to omit password from user object
const omitPassword = (user: any) => {
  const userCopy = { ...user };
  delete userCopy.password;
  return userCopy;
};

export class UserController {
  async createUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userData: CreateUserDto = req.body;
      const user = await userService.createUser(userData);

      // Don't send password in response
      const userWithoutPassword = omitPassword(user);

      ApiResponseHandler.created(res, 'User created successfully', { user: userWithoutPassword });
    } catch (error: any) {
      ApiResponseHandler.validationError(res, error.message);
    }
  }

  async login(req: AuthRequest, res: Response): Promise<void> {
    try {
      const loginData: LoginDto = req.body;
      const { user, token } = await userService.login(loginData);

      // Don't send password in response
      const userWithoutPassword = omitPassword(user);
      ApiResponseHandler.success(res, 'Login successful', { user: userWithoutPassword, token });
    } catch (error: any) {
      ApiResponseHandler.unauthorized(res, error.message);
    }
  }

  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        ApiResponseHandler.unauthorized(res, 'User not authenticated');
        return;
      }

      const user = await userService.getUserById(userId);

      if (!user) {
        ApiResponseHandler.notFound(res, 'User not found');
        return;
      }

      // Don't send password in response
      const userWithoutPassword = omitPassword(user);

      ApiResponseHandler.success(res, 'Profile fetched successfully', { user: userWithoutPassword });
    } catch (error: any) {
      ApiResponseHandler.internalError(res, error.message);
    }
  }

  async updateUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const userData: UpdateUserDto = req.body;

      if (!userId) {
        ApiResponseHandler.unauthorized(res, 'User not authenticated');
        return;
      }

      // Validate that password is not being updated
      if ('password' in req.body) {
        ApiResponseHandler.validationError(res, 'Password cannot be updated through this endpoint. Use a dedicated password change endpoint.');
        return;
      }

      const user = await userService.updateUser(userId, userData);

      // Don't send password in response
      const userWithoutPassword = omitPassword(user);

      ApiResponseHandler.success(res, 'User updated successfully', { user: userWithoutPassword });
    } catch (error: any) {
      ApiResponseHandler.validationError(res, error.message);
    }
  }
}
