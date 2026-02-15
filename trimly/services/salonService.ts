import apiClient from '../utils/apiClient';
import {
  Salon,
  CreateSalonRequest,
  UpdateSalonRequest,
  Service,
  CreateServiceRequest,
  UpdateServiceRequest,
  GalleryImage,
  ListSalonsParams,
  ListServicesParams,
  PaginatedResponse,
  ServiceCategory,
} from '../types/salon.types';
import { ApiError } from '../types/auth.types';

/**
 * Salon Service
 * Handles all salon-related API calls
 */
class SalonService {
  /**
   * List all salons with optional filters
   * @param params - Query parameters for filtering
   * @returns Paginated list of salons
   */
  async listSalons(params?: ListSalonsParams): Promise<PaginatedResponse<Salon>> {
    try {
      const queryString = new URLSearchParams(
        params as Record<string, string>
      ).toString();
      const endpoint = `/salons/${queryString ? `?${queryString}` : ''}`;
      
      console.log('🔍 [SALON SERVICE] Fetching salons...');
      console.log('📍 Endpoint:', endpoint);
      console.log('📊 Params:', params);
      
      const response = await apiClient.get<any>(endpoint, false);
      
      console.log('✅ [SALON SERVICE] Raw API Response:', response);
      console.log('📋 Response type:', Array.isArray(response) ? 'Array' : 'Object');
      
      // Handle both array and paginated response formats
      const salonsArray = Array.isArray(response) ? response : (response.results || []);
      const count = Array.isArray(response) ? response.length : (response.count || 0);
      
      console.log('📦 Salons count:', count);
      console.log('📋 Salons array length:', salonsArray.length);
      
      // Transform response data to add computed fields and handle missing relations
      const transformedResults = salonsArray.map((salon: any) => {
        const reviews = Array.isArray(salon.salon_reviews) ? salon.salon_reviews : [];
        const portfolio = Array.isArray(salon.salon_portfolio) ? salon.salon_portfolio : [];
        const services = Array.isArray(salon.salon_services) ? salon.salon_services : [];

        const rating =
          reviews.length > 0
            ? reviews.reduce((acc: number, r: any) => acc + (r.rating || 0), 0) /
              reviews.length
            : 0;

        return {
          ...salon,
          location: salon.address || salon.location || '',
          rating,
          review_count: reviews.length,
          services,
          gallery: portfolio.map((p: any) => ({
            id: p.id,
            image: p.image,
            salon: p.salon,
            vendor: p.vendor,
            caption: p.caption,
            created_at: p.created_at,
          })),
        };
      });
      
      console.log('✨ [SALON SERVICE] Transformed results:', transformedResults.length);
      
      return {
        count: count,
        next: Array.isArray(response) ? null : (response.next || null),
        previous: Array.isArray(response) ? null : (response.previous || null),
        results: transformedResults,
      };
    } catch (error: any) {
      console.error('❌ [SALON SERVICE] List salons error:', error);
      console.error('❌ Error status:', error?.status);
      console.error('❌ Error message:', error?.message);
      console.error('❌ Error data:', error?.data);
      console.error('❌ Full error object:', JSON.stringify(error, null, 2));
      throw this.handleError(error);
    }
  }

