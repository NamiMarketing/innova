import { Property, PropertyType, PropertyCategory, PropertyStatus } from '@/types/property';

interface ProperfyProperty {
  id: number;
  chrReference: string;
  chrTransactionType: string;
  chrType: string;
  chrStatus: string;
  dcmSale: number;
  dcmRentRawValue: number;
  dcmCondoValue: number;
  dcmPropertyTax: number;
  chrAddressStreet: string;
  chrAddressNumber: string;
  chrAddressComplement: string | null;
  chrAddressDistrict: string;
  chrAddressCity: string;
  chrAddressState: string;
  chrAddressPostalCode: string;
  dcmAddressLatitude: number;
  dcmAddressLongitude: number;
  intBedrooms: number;
  intBathrooms: number;
  intSuites: number;
  intGarage: number;
  dcmAreaTotal: number;
  dcmAreaUsable: number;
  dcmAreaBuilt: number;
  vrcTitle: string;
  txtDescription: string;
  vrcVirtualTour: string | null;
  dttRegister: string;
  dttUpdated: string;
  features: string[];
  facilities: string[];
  isExclusive: boolean;
}

interface ProperfyResponse {
  current_page: number;
  data: ProperfyProperty[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

function mapPropertyType(chrTransactionType: string): PropertyType {
  return chrTransactionType === 'SALE' ? 'sale' : 'rent';
}

function mapPropertyCategory(chrType: string): PropertyCategory {
  const typeMap: Record<string, PropertyCategory> = {
    'RESIDENTIAL_HOUSE': 'house',
    'TWO_STORY_HOUSE': 'house',
    'APARTMENT': 'apartment',
    'COMMERCIAL': 'commercial',
    'LAND': 'land',
    'FARM': 'farm',
  };
  return typeMap[chrType] || 'house';
}

function mapPropertyStatus(chrStatus: string): PropertyStatus {
  const statusMap: Record<string, PropertyStatus> = {
    'LISTED': 'available',
    'RENTED': 'rented',
    'SOLD': 'sold',
    'RESERVED': 'reserved',
  };
  return statusMap[chrStatus] || 'available';
}

export function mapProperfyProperty(properfy: ProperfyProperty): Property {
  const type = mapPropertyType(properfy.chrTransactionType);
  const price = type === 'sale' ? properfy.dcmSale : properfy.dcmRentRawValue;

  return {
    id: properfy.id.toString(),
    title: properfy.vrcTitle || `${mapPropertyCategory(properfy.chrType)} - ${properfy.chrAddressDistrict}`,
    description: properfy.txtDescription || '',
    type,
    category: mapPropertyCategory(properfy.chrType),
    status: mapPropertyStatus(properfy.chrStatus),
    price,
    condoFee: properfy.dcmCondoValue || undefined,
    iptu: properfy.dcmPropertyTax || undefined,
    code: properfy.chrReference,
    createdAt: properfy.dttRegister,
    updatedAt: properfy.dttUpdated,
    highlighted: properfy.isExclusive,
    address: {
      street: properfy.chrAddressStreet,
      number: properfy.chrAddressNumber,
      complement: properfy.chrAddressComplement || undefined,
      neighborhood: properfy.chrAddressDistrict,
      city: properfy.chrAddressCity,
      state: properfy.chrAddressState,
      zipCode: properfy.chrAddressPostalCode,
      latitude: properfy.dcmAddressLatitude || undefined,
      longitude: properfy.dcmAddressLongitude || undefined,
    },
    features: {
      bedrooms: properfy.intBedrooms || 0,
      bathrooms: properfy.intBathrooms || 0,
      suites: properfy.intSuites || 0,
      parkingSpaces: properfy.intGarage || 0,
      area: properfy.dcmAreaTotal || 0,
      builtArea: properfy.dcmAreaBuilt || properfy.dcmAreaUsable || undefined,
    },
    amenities: {
      // Map facilities array when available
    },
    images: [
      // Images will need to come from a separate endpoint or field
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
        order: 1,
      },
    ],
    virtualTourUrl: properfy.vrcVirtualTour || undefined,
  };
}

export function mapProperfyResponse(response: ProperfyResponse) {
  return {
    data: response.data.map(mapProperfyProperty),
    total: response.total,
    page: response.current_page,
    limit: response.per_page,
    totalPages: response.last_page,
  };
}
