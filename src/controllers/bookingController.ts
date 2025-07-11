import { Response } from 'express';
import { BookingService } from '../services/bookingService';
import { CreateBookingDto, UpdateBookingStatusDto } from '../dtos';
import { AuthRequest } from '../interfaces';

const bookingService = new BookingService();

export class BookingController {
  async createBooking(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const bookingData: CreateBookingDto = req.body;
      const booking = await bookingService.createBooking(req.user.id, bookingData);

      res.status(201).json({
        message: 'Booking created successfully',
        booking,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getMyBookings(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const bookings = await bookingService.getMyBookings(req.user.id, req.user.role);

      res.json({ bookings });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async cancelBooking(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const bookingId = parseInt(req.params.id);
      const statusData: UpdateBookingStatusDto = { status: 'CANCELLED' };

      const booking = await bookingService.updateBookingStatus(bookingId, req.user.id, statusData);

      res.json({
        message: 'Booking cancelled successfully',
        booking,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async confirmBooking(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const bookingId = parseInt(req.params.id);
      const statusData: UpdateBookingStatusDto = { status: 'CONFIRMED' };

      const booking = await bookingService.updateBookingStatus(bookingId, req.user.id, statusData);

      res.json({
        message: 'Booking confirmed successfully',
        booking,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
