import apiClient from '../utils/apiClient';
import {
  Booking,
  CreateBookingRequest,
  UpdateBookingRequest,
  CancelBookingRequest,
  ListBookingsParams,
} from '../types/booking.types';
import { PaginatedResponse } from '../types/salon.types';
import { ApiError } from '../types/auth.types';

/**
 * Booking Service
 * Handles all booking-related API calls
 */
class BookingService {
  /**
   * Create a new booking
   * @param data - Booking creation data
   * @returns Created booking
   */
  async createBooking(data: CreateBookingRequest): Promise<Booking> {
    try {
      const response = await apiClient.post<Booking>('/bookings/', data, true);
      return response;
    } catch (error) {
      console.error('Create booking error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Create a new booking with full details as per requirements
   * @param data - Detailed booking data
   * @returns Created booking
   */
  async confirmBooking(data: any): Promise<Booking> {
    try {
      const response = await apiClient.post<Booking>('/bookings/', data, true);
      return response;
    } catch (error) {
      console.error('Confirm booking error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * List bookings with optional filters (role-based)
   * @param params - Query parameters for filtering
   * @returns Paginated list of bookings
   */
  async listBookings(params?: ListBookingsParams): Promise<PaginatedResponse<Booking>> {
    try {
      const queryString = new URLSearchParams(
        params as Record<string, string>
      ).toString();
      const endpoint = `/bookings/${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiClient.get<PaginatedResponse<Booking>>(endpoint, true);
      return response;
    } catch (error) {
      console.error('List bookings error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get booking details by ID
   * @param id - Booking ID
   * @returns Booking details
   */
  async getBookingById(id: string): Promise<Booking> {
    try {
      const response = await apiClient.get<Booking>(`/bookings/${id}/`, true);
      return response;
    } catch (error) {
      console.error('Get booking error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Update booking information
   * @param id - Booking ID
   * @param data - Updated booking data
   * @returns Updated booking
   */
  async updateBooking(id: string, data: UpdateBookingRequest): Promise<Booking> {
    try {
      const response = await apiClient.patch<Booking>(`/bookings/${id}/`, data, true);
      return response;
    } catch (error) {
      console.error('Update booking error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Cancel a booking
   * @param id - Booking ID
   * @param data - Cancellation data (optional reason)
   * @returns Response message
   */
  async cancelBooking(id: string, data?: CancelBookingRequest): Promise<{ detail: string }> {
    try {
      const response = await apiClient.post<{ detail: string }>(
        `/bookings/${id}/cancel/`,
        data || {},
        true
      );
      return response;
    } catch (error) {
      console.error('Cancel booking error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Delete/cancel a booking (alternative method)
   * @param id - Booking ID
   * @returns Response message
   */
  async deleteBooking(id: string): Promise<{ detail: string }> {
    try {
      const response = await apiClient.delete<{ detail: string }>(`/bookings/${id}/`, true);
      return response;
    } catch (error) {
      console.error('Delete booking error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Mark booking as completed
   * @param id - Booking ID
   * @returns Updated booking
   */
  async completeBooking(id: string): Promise<Booking> {
    try {
      const response = await apiClient.post<Booking>(
        `/bookings/${id}/complete/`,
        {},
        true
      );
      return response;
    } catch (error) {
      console.error('Complete booking error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get user's upcoming bookings
   * @returns List of upcoming bookings
   */
  async getUpcomingBookings(): Promise<Booking[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await this.listBookings({
        status: 'confirmed',
      });
      
      // Filter for future dates
      return response.results.filter(booking => booking.date >= today);
    } catch (error) {
      console.error('Get upcoming bookings error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get user's completed bookings
   * @returns List of completed bookings
   */
  async getCompletedBookings(): Promise<Booking[]> {
    try {
      const response = await this.listBookings({
        status: 'completed',
      });
      return response.results;
    } catch (error) {
      console.error('Get completed bookings error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get user's cancelled bookings
   * @returns List of cancelled bookings
   */
  async getCancelledBookings(): Promise<Booking[]> {
    try {
      const response = await this.listBookings({
        status: 'cancelled',
      });
      return response.results;
    } catch (error) {
      console.error('Get cancelled bookings error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Handle and format API errors
   * @param error - Error object from API
   * @returns Formatted error
   */
  private handleError(error: any): ApiError {
    if (error.status && error.message) {
      return error as ApiError;
    }
    
    return {
      status: 500,
      message: error.message || 'An unexpected error occurred',
      data: error,
    };
  }
}

// Create and export a singleton instance
const bookingService = new BookingService();

export default bookingService;
