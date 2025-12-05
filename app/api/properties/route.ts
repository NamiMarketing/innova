import { NextRequest, NextResponse } from 'next/server';
import { getProperties } from '@/services/properfy';
import { PropertyFilters } from '@/types/property';

function parseFilters(searchParams: URLSearchParams): PropertyFilters {
  const getString = (key: string) => searchParams.get(key) || undefined;
  const getNumber = (key: string) => {
    const val = searchParams.get(key);
    return val ? Number(val) : undefined;
  };

  return {
    type: getString('type') as PropertyFilters['type'],
    category: getString('category') as PropertyFilters['category'],
    city: getString('city'),
    neighborhood: getString('neighborhood'),
    minPrice: getNumber('minPrice'),
    maxPrice: getNumber('maxPrice'),
    minBedrooms: getNumber('minBedrooms'),
    minBathrooms: getNumber('minBathrooms'),
    minSuites: getNumber('minSuites'),
    minParkingSpaces: getNumber('minParkingSpaces'),
    code: getString('code'),
    amenities: searchParams.get('amenities')?.split(',').filter(Boolean),
    page: getNumber('page'),
    limit: getNumber('limit'),
  };
}

export async function GET(request: NextRequest) {
  try {
    const filters = parseFilters(request.nextUrl.searchParams);
    const response = await getProperties(filters);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}
