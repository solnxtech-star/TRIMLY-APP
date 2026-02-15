import apiClient from '../utils/apiClient';
import {
  Vendor,
  Service,
  CreateServiceRequest,
  UpdateServiceRequest,
  GalleryImage,
  ListServicesParams,
  PaginatedResponse,
} from '../types/salon.types';
import { ApiError } from '../types/auth.types';

/**
 * Vendor Service
 * Handles all vendor-related API calls
 */
class VendorService {
  /**
   * List all vendors with optional filters
   * @param params - Query parameters for filtering
   * @returns Paginated list of vendors
   */
  async listVendors(params?: Record<string, string>): Promise<PaginatedResponse<Vendor>> {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/vendors/${queryString ? `?${queryString}` : ''}`;
      
      console.log('🔍 [VENDOR SERVICE] Fetching vendors...');
      console.log('📍 Endpoint:', endpoint);
      console.log('📊 Params:', params);
      
      const response = await apiClient.get<any>(endpoint, false);
      
      console.log('✅ [VENDOR SERVICE] Raw API Response:', response);
      console.log('📋 Response type:', Array.isArray(response) ? 'Array' : 'Object');
      
      // Handle both array and paginated response formats
      const vendorsArray = Array.isArray(response) ? response : (response.results || []);
      const count = Array.isArray(response) ? response.length : (response.count || 0);
      
      console.log('📦 Vendors count:', count);
      console.log('📋 Vendors array length:', vendorsArray.length);
      
      // Transform response data to add computed fields
      const transformedResults = vendorsArray.map((vendor: any) => ({
        ...vendor,
        rating: vendor.vendor_reviews?.length > 0
          ? vendor.vendor_reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / vendor.vendor_reviews.length
          : 0,
        review_count: vendor.vendor_reviews?.length || 0,
        services: vendor.vendor_services,
        gallery: vendor.vendor_portfolio,
      }));
      
      console.log('✨ [VENDOR SERVICE] Transformed results:', transformedResults.length);
      console.log('📝 Sample vendor:', transformedResults[0]);
      
      return {
        count: count,
        next: Array.isArray(response) ? null : (response.next || null),
        previous: Array.isArray(response) ? null : (response.previous || null),
        results: transformedResults,
      };
    } catch (error: any) {
      console.error('❌ [VENDOR SERVICE] List vendors error:', error);
      console.error('❌ Error status:', error?.status);
      console.error('❌ Error message:', error?.message);
      console.error('❌ Error data:', error?.data);
      console.error('❌ Full error object:', JSON.stringify(error, null, 2));
      throw this.handleError(error);
    }
  }

  /**
   * Get vendor details by ID
   * @param id - Vendor ID
   * @returns Vendor details with services and gallery
   */
  async getVendorById(id: string): Promise<Vendor> {
    try {
      const response = await apiClient.get<any>(`/vendors/${id}/`, false);
      
      // Transform response data
      return {
        ...response,
        rating: response.vendor_reviews?.length > 0
          ? response.vendor_reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / response.vendor_reviews.length
          : 0,
        review_count: response.vendor_reviews?.length || 0,
        services: response.vendor_services,
        gallery: response.vendor_portfolio,
      };
    } catch (error) {
      console.error('Get vendor error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get available time slots for a vendor
   * @param vendorId - Vendor ID
   * @param date - Date in YYYY-MM-DD format
   * @param serviceId - Optional service ID
   * @returns Available time slots
   */
  async getAvailableSlots(
    vendorId: string,
    date: string,
    serviceId?: string
  ): Promise<{ date: string; available_slots: string[] }> {
    try {
      const params = new URLSearchParams({ date });
      if (serviceId) {
        params.append('service_id', serviceId);
      }
      
      const response = await apiClient.get<{ date: string; available_slots: string[] }>(
        `/vendors/${vendorId}/available-slots/?${params.toString()}`,
        false
      );
      return response;
    } catch (error) {
      console.error('Get available slots error:', error);
      throw this.handleError(error);
    }
  }

  async getAvailability(
    vendorId: string
  ): Promise<
    {
      id: string;
      day_of_week: number;
      start_time: string;
      end_time: string;
      salon: string | null;
      vendor: string | null;
    }[]
  > {
    try {
      const response = await apiClient.get<PaginatedResponse<any> | any>(
        `/vendors/${vendorId}/availability/`,
        true
      );

      if (Array.isArray(response)) {
        return response;
      }

      return (response.results || []) as any[];
    } catch (error) {
      console.error('Get vendor availability error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * List services for a specific vendor
   * @param vendorId - Vendor ID
   * @param params - Query parameters
   * @returns List of services
   */
  async listVendorServices(
    vendorId: string,
    params?: ListServicesParams
  ): Promise<Service[]> {
    try {
      const queryString = new URLSearchParams(
        params as Record<string, string>
      ).toString();
      const endpoint = `/vendors/${vendorId}/services/${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiClient.get<Service[]>(endpoint, false);
      return response;
    } catch (error) {
      console.error('List vendor services error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Create a new service for a vendor
   * @param vendorId - Vendor ID
   * @param data - Service creation data
   * @returns Created service
   */
  async createVendorService(
    vendorId: string,
    data: CreateServiceRequest
  ): Promise<Service> {
    try {
      const response = await apiClient.post<Service>(
        `/vendors/${vendorId}/services/`,
        data,
        true
      );
      return response;
    } catch (error) {
      console.error('Create vendor service error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Update a vendor service
   * @param vendorId - Vendor ID
   * @param serviceId - Service ID
   * @param data - Updated service data
   * @returns Updated service
   */
  async updateVendorService(
    vendorId: string,
    serviceId: string,
    data: UpdateServiceRequest
  ): Promise<Service> {
    try {
      const response = await apiClient.patch<Service>(
        `/vendors/${vendorId}/services/${serviceId}/`,
        data,
        true
      );
      return response;
    } catch (error) {
      console.error('Update vendor service error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get vendor gallery images
   * @param vendorId - Vendor ID
   * @returns List of gallery images
   */
  async getVendorGallery(vendorId: string): Promise<GalleryImage[]> {
    try {
      const response = await apiClient.get<GalleryImage[]>(
        `/vendors/${vendorId}/gallery/`,
        false
      );
      return response;
    } catch (error) {
      console.error('Get vendor gallery error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Upload image to vendor gallery
   * @param vendorId - Vendor ID
   * @param imageUri - Local image URI
   * @returns Uploaded gallery image
   */
  async uploadVendorGalleryImage(
    vendorId: string,
    imageUri: string
  ): Promise<GalleryImage> {
    try {
      const formData = new FormData();
      
      // Create file object from URI
      const filename = imageUri.split('/').pop() || 'image.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      
      formData.append('image', {
        uri: imageUri,
        name: filename,
        type,
      } as any);

      const response = await apiClient.upload<GalleryImage>(
        `/vendors/${vendorId}/gallery/`,
        formData,
        true
      );
      return response;
    } catch (error) {
      console.error('Upload vendor gallery image error:', error);
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
const vendorService = new VendorService();

export default vendorService;
