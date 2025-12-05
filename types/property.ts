export type PropertyType = 'sale' | 'rent';
export type PropertyCategory = 'apartment' | 'house' | 'commercial' | 'land' | 'farm';
export type PropertyStatus = 'available' | 'rented' | 'sold' | 'reserved';

export interface PropertyAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
}

export interface PropertyImage {
  id: string;
  url: string;
  title?: string;
  description?: string;
  order: number;
}

export interface PropertyFeatures {
  bedrooms: number;
  bathrooms: number;
  totalBaths: number;
  suites: number;
  parkingSpaces: number;
  area: number;
  builtArea?: number;
}

export interface PropertyAmenities {
  // Conveniences
  furnished?: boolean;
  airConditioning?: boolean;
  elevator?: boolean;
  fireplace?: boolean;
  laundry?: boolean;
  
  // Leisure
  barbecue?: boolean;
  pool?: boolean;
  gym?: boolean;
  partyHall?: boolean;
  playground?: boolean;
  gourmetSpace?: boolean;
  
  // Security
  gatekeeper?: boolean;
  securitySystem?: boolean;
  
  // Legacy fields (keeping for compatibility)
  gourmetArea?: boolean;
  sportsField?: boolean;
  garden?: boolean;
  balcony?: boolean;
  security24h?: boolean;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  category: PropertyCategory;
  status: PropertyStatus;
  price: number;
  condoFee?: number;
  iptu?: number;
  address: PropertyAddress;
  features: PropertyFeatures;
  amenities: PropertyAmenities;
  characteristics: string[];
  images: PropertyImage[];
  code: string;
  createdAt: string;
  updatedAt: string;
  highlighted?: boolean;
  isExclusive?: boolean;
  videoUrl?: string;
  virtualTourUrl?: string;
}

export interface PropertyFilters {
  type?: PropertyType;
  category?: PropertyCategory;
  city?: string;
  neighborhood?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  minSuites?: number;
  minParkingSpaces?: number;
  minArea?: number;
  maxArea?: number;
  amenities?: string[];
  search?: string;
  code?: string;
  page?: number;
  limit?: number;
}

export interface PropertyResponse {
  data: Property[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
