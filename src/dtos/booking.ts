export interface CreateBookingDto {
  professionalId: number;
  date: string;
  startTime: string;
  endTime: string;
}

export interface UpdateBookingStatusDto {
  status: 'CONFIRMED' | 'CANCELLED';
}
