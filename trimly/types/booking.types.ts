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
  customer: string; // Changed to string based on user's API response
  salon_service?: string | null;
  vendor_service?: string | null;
  date: string; // YYYY-MM-DD format
  start_time: string; // ISO or HH:MM:SS format
  end_time: string;
  status: BookingStatus;
  payment_reference: string;
  is_rated: boolean;
  notes?: string;
  created_at: string;
  // Added helper fields that might be injected by service layer
  business_name?: string;
  salon_service_name?: string;
  vendor_service_name?: string;
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
