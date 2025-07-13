import prisma from '../config/database';
import { CreateBookingDto, UpdateBookingStatusDto, BookingResponseDto } from '../dtos';
import { EmailService } from '../utils/emailService';
import { transformBookingToResponse } from '../utils/apiResponse';

export class BookingService {
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  async createBooking(clientId: number, bookingData: CreateBookingDto): Promise<BookingResponseDto> {
    const { professionalId, date, startTime, endTime } = bookingData;
    // Check if professional exists and is a professional
    const professional = await prisma.user.findUnique({
      where: { id: professionalId },
    });

    if (!professional || professional.role !== 'PROFESSIONAL') {
      throw new Error('Professional not found');
    }

    // Check if the time slot is available
    const availableSlot = await prisma.availableSlot.findFirst({
      where: {
        userId: professionalId,
        date: new Date(date),
        startTime: { lte: new Date(startTime) },
        endTime: { gte: new Date(endTime) },
      },
    });

    if (!availableSlot) {
      throw new Error('Time slot not available');
    }

    // Check if there's already a booking for this time slot
    const existingBooking = await prisma.booking.findFirst({
      where: {
        professionalId,
        date: new Date(date),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status: {
          not: 'CANCELLED',
        },
      },
    });

    if (existingBooking) {
      throw new Error('Time slot already booked');
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        clientId,
        professionalId,
        date: new Date(date),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status: 'PENDING',
      },
      include: {
        client: true,
        professional: true,
      },
    });

    // Create notification for professional
    await prisma.notification.create({
      data: {
        userId: professionalId,
        message: `New booking request from ${booking.client?.name} for ${new Date(date).toLocaleDateString()}`,
      },
    });

    // Send email notification to professional
    await this.emailService.sendNewBookingNotification(
      booking.professional?.email || '',
      booking,
    );

    return transformBookingToResponse(booking);
  }

  async getMyBookings(userId: number, role: string): Promise<BookingResponseDto[]> {
    const whereClause = role === 'CLIENT'
      ? { clientId: userId }
      : { professionalId: userId };

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        client: true,
        professional: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    return bookings.map(booking => transformBookingToResponse(booking));
  }

  async updateBookingStatus(
    bookingId: number,
    userId: number,
    statusData: UpdateBookingStatusDto,
  ): Promise<BookingResponseDto> {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        client: true,
        professional: true,
      },
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    // Only professional can confirm/cancel bookings
    if (booking.professionalId !== userId) {
      throw new Error('Unauthorized to update this booking');
    }

    // Validate client email exists for confirmation
    if (statusData.status === 'CONFIRMED' && !booking.client?.email) {
      throw new Error('Cannot confirm booking: Client email not found');
    }

    // For confirmation, try to send email BEFORE updating the database
    if (statusData.status === 'CONFIRMED') {
      try {
        // Create temporary booking object for email
        const tempBooking = {
          ...booking,
          status: 'CONFIRMED',
        };

        await this.emailService.sendBookingConfirmation(
          booking.client?.email || '',
          tempBooking,
        );
      } catch (error) {
        console.error('Failed to send confirmation email:', error);
        throw new Error('Cannot confirm booking: Failed to send confirmation email to client');
      }
    }

    // If we reach here, email was sent successfully (for confirmations) or it's a cancellation
    // Now update the database
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: statusData.status,
      },
      include: {
        client: true,
        professional: true,
      },
    });

    // Create notification for client
    const message = statusData.status === 'CONFIRMED'
      ? `Your booking with ${booking.professional?.name} has been confirmed`
      : `Your booking with ${booking.professional?.name} has been cancelled`;

    await prisma.notification.create({
      data: {
        userId: booking.clientId,
        message,
      },
    });

    // Send email for cancellations (confirmations already sent above)
    if (statusData.status === 'CANCELLED') {
      try {
        await this.emailService.sendBookingCancellation(
          booking.client?.email || '',
          updatedBooking,
        );
      } catch (error) {
        console.error('Failed to send cancellation email:', error);
        // For cancellations, we don't fail the operation if email fails
        // The booking is still cancelled, but we log the email failure
      }
    }

    return transformBookingToResponse(updatedBooking);
  }
}
