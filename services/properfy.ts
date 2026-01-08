import { Property, PropertyFilters, PropertyResponse } from '@/types/property';
import { mapProperfyResponse, mapProperfyProperty } from './properfy-mapper';
import { api } from './api';
import { PROPERTY_TYPES } from '@/constants/property-types';

// Category to Properfy chrType mapping
const CATEGORY_MAP: Record<string, string[]> = {
  house: [
    'RESIDENTIAL_HOUSE',
    'TOWNHOUSE_IN_CONDOMINIUM',
    'TWO_STORY_HOUSE',
    'CONDOMINIUM_HOUSE',
  ],
  apartment: ['APARTMENT', 'PENTHOUSE', 'STUDIO'],
  commercial: ['SHOP', 'OFFICES', 'COMMERCIAL_HOUSE'],
  land: ['RESIDENTIAL_PLOT'],
  farm: ['FARM', 'RURAL_PROPERTY'],
};

// Helper function to build base params without category
function buildBaseParams(filters: PropertyFilters): URLSearchParams {
  const params = new URLSearchParams();

  // Pagination
  if (filters.page) params.append('page', filters.page.toString());
  const limit = filters.limit || 1000;
  params.append('size', limit.toString());

  // If a code is provided, ignore all other filters - search only by code
  if (filters.code) {
    params.append('chrReference', filters.code);
    params.append('chrStatus', 'LISTED');
    params.append('chrOrder', 'lesser_value');
    return params;
  }

  // Transaction type (sale/rent)
  if (filters.type) {
    const transactionType = filters.type === 'sale' ? 'SALE' : 'RENT';
    params.append('chrTransactionType', transactionType);
  }

  // Price filters
  if (filters.minPrice)
    params.append('dcmMinPrice', filters.minPrice.toString());
  if (filters.maxPrice)
    params.append('dcmMaxPrice', filters.maxPrice.toString());

  // Location filters
  if (filters.city) params.append('chrAddressCity', filters.city);
  if (filters.neighborhood) {
    const neighborhoods = filters.neighborhood.split(',');
    neighborhoods.forEach((n) => {
      const cleanedNeighborhood = n.trim();
      if (cleanedNeighborhood) {
        params.append('chrAddressDistrict[]', cleanedNeighborhood);
      }
    });
  }

  // Feature filters
  if (filters.minBedrooms)
    params.append('intMinBedrooms', filters.minBedrooms.toString());
  if (filters.minBathrooms)
    params.append('intBathrooms', filters.minBathrooms.toString());
  if (filters.minSuites)
    params.append('intSuites', filters.minSuites.toString());
  if (filters.minParkingSpaces)
    params.append('intGarage', filters.minParkingSpaces.toString());
  if (filters.minArea) params.append('dcmMinArea', filters.minArea.toString());
  if (filters.maxArea) params.append('dcmMaxArea', filters.maxArea.toString());

  // Only show listed properties
  params.append('chrStatus', 'LISTED');

  // Default sorting by price
  params.append('chrOrder', 'lesser_value');

  return params;
}

// Fetch properties for a single chrType
async function fetchPropertiesForType(
  baseParams: URLSearchParams,
  chrType: string
): Promise<Property[]> {
  const params = new URLSearchParams(baseParams);
  params.append('chrType', chrType);

  const endpoint = `api/property/shared?${params.toString()}`;
  const response = await api(endpoint).json<unknown>();
  const result = mapProperfyResponse(response as never);
  return result.data;
}

export async function getProperties(
  filters: PropertyFilters = {}
): Promise<PropertyResponse> {
  const baseParams = buildBaseParams(filters);

  let allProperties: Property[] = [];

  // If searching by code, skip category/type filtering - search directly
  if (filters.code) {
    const endpoint = `api/property/shared?${baseParams.toString()}`;
    const response = await api(endpoint).json<unknown>();
    const result = mapProperfyResponse(response as never);
    allProperties = result.data;
  } else {
    // Collect chrTypes to fetch
    const chrTypesToFetch: string[] = [];

    // First, check if we have chrTypes filter (new way)
    if (filters.chrTypes) {
      const types = filters.chrTypes.split(',').map((t) => t.trim());
      chrTypesToFetch.push(...types);
    }
    // Otherwise, check if we have category filter (legacy way)
    else if (filters.category) {
      const categories = (filters.category as string)
        .split(',')
        .map((c) => c.trim());

      categories.forEach((cat) => {
        const properfyTypes = CATEGORY_MAP[cat];
        if (properfyTypes) {
          chrTypesToFetch.push(...properfyTypes);
        }
      });
    }

    // If we have specific chrTypes to fetch, make parallel requests
    if (chrTypesToFetch.length > 0) {
      // Properfy API only accepts one chrType at a time, so we need to make parallel requests
      const promises = chrTypesToFetch.map((chrType) =>
        fetchPropertiesForType(baseParams, chrType)
      );

      const results = await Promise.all(promises);
      allProperties = results.flat();

      // Remove duplicates by id
      const seen = new Set<string>();
      allProperties = allProperties.filter((p) => {
        if (seen.has(p.id)) return false;
        seen.add(p.id);
        return true;
      });
    } else {
      // No type filter - just fetch normally
      const endpoint = `api/property/shared?${baseParams.toString()}`;
      const response = await api(endpoint).json<unknown>();
      const result = mapProperfyResponse(response as never);
      allProperties = result.data;
    }
  }

  // Client-side amenity filtering
  if (filters.amenities && filters.amenities.length > 0) {
    allProperties = allProperties.filter((property) => {
      return filters.amenities!.every((amenity) => {
        const amenityValue =
          property.amenities[amenity as keyof typeof property.amenities];
        return amenityValue === true;
      });
    });
  }

  return {
    data: allProperties,
    total: allProperties.length,
    page: filters.page || 1,
    limit: filters.limit || 1000,
    totalPages: Math.ceil(allProperties.length / (filters.limit || 1000)),
  };
}

