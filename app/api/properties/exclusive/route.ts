import { NextResponse } from 'next/server';
import { getExclusiveProperties } from '@/services/properfy';

// Cache for 1 hour
export const revalidate = 3600;

export async function GET() {
  try {
    const properties = await getExclusiveProperties(10);
    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error fetching exclusive properties:', error);
    return NextResponse.json([], { status: 500 });
  }
}
