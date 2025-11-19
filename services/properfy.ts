import { Property, PropertyFilters, PropertyResponse } from '@/types/property';
import { env } from '@/lib/env';
import { authService } from './auth';
import { mapProperfyResponse } from './properfy-mapper';

class ProperfyService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = env.PROPERFY_API_URL;
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = await authService.getToken();

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options?.headers,
    };

    const url = `${this.baseUrl}${endpoint}`;
    console.log('Properfy API Request:', url);

    const response = await fetch(url, {
      ...options,
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Properfy API Error: ${response.statusText} (${response.status})`;

      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // If response is not JSON, use the text
        if (errorText) {
          errorMessage = `${errorMessage} - ${errorText}`;
        }
      }

      console.error('Properfy API Error:', { url, status: response.status, errorMessage });
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async getProperties(filters: PropertyFilters = {}): Promise<PropertyResponse> {
    const params = new URLSearchParams();

    // Pagination
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('size', filters.limit.toString());

    // Transaction type (sale/rent)
    if (filters.type) {
      const transactionType = filters.type === 'sale' ? 'SALE' : 'RENT';
      params.append('chrTransactionType', transactionType);
    }

    // Property type/category
    if (filters.category) {
      const categoryMap: Record<string, string> = {
        'house': 'RESIDENTIAL_HOUSE',
        'apartment': 'APARTMENT',
        'commercial': 'COMMERCIAL',
        'land': 'LAND',
        'farm': 'FARM',
      };
      const properfyType = categoryMap[filters.category];
      if (properfyType) {
        params.append('chrType', properfyType);
      }
    }

    // Price filters
    if (filters.minPrice) params.append('dcmMinPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.append('dcmMaxPrice', filters.maxPrice.toString());

    // Location filters
    if (filters.city) params.append('chrAddressCity', filters.city);
    if (filters.neighborhood) params.append('chrAddressDistrict', filters.neighborhood);

    // Feature filters
    if (filters.minBedrooms) params.append('intBedrooms', filters.minBedrooms.toString());
    if (filters.minBathrooms) params.append('intBathrooms', filters.minBathrooms.toString());
    if (filters.minParkingSpaces) params.append('intGarage', filters.minParkingSpaces.toString());
    if (filters.minArea) params.append('dcmMinArea', filters.minArea.toString());
    if (filters.maxArea) params.append('dcmMaxArea', filters.maxArea.toString());

    // Only show listed properties (using comma-separated instead of array notation)
    params.append('chrStatus', 'LISTED');

    // Default sorting by price
    params.append('chrOrder', 'lesser_value');

    const queryString = params.toString();
    const endpoint = `/api/property/shared${queryString ? `?${queryString}` : ''}`;

    console.log('Fetching properties with filters:', filters);
    console.log('Query string:', queryString);

    const response = await this.fetch<unknown>(endpoint);
    return mapProperfyResponse(response as never);
  }

  async getPropertyById(id: string): Promise<Property> {
    return this.fetch<Property>(`/api/property/property/${id}`);
  }

  async getPropertyByCode(code: string): Promise<Property> {
    return this.fetch<Property>(`/api/property/property?filter[chrReference]=${code}`);
  }

  async getHighlightedProperties(limit: number = 6): Promise<Property[]> {
    const response = await this.fetch<PropertyResponse>(
      `/api/property/property?highlighted=true&limit=${limit}`
    );
    return response.data;
  }

  async getCities(): Promise<string[]> {
    const response = await this.fetch<{ cities: string[] }>('/api/property/cities');
    return response.cities;
  }

  async getNeighborhoods(city: string): Promise<string[]> {
    const response = await this.fetch<{ neighborhoods: string[] }>(
      `/api/property/neighborhoods?city=${encodeURIComponent(city)}`
    );
    return response.neighborhoods;
  }
}

export const properfyService = new ProperfyService();
