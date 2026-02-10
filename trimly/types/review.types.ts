/**
 * Review Types
 * Types for review-related API requests and responses
 */

import { User } from './auth.types';

// Review
export interface Review {
  id: string;
  rating: number; // 1-5
  comment: string;
  customer: User | string;
  booking_id?: string;
  salon_id?: string;
  vendor_id?: string;
  created_at: string;
  updated_at: string;
}

// Create Review Request
export interface CreateReviewRequest {
  rating: number; // 1-5
  comment: string;
  booking_id?: string;
}

// Update Review Request
export interface UpdateReviewRequest {
  rating?: number;
  comment?: string;
}

// List Reviews Query Parameters
export interface ListReviewsParams {
  rating?: number;
  sort?: 'recent' | 'highest' | 'lowest';
  page?: number;
  limit?: number;
}
