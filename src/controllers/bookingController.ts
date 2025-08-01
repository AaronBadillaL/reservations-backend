import { Response } from 'express';
import { BookingService } from '../services/bookingService';
import { CreateBookingDto, UpdateBookingStatusDto } from '../dtos';
import { AuthRequest } from '../interfaces';
import { ApiResponseHandler } from '../utils/apiResponse';

const bookingService = new BookingService();

export class BookingController {
  async createBooking(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ApiResponseHandler.unauthorized(res);
        return;
      }

      const bookingData: CreateBookingDto = req.body;
      const booking = await bookingService.createBooking(req.user.id, bookingData);

      ApiResponseHandler.created(res, 'Booking created successfully', { booking });
    } catch (error: any) {
      ApiResponseHandler.validationError(res, error.message);
    }
  }

  async getMyBookings(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ApiResponseHandler.unauthorized(res);
        return;
      }

      const bookings = await bookingService.getMyBookings(req.user.id, req.user.role);

      ApiResponseHandler.success(res, 'Bookings fetched successfully', { bookings });
    } catch (error: any) {
      ApiResponseHandler.internalError(res, error.message);
    }
  }

  async cancelBooking(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ApiResponseHandler.unauthorized(res);
        return;
      }

      const bookingId = parseInt(req.params.id);
      const statusData: UpdateBookingStatusDto = { status: 'CANCELLED' };

      const booking = await bookingService.updateBookingStatus(bookingId, req.user.id, statusData);

      ApiResponseHandler.success(res, 'Booking cancelled successfully', { booking });
    } catch (error: any) {
      ApiResponseHandler.validationError(res, error.message);
    }
  }

  async confirmBooking(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ApiResponseHandler.unauthorized(res);
        return;
      }

      const bookingId = parseInt(req.params.id);
      const statusData: UpdateBookingStatusDto = { status: 'CONFIRMED' };

      const booking = await bookingService.updateBookingStatus(bookingId, req.user.id, statusData);

      ApiResponseHandler.success(res, 'Booking confirmed successfully', { booking });
    } catch (error: any) {
      ApiResponseHandler.validationError(res, error.message);
    }
  }
}
