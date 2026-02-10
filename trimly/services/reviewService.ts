import apiClient from '../utils/apiClient';
import {
  Review,
  CreateReviewRequest,
  UpdateReviewRequest,
  ListReviewsParams,
} from '../types/review.types';
import { ApiError } from '../types/auth.types';

/**
 * Review Service
 * Handles all review-related API calls
 */
class ReviewService {
  /**
   * Create a review for a salon
   * @param salonId - Salon ID
   * @param data - Review data
   * @returns Created review
   */
  async createSalonReview(salonId: string, data: CreateReviewRequest): Promise<Review> {
    try {
      const response = await apiClient.post<Review>(
        `/salons/${salonId}/reviews/`,
        data,
        true
      );
      return response;
    } catch (error) {
      console.error('Create salon review error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * List reviews for a salon
   * @param salonId - Salon ID
   * @param params - Query parameters
   * @returns List of reviews
   */
  async listSalonReviews(salonId: string, params?: ListReviewsParams): Promise<Review[]> {
    try {
      const queryString = new URLSearchParams(
        params as Record<string, string>
      ).toString();
      const endpoint = `/salons/${salonId}/reviews/${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiClient.get<Review[]>(endpoint, false);
      return response;
    } catch (error) {
      console.error('List salon reviews error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Update own review
   * @param reviewId - Review ID
   * @param data - Updated review data
   * @returns Updated review
   */
  async updateReview(reviewId: string, data: UpdateReviewRequest): Promise<Review> {
    try {
      const response = await apiClient.patch<Review>(
        `/reviews/${reviewId}/`,
        data,
        true
      );
      return response;
    } catch (error) {
      console.error('Update review error:', error);
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
const reviewService = new ReviewService();

export default reviewService;