  /**
   * Get salon details by ID
   * @param id - Salon ID
   * @returns Salon details with services and gallery
   */
  async getSalonById(id: string): Promise<Salon> {
    try {
      const response = await apiClient.get<Salon>(`/salons/${id}/`, false);
      
      // Transform response data
      return {
        ...response,
        location: response.address || `${response.latitude}, ${response.longitude}`,
        rating: response.salon_reviews?.length > 0
          ? response.salon_reviews.reduce((acc, r) => acc + r.rating, 0) / response.salon_reviews.length
          : 0,
        review_count: response.salon_reviews?.length || 0,
        services: response.salon_services,
        gallery: response.salon_portfolio.map(p => ({
          id: p.id,
          image: p.image,
          salon: p.salon,
          vendor: p.vendor,
          caption: p.caption,
          created_at: p.created_at,
        })),
      };
    } catch (error) {
      console.error('Get salon error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Create a new salon
   * @param data - Salon creation data
   * @returns Created salon
   */
  async createSalon(data: CreateSalonRequest): Promise<Salon> {
    try {
      const response = await apiClient.post<Salon>('/salons/', data, true);
      return response;
    } catch (error) {
      console.error('Create salon error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Update salon information
   * @param id - Salon ID
   * @param data - Updated salon data
   * @returns Updated salon
   */
  async updateSalon(id: string, data: UpdateSalonRequest): Promise<Salon> {
    try {
      const response = await apiClient.patch<Salon>(`/salons/${id}/`, data, true);
      return response;
    } catch (error) {
      console.error('Update salon error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * List services for a specific salon
   * @param salonId - Salon ID
   * @param params - Query parameters
   * @returns List of services
   */
  async listSalonServices(
    salonId: string,
    params?: ListServicesParams
  ): Promise<Service[]> {
    try {
      const queryString = new URLSearchParams(
        params as Record<string, string>
      ).toString();
      const endpoint = `/salons/${salonId}/services/${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiClient.get<Service[]>(endpoint, false);
      return response;
    } catch (error) {
      console.error('List salon services error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Create a new service for a salon
   * @param salonId - Salon ID
   * @param data - Service creation data
   * @returns Created service
   */
  async createSalonService(
    salonId: string,
    data: CreateServiceRequest
  ): Promise<Service> {
    try {
      const response = await apiClient.post<Service>(
        `/salons/${salonId}/services/`,
        data,
        true
      );
      return response;
    } catch (error) {
      console.error('Create salon service error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Update a salon service
   * @param salonId - Salon ID
   * @param serviceId - Service ID
   * @param data - Updated service data
   * @returns Updated service
   */
  async updateSalonService(
    salonId: string,
    serviceId: string,
    data: UpdateServiceRequest
  ): Promise<Service> {
    try {
      const response = await apiClient.patch<Service>(
        `/salons/${salonId}/services/${serviceId}/`,
        data,
        true
      );
      return response;
    } catch (error) {
      console.error('Update salon service error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get salon gallery images
   * @param salonId - Salon ID
   * @returns List of gallery images
   */
  async getSalonGallery(salonId: string): Promise<GalleryImage[]> {
    try {
      const response = await apiClient.get<GalleryImage[]>(
        `/salons/${salonId}/gallery/`,
        false
      );
      return response;
    } catch (error) {
      console.error('Get salon gallery error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Upload image to salon gallery
   * @param salonId - Salon ID
   * @param imageUri - Local image URI
   * @returns Uploaded gallery image
   */
  async uploadSalonGalleryImage(
    salonId: string,
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
        `/salons/${salonId}/gallery/`,
        formData,
        true
      );
      return response;
    } catch (error) {
      console.error('Upload salon gallery image error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get all service categories
   * @returns List of service categories
   */
  async getServiceCategories(): Promise<ServiceCategory[]> {
    try {
      let page = 1;
      let hasNext = true;
      const allCategories: ServiceCategory[] = [];

      while (hasNext) {
        const response = await apiClient.get<any>(`/category/?page=${page}`, false);
        const results = Array.isArray(response) ? response : (response.results || []);
        allCategories.push(...results);

        if (!Array.isArray(response) && response.next) {
          const nextUrl = response.next as string;
          try {
            const urlObj = new URL(nextUrl);
            const nextPageParam = urlObj.searchParams.get('page');
            if (nextPageParam) {
              const nextPage = parseInt(nextPageParam, 10);
              if (!isNaN(nextPage) && nextPage > page) {
                page = nextPage;
              } else {
                hasNext = false;
              }
            } else {
              hasNext = false;
            }
          } catch {
            hasNext = false;
          }
        } else {
          hasNext = false;
        }
      }

      return allCategories;
    } catch (error) {
      console.error('Get service categories error:', error);
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
const salonService = new SalonService();

export default salonService;
