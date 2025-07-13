import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const userController = new UserController();

// Public routes
router.post('/', userController.createUser.bind(userController));
router.post('/login', userController.login.bind(userController));

// Protected routes
router.get('/me', authMiddleware, userController.getProfile.bind(userController));
router.put('/me', authMiddleware, userController.updateUser.bind(userController));

export default router;
