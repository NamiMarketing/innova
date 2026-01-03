import { NextResponse } from 'next/server';
import { getFilterOptions } from '@/services/properfy';

// Cache for 4 hours (14400 seconds)
export const revalidate = 14400;

export async function GET() {
  try {
    const filterOptions = await getFilterOptions();
    return NextResponse.json(filterOptions);
  } catch (error) {
    console.error('Error fetching filter options:', error);
    return NextResponse.json(
      { cities: [], neighborhoodsByCity: {}, types: [] },
      { status: 500 }
    );
  }
}
