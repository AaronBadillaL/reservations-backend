import { Router } from 'express';
import { BookingController } from '../controllers/bookingController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const bookingController = new BookingController();

// All booking routes require authentication
router.post('/', authMiddleware, bookingController.createBooking.bind(bookingController));
router.get('/my-bookings', authMiddleware, bookingController.getMyBookings.bind(bookingController));
router.put('/:id/cancel', authMiddleware, bookingController.cancelBooking.bind(bookingController));
router.put('/:id/confirm', authMiddleware, bookingController.confirmBooking.bind(bookingController));

export default router;
