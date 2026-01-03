import { Metadata } from 'next';
import { Suspense } from 'react';
import { PropertyType, PropertyCategory } from '@/types/property';
import { ImoveisContent } from './ImoveisContent';
import { LoadingState } from './LoadingState';
import styles from './page.module.css';
import { getProperties, getFilterOptions } from '@/services/properfy';

export const metadata: Metadata = {
  title: 'Imoveis a Venda e Aluguel | Innova Imobiliaria',
  description:
    'Encontre imoveis a venda e para alugar em Curitiba e regiao. Apartamentos, casas, terrenos e imoveis comerciais.',
};

// Dynamic rendering for real-time data
export const dynamic = 'force-dynamic';

async function PropertiesLoader({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const filters = {
    type: (searchParams.type as PropertyType) || undefined,
    category: (searchParams.category as PropertyCategory) || undefined,
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
    />
  );
}

export default async function ImoveisPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;

  const filters = {
    type: (resolvedSearchParams.type as PropertyType) || undefined,
    category: (resolvedSearchParams.category as PropertyCategory) || undefined,
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
            />
          }
        >
          <PropertiesLoader searchParams={resolvedSearchParams} />
        </Suspense>
      </div>
    </div>
  );
}
