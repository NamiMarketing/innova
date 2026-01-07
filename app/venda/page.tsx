import { Metadata } from 'next';
import { Suspense } from 'react';
import { PropertyCategory } from '@/types/property';
import { ImoveisContent } from './ImoveisContent';
import { LoadingState } from './LoadingState';
import styles from './page.module.css';
import { getProperties, getFilterOptions } from '@/services/properfy';

export const metadata: Metadata = {
  title: 'Imóveis à Venda | Innova Imobiliária',
  description:
    'Encontre imóveis à venda em Curitiba e região. Apartamentos, casas, terrenos e imóveis comerciais.',
};

// Dynamic rendering for real-time data
export const dynamic = 'force-dynamic';

async function PropertiesLoader({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const filters = {
    type: 'sale' as const, // Always sale for /venda
    category: (searchParams.category as PropertyCategory) || undefined,
    chrTypes: (searchParams.chrTypes as string) || undefined,
    city: (searchParams.city as string) || undefined,
    neighborhood: (searchParams.neighborhood as string) || undefined,
    code: (searchParams.code as string) || undefined,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    minBedrooms: searchParams.minBedrooms
      ? Number(searchParams.minBedrooms)
      : undefined,
    minBathrooms: searchParams.minBathrooms
      ? Number(searchParams.minBathrooms)
      : undefined,
    minSuites: searchParams.minSuites
      ? Number(searchParams.minSuites)
      : undefined,
    minParkingSpaces: searchParams.minParkingSpaces
      ? Number(searchParams.minParkingSpaces)
      : undefined,
    minArea: searchParams.minArea ? Number(searchParams.minArea) : undefined,
    maxArea: searchParams.maxArea ? Number(searchParams.maxArea) : undefined,
  };

  const [initialData, filterOptions] = await Promise.all([
    getProperties(filters),
    getFilterOptions(),
  ]);

  return (
    <ImoveisContent
      key={JSON.stringify(filters)}
      initialData={initialData}
      initialFilters={filters}
      filterOptions={filterOptions}
      lockedType="sale"
      basePath="/venda"
    />
  );
}

export default async function VendaPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;

  const filters = {
    type: 'sale' as const,
    category: (resolvedSearchParams.category as PropertyCategory) || undefined,
    chrTypes: (resolvedSearchParams.chrTypes as string) || undefined,
    city: (resolvedSearchParams.city as string) || undefined,
    neighborhood: (resolvedSearchParams.neighborhood as string) || undefined,
    code: (resolvedSearchParams.code as string) || undefined,
    minPrice: resolvedSearchParams.minPrice
      ? Number(resolvedSearchParams.minPrice)
      : undefined,
    maxPrice: resolvedSearchParams.maxPrice
      ? Number(resolvedSearchParams.maxPrice)
      : undefined,
    minBedrooms: resolvedSearchParams.minBedrooms
      ? Number(resolvedSearchParams.minBedrooms)
      : undefined,
    minBathrooms: resolvedSearchParams.minBathrooms
      ? Number(resolvedSearchParams.minBathrooms)
      : undefined,
    minSuites: resolvedSearchParams.minSuites
      ? Number(resolvedSearchParams.minSuites)
      : undefined,
    minParkingSpaces: resolvedSearchParams.minParkingSpaces
      ? Number(resolvedSearchParams.minParkingSpaces)
      : undefined,
    minArea: resolvedSearchParams.minArea
      ? Number(resolvedSearchParams.minArea)
      : undefined,
    maxArea: resolvedSearchParams.maxArea
      ? Number(resolvedSearchParams.maxArea)
      : undefined,
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Suspense
          fallback={
            <LoadingState
              initialFilters={filters}
              filterOptions={{ cities: [], neighborhoodsByCity: {}, types: [] }}
              lockedType="sale"
              basePath="/venda"
            />
          }
        >
          <PropertiesLoader searchParams={resolvedSearchParams} />
        </Suspense>
      </div>
    </div>
  );
}
