import { Property, PropertyFilters, PropertyResponse } from '@/types/property';
import { env } from '@/lib/env';

class ProperfyService {
  private baseUrl: string;
  private apiKey: string;
  private clientId: string;

  constructor() {
    this.baseUrl = env.PROPERFY_API_URL;
    this.apiKey = env.PROPERFY_API_KEY;
    this.clientId = env.PROPERFY_CLIENT_ID;
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      'X-Client-Id': this.clientId,
      ...options?.headers,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`Properfy API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async getProperties(filters: PropertyFilters = {}): Promise<PropertyResponse> {
    const params = new URLSearchParams();

    if (filters.type) params.append('type', filters.type);
    if (filters.category) params.append('category', filters.category);
    if (filters.city) params.append('city', filters.city);
    if (filters.neighborhood) params.append('neighborhood', filters.neighborhood);
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.minBedrooms) params.append('minBedrooms', filters.minBedrooms.toString());
    if (filters.maxBedrooms) params.append('maxBedrooms', filters.maxBedrooms.toString());
    if (filters.minBathrooms) params.append('minBathrooms', filters.minBathrooms.toString());
    if (filters.minParkingSpaces) params.append('minParkingSpaces', filters.minParkingSpaces.toString());
    if (filters.minArea) params.append('minArea', filters.minArea.toString());
    if (filters.maxArea) params.append('maxArea', filters.maxArea.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    if (filters.amenities && filters.amenities.length > 0) {
      filters.amenities.forEach(amenity => params.append('amenities[]', amenity));
    }

    const queryString = params.toString();
    const endpoint = `/properties${queryString ? `?${queryString}` : ''}`;

    return this.fetch<PropertyResponse>(endpoint);
  }

  async getPropertyById(id: string): Promise<Property> {
    return this.fetch<Property>(`/properties/${id}`);
  }

  async getPropertyByCode(code: string): Promise<Property> {
    return this.fetch<Property>(`/properties/code/${code}`);
  }

  async getHighlightedProperties(limit: number = 6): Promise<Property[]> {
    const response = await this.fetch<PropertyResponse>(
      `/properties?highlighted=true&limit=${limit}`
    );
    return response.data;
  }

  async getCities(): Promise<string[]> {
    const response = await this.fetch<{ cities: string[] }>('/properties/cities');
    return response.cities;
  }

  async getNeighborhoods(city: string): Promise<string[]> {
    const response = await this.fetch<{ neighborhoods: string[] }>(
      `/properties/neighborhoods?city=${encodeURIComponent(city)}`
    );
    return response.neighborhoods;
  }
}

export const properfyService = new ProperfyService();
