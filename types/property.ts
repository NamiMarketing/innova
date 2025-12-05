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
  suites: number;
  parkingSpaces: number;
  area: number;
  builtArea?: number;
}

export interface PropertyAmenities {
  pool?: boolean;
  gym?: boolean;
  gourmetArea?: boolean;
  playground?: boolean;
  partyHall?: boolean;
  sportsField?: boolean;
  garden?: boolean;
  elevator?: boolean;
  balcony?: boolean;
  furnished?: boolean;
  airConditioning?: boolean;
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
  minParkingSpaces?: number;
  minArea?: number;
  maxArea?: number;
  amenities?: string[];
  search?: string;
  page?: number;
  limit?: number;
  code?: string;
}

export interface PropertyResponse {
  data: Property[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
