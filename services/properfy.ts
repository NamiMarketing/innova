import { Property, PropertyFilters, PropertyResponse } from '@/types/property';
import { mapProperfyResponse, mapProperfyProperty } from './properfy-mapper';
import { api } from './api';

export async function getProperties(filters: PropertyFilters = {}): Promise<PropertyResponse> {
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
  const endpoint = `api/property/shared${queryString ? `?${queryString}` : ''}`;

  const response = await api(endpoint).json<unknown>();
  return mapProperfyResponse(response as never);
}

export async function getPropertyById(id: string): Promise<Property | null> {
  try {
    const endpoint = `api/property/property/${id}`;
    const response = await api(endpoint).json<unknown>();
    return mapProperfyProperty(response as never);
  } catch (error) {
    console.error('Error fetching property:', error);
    return null;
  }
}
