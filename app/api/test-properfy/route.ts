import { NextResponse } from 'next/server';
import ky from 'ky';
import { env } from '@/lib/env';
import { getToken } from '@/services/auth';

export async function GET(request: Request) {
  try {
    const token = await getToken();
    const url = new URL(request.url);

    // Pegar filtros da query string
    const category = url.searchParams.get('category');
    const size = url.searchParams.get('size') || '10';

    // Construir URL da API
    let apiUrl = `${env.PROPERFY_API_URL}/api/property/shared?size=${size}&chrStatus=LISTED`;

    // Adicionar filtro de categoria se existir
    if (category) {
      const categoryMap: Record<string, string> = {
        house: 'RESIDENTIAL_HOUSE',
        apartment: 'APARTMENT',
        commercial: 'COMMERCIAL',
        land: 'LAND',
        farm: 'FARM',
      };
      const properfyType = categoryMap[category];
      if (properfyType) {
        // Testar sem colchetes
        apiUrl += `&chrType=${properfyType}`;
      }
    }

    console.log('API URL:', apiUrl);

    // Busca imóveis da API (SEM mapear)
    const response = await ky
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .json<unknown>();

    // Interface pra tipar a resposta
    interface ProperfyApiResponse {
      data: Array<{
        id: number;
        hash: string;
        chrType?: string;
        chrTransactionType?: string;
        fkPropertyType?: unknown;
        propertyType?: unknown;
        vrcTitle?: string;
        [key: string]: unknown;
      }>;
      total: number;
      current_page: number;
    }

    const apiResponse = response as ProperfyApiResponse;

    // Extrai só os campos relevantes de cada imóvel para debug
    const propertiesDebug = apiResponse.data.map((property) => ({
      id: property.id,
      hash: property.hash,
      title: property.vrcTitle,
      // Campos relacionados ao tipo
      chrType: property.chrType,
      chrTransactionType: property.chrTransactionType,
      fkPropertyType: property.fkPropertyType,
      propertyType: property.propertyType,
      // Todos os campos que contém "type" no nome
      allTypeFields: Object.entries(property)
        .filter(([key]) => key.toLowerCase().includes('type'))
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
    }));

    return NextResponse.json(
      {
        message: 'Dados brutos da API Properfy',
        total: apiResponse.total,
        properties: propertiesDebug,
        // Primeiro imóvel completo para referência
        fullFirstProperty: apiResponse.data[0],
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error testing Properfy API:', error);
    return NextResponse.json(
      {
        error: 'Erro ao buscar dados da API',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