export async function getPropertiesByIds(
  ids: string[]
): Promise<PropertyResponse> {
  try {
    const promises = ids.map((id) => getPropertyById(id));
    const results = await Promise.all(promises);

    const properties = results.filter((p): p is Property => p !== null);

    return {
      data: properties,
      total: properties.length,
      page: 1,
      limit: ids.length,
      totalPages: 1,
    };
  } catch (error) {
    console.error('Error fetching properties by ids:', error);
    return {
      data: [],
      total: 0,
      page: 1,
      limit: 0,
      totalPages: 0,
    };
  }
}

export async function getPropertyById(id: string): Promise<Property | null> {
  try {
    const endpoint = `api/property/property/${id}`;
    const response = await api(endpoint).json<unknown>();
    const mapped = mapProperfyProperty(response as never);
    return mapped;
  } catch (error) {
    console.error('Error fetching property:', error);
    return null;
  }
}

export async function getFilterOptions(): Promise<{
  cities: string[];
  neighborhoodsByCity: Record<string, string[]>;
  types: Array<{ value: string; text: string }>;
}> {
  try {
    // Fetch up to 1000 properties to extract unique values
    const { data } = await getProperties({ limit: 1000 });

    const cities = Array.from(
      new Set(data.map((p) => p.address.city).filter(Boolean))
    ).sort();

    // Get unique chrTypes and map them to objects with value and text
    const uniqueChrTypes = Array.from(
      new Set(data.map((p) => p.chrType).filter(Boolean))
    ).sort();

    const types = uniqueChrTypes.map((chrType) => ({
      value: chrType,
      text: PROPERTY_TYPES.find((t) => t.value === chrType)?.text || chrType,
    }));

    const neighborhoodsByCity: Record<string, string[]> = {};

    data.forEach((property) => {
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
    Object.keys(neighborhoodsByCity).forEach((city) => {
      neighborhoodsByCity[city].sort();
    });

    return { cities, neighborhoodsByCity, types };
  } catch (error) {
    console.error('Error fetching filter options:', error);
    return { cities: [], neighborhoodsByCity: {}, types: [] };
  }
}

export async function getExclusiveProperties(
  limit: number = 10
): Promise<Property[]> {
  try {
    const allExclusive: Property[] = [];
    let page = 1;
    const batchSize = 50;
    const maxPages = 5; // Limite de segurança para evitar loop infinito (250 imóveis no máximo)

    // Busca em batches até ter exclusivos suficientes
    while (allExclusive.length < limit && page <= maxPages) {
      const { data, totalPages } = await getProperties({
        limit: batchSize,
        page,
      });

      // Filtra os exclusivos da página atual
      const exclusiveInPage = data.filter((p) => p.isExclusive);
      allExclusive.push(...exclusiveInPage);

      // Para se:
      // 1. Já temos exclusivos suficientes
      // 2. Não encontrou nenhum exclusivo nessa página
      // 3. Chegou na última página disponível
      if (
        allExclusive.length >= limit ||
        exclusiveInPage.length === 0 ||
        page >= totalPages
      ) {
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

export async function getHighlightedProperties(
  limit: number = 10
): Promise<Property[]> {
  try {
    // For highlighted/featured properties, get non-exclusive properties sorted by update date
    const { data } = await getProperties({ limit: 100 });

    // Filter out exclusive properties and sort by most recent update
    const highlighted = data
      .filter((p) => !p.isExclusive) // Only non-exclusive properties for highlights
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .slice(0, limit)
      .map((p) => ({ ...p, highlighted: true }));

    return highlighted;
  } catch (error) {
    console.error('Error fetching highlighted properties:', error);
    return [];
  }
}
