/**
 * Booking Types
 * Types for booking-related API requests and responses
 */

import { User } from './auth.types';
import { Salon, Vendor, Service } from './salon.types';

// Booking Status
export type BookingStatus = 
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

// Booking
export interface Booking {
  id: string;
  customer: User | string;
  salon?: Salon | string | null;
  vendor?: Vendor | string | null;
  service: Service | string;
  date: string; // YYYY-MM-DD format
  time_slot: string; // HH:MM format
  status: BookingStatus;
  notes?: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
}

// Create Booking Request
export interface CreateBookingRequest {
  salon_id?: string;
  vendor_id?: string;
  service_id: string;
  date: string; // YYYY-MM-DD format
  time_slot: string; // HH:MM format
  notes?: string;
}

// Update Booking Request
export interface UpdateBookingRequest {
  status?: BookingStatus;
  date?: string;
  time_slot?: string;
  notes?: string;
}

// Cancel Booking Request
export interface CancelBookingRequest {
  reason?: string;
}

// List Bookings Query Parameters
export interface ListBookingsParams {
  status?: BookingStatus;
  date?: string;
  salon_id?: string;
  vendor_id?: string;
  page?: number;
  limit?: number;
}

// Review for Booking
export interface Review {
  id: string;
  booking_id: string;
  customer: User | string;
  salon?: Salon | string | null;
  vendor?: Vendor | string | null;
  rating: number; // 1-5
  comment: string;
  created_at: string;
  updated_at: string;
}
