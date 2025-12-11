import { NextResponse } from 'next/server';
import { api } from '@/services/api';

export async function GET() {
  try {
    // Fetch raw data from Properfy API without any mapping
    const endpoint = 'api/property/shared?page=1&size=5';
    const rawResponse = await api(endpoint).json<unknown>();

    return NextResponse.json(
      {
        message: 'Raw API response from Properfy',
        rawData: rawResponse,
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching debug data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch debug data', details: String(error) },
      { status: 500 }
    );
  }
}
