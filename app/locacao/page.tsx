import { Metadata } from 'next';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { PropertyCategory } from '@/types/property';
import { ImoveisContent } from './ImoveisContent';
import { LoadingState } from './LoadingState';
import styles from './page.module.css';
import { getProperties, getFilterOptions } from '@/services/properfy';

export const metadata: Metadata = {
  title: 'Imóveis para Alugar | Innova Imobiliária',
  description:
    'Encontre imóveis para alugar em Curitiba e região. Apartamentos, casas e imóveis comerciais.',
};

// Dynamic rendering for real-time data
export const dynamic = 'force-dynamic';

async function PropertiesLoader({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const code = searchParams.code as string | undefined;

  const filters = {
    type: 'rent' as const, // Always rent for /locacao
    category: (searchParams.category as PropertyCategory) || undefined,
    chrTypes: (searchParams.chrTypes as string) || undefined,
    city: (searchParams.city as string) || undefined,
    neighborhood: (searchParams.neighborhood as string) || undefined,
    code: code,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    minTotalBedrooms: searchParams.minTotalBedrooms
      ? Number(searchParams.minTotalBedrooms)
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
      lockedType="rent"
      basePath="/locacao"
    />
  );
}

export default async function LocacaoPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const code = resolvedSearchParams.code as string | undefined;

  // If searching by code, check if we need to redirect BEFORE rendering anything
  if (code) {
    const codeCheckResult = await getProperties({ code });
    if (codeCheckResult.data && codeCheckResult.data.length > 0) {
      const foundProperty = codeCheckResult.data[0];
      // If the property is for sale, redirect to /venda
      if (foundProperty.type === 'sale') {
        redirect(`/venda?code=${code}`);
      }
    }
  }

  const filters = {
    type: 'rent' as const,
    category: (resolvedSearchParams.category as PropertyCategory) || undefined,
    chrTypes: (resolvedSearchParams.chrTypes as string) || undefined,
    city: (resolvedSearchParams.city as string) || undefined,
    neighborhood: (resolvedSearchParams.neighborhood as string) || undefined,
    code: code,
    minPrice: resolvedSearchParams.minPrice
      ? Number(resolvedSearchParams.minPrice)
      : undefined,
    maxPrice: resolvedSearchParams.maxPrice
      ? Number(resolvedSearchParams.maxPrice)
      : undefined,
    minTotalBedrooms: resolvedSearchParams.minTotalBedrooms
      ? Number(resolvedSearchParams.minTotalBedrooms)
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
              lockedType="rent"
              basePath="/locacao"
            />
          }
        >
          <PropertiesLoader searchParams={resolvedSearchParams} />
        </Suspense>
      </div>
    </div>
  );
}
