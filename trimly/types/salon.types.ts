/**
 * Salon and Service Types
 * Types for salon-related API requests and responses
 */

// Service Category
export interface ServiceCategory {
  id: number;
  name: string;
  created_at?: string;
  description?: string;
  icon?: string;
}

// Service
export interface Service {
  salon?: string;
  name: string;
  description: string;
  price: string;
  duration_minutes: number;
  categories: ServiceCategory[];
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Gallery/Portfolio Image
export interface GalleryImage {
  id: string;
  salon?: string;
  vendor?: string | null;
  caption: string;
  image: string;
  created_at: string;
}

// Salon Review
export interface SalonReview {
  id: string;
  salon: string;
  user: string;
  rating: number;
  comment: string;
  created_at: string;
}

// Salon
export interface Salon {
  id: string;
  owner: string;
  name: string;
  category: ServiceCategory;
  about: string | null;
  address: string;
  latitude: string;
  longitude: string;
  profile_pic: string | null;
  salon_portfolio: GalleryImage[];
  links: string;
  created_at: string;
  is_open: boolean;
  salon_services: Service[];
  salon_reviews: SalonReview[];
  // Computed fields for compatibility
  location?: string;
  rating?: number;
  review_count?: number;
  services?: Service[];
  gallery?: GalleryImage[];
}

// Vendor
export interface Vendor {
  id: string;
  worker: string;
  bio: string;
  profile_pic?: string | null;
  years_of_experience: number;
  Gender: 'male' | 'female' | 'other';
  latitude?: string;
  longitude?: string;
  address?: string;
  rating?: number;
  review_count?: number;
  total_earnings?: number;
  is_active: boolean;
  is_available?: boolean;
  category: ServiceCategory;
  vendor_services: Service[];
  vendor_portfolio: GalleryImage[];
  vendor_reviews: any[];
  // Computed fields for compatibility
  services?: Service[];
  gallery?: GalleryImage[];
  created_at?: string;
  updated_at?: string;
}

// Create Salon Request
export interface CreateSalonRequest {
  name: string;
  description: string;
  location: string;
  address: string;
  phone_number: string;
  email?: string;
  latitude?: string;
  longitude?: string;
  opening_hours?: string;
}

// Update Salon Request
export interface UpdateSalonRequest {
  name?: string;
  description?: string;
  location?: string;
  address?: string;
  phone_number?: string;
  email?: string;
  latitude?: string;
  longitude?: string;
  opening_hours?: string;
}

// Create Service Request
export interface CreateServiceRequest {
  name: string;
  description: string;
  price: number;
  duration: number;
  category: number;
}

// Update Service Request
export interface UpdateServiceRequest {
  name?: string;
  description?: string;
  price?: number;
  duration?: number;
  category?: number;
  is_active?: boolean;
}

// List Salons Query Parameters
export interface ListSalonsParams {
  search?: string;
  location?: string;
  category?: string;
  page?: number;
  limit?: number;
}

// List Services Query Parameters
export interface ListServicesParams {
  category?: string;
  min_price?: number;
  max_price?: number;
  page?: number;
  limit?: number;
}

// Paginated Response
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
