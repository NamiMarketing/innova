import { NextResponse } from 'next/server';
import { getHighlightedProperties } from '@/services/properfy';

// Cache for 1 hour
export const revalidate = 3600;

export async function GET() {
  try {
    const properties = await getHighlightedProperties(10);
    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error fetching highlighted properties:', error);
    return NextResponse.json([], { status: 500 });
  }
}
