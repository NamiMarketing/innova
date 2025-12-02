import { Property, PropertyType, PropertyCategory, PropertyStatus, PropertyImage } from '@/types/property';

interface ProperfyPhoto {
  thumb: string;
  small: string;
  medium: string;
  large: string;
  share: string;
  cover: boolean;
}

interface ProperfyProperty {
  id: number;
  hash: string;
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
  coverPhoto?: ProperfyPhoto;
  photos?: ProperfyPhoto[];
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

function mapPropertyImages(properfy: ProperfyProperty): PropertyImage[] {
  try {
    // If photos array exists and has items, map them
    if (properfy.photos && Array.isArray(properfy.photos) && properfy.photos.length > 0) {
      const mappedPhotos = properfy.photos
        .filter(photo => photo && (photo.large || photo.medium || photo.small))
        .map((photo, index) => ({
          id: `${properfy.hash}-${index}`,
          url: photo.large || photo.medium || photo.small || '',
          title: photo.cover ? 'Cover Photo' : undefined,
          order: photo.cover ? 0 : index + 1,
        }));
      
      if (mappedPhotos.length > 0) return mappedPhotos;
    }
    
    // If coverPhoto exists, use it
    if (properfy.coverPhoto && (properfy.coverPhoto.large || properfy.coverPhoto.medium || properfy.coverPhoto.small)) {
      return [{
        id: `${properfy.hash}-cover`,
        url: properfy.coverPhoto.large || properfy.coverPhoto.medium || properfy.coverPhoto.small || '',
        title: 'Cover Photo',
        order: 1,
      }];
    }
  } catch (error) {
    console.error('Error mapping property images:', error);
  }
  
  // Fallback to placeholder
  return [{
    id: `${properfy.hash}-placeholder`,
    url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
    order: 1,
  }];
}

export function mapProperfyProperty(properfy: ProperfyProperty): Property {
  const type = mapPropertyType(properfy.chrTransactionType);
  const price = type === 'sale' ? properfy.dcmSale : properfy.dcmRentRawValue;

  return {
    id: properfy.hash,
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
    highlighted: false, // Will be set by service layer for featured properties
    isExclusive: properfy.isExclusive,
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
    images: mapPropertyImages(properfy),
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
