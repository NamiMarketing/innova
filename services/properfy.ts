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

  // Property type/category - send multiple params for OR logic
  if (filters.category) {
    const categoryMap: Record<string, string> = {
      'house': 'RESIDENTIAL_HOUSE',
      'apartment': 'APARTMENT',
      'commercial': 'COMMERCIAL',
      'land': 'LAND',
      'farm': 'FARM',
    };
    
    const categories = (filters.category as string).split(',');
    categories.forEach(cat => {
      const properfyType = categoryMap[cat.trim()];
      if (properfyType) {
        params.append('chrType[]', properfyType);
      }
    });
  }

  // Price filters
  if (filters.minPrice) params.append('dcmMinPrice', filters.minPrice.toString());
  if (filters.maxPrice) params.append('dcmMaxPrice', filters.maxPrice.toString());

  // Location filters
  if (filters.city) params.append('chrAddressCity', filters.city);
  if (filters.neighborhood) {
    const neighborhoods = filters.neighborhood.split(',');
    neighborhoods.forEach(n => {
      const cleanedNeighborhood = n.trim();
      if (cleanedNeighborhood) {
        params.append('chrAddressDistrict[]', cleanedNeighborhood);
      }
    });
  }

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

export async function getFilterOptions(): Promise<{ cities: string[]; neighborhoodsByCity: Record<string, string[]>; types: string[] }> {
  try {
    // Fetch a batch of properties to extract unique values
    // Using a larger limit to get a good representation
    const { data } = await getProperties({ limit: 100 });
    
    const cities = Array.from(new Set(data.map(p => p.address.city).filter(Boolean))).sort();
    const types = Array.from(new Set(data.map(p => p.category).filter(Boolean))).sort();
    
    const neighborhoodsByCity: Record<string, string[]> = {};
    
    data.forEach(property => {
      const city = property.address.city;
      const neighborhood = property.address.neighborhood;
      
      if (city && neighborhood) {
        if (!neighborhoodsByCity[city]) {
          neighborhoodsByCity[city] = [];
        }
        if (!neighborhoodsByCity[city].includes(neighborhood)) {
          neighborhoodsByCity[city].push(neighborhood);
        }
      }
    });

    // Sort neighborhoods for each city
    Object.keys(neighborhoodsByCity).forEach(city => {
      neighborhoodsByCity[city].sort();
    });
    
    return { cities, neighborhoodsByCity, types };
  } catch (error) {
    console.error('Error fetching filter options:', error);
    return { cities: [], neighborhoodsByCity: {}, types: [] };
  }
}

export async function getExclusiveProperties(limit: number = 10): Promise<Property[]> {
  try {
    const allExclusive: Property[] = [];
    let page = 1;
    const batchSize = 50;
    const maxPages = 5; // Limite de segurança para evitar loop infinito (250 imóveis no máximo)
    
    // Busca em batches até ter exclusivos suficientes
    while (allExclusive.length < limit && page <= maxPages) {
      const { data, totalPages } = await getProperties({ 
        limit: batchSize, 
        page 
      });
      
      // Filtra os exclusivos da página atual
      const exclusiveInPage = data.filter(p => p.isExclusive);
      allExclusive.push(...exclusiveInPage);
      
      // Para se:
      // 1. Já temos exclusivos suficientes
      // 2. Não encontrou nenhum exclusivo nessa página
      // 3. Chegou na última página disponível
      if (allExclusive.length >= limit || exclusiveInPage.length === 0 || page >= totalPages) {
        break;
      }
      
      page++;
    }
    
    return allExclusive.slice(0, limit);
  } catch (error) {
    console.error('Error fetching exclusive properties:', error);
    return [];
  }
}

export async function getHighlightedProperties(limit: number = 10): Promise<Property[]> {
  try {
    // For highlighted/featured properties, get non-exclusive properties sorted by update date
    const { data } = await getProperties({ limit: 100 });
    
    // Filter out exclusive properties and sort by most recent update
    const highlighted = data
      .filter(p => !p.isExclusive) // Only non-exclusive properties for highlights
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, limit)
      .map(p => ({ ...p, highlighted: true }));
    
    return highlighted;
  } catch (error) {
    console.error('Error fetching highlighted properties:', error);
    return [];
  }
}

