import { Metadata } from 'next';
import { PropertySearch } from '@/components/PropertySearch';
import { getProperties } from '@/services/properfy';
import { safeFetch } from '@/lib/safe-fetch';
import { PropertyType, PropertyCategory } from '@/types/property';
import styles from './page.module.css';

// ISR: Revalidate every hour for SEO
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Imoveis a Venda e Aluguel | Innova Imobiliaria',
  description:
    'Encontre imoveis a venda e para alugar em Curitiba e regiao. Apartamentos, casas, terrenos e imoveis comerciais.',
};

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

  const { data: response } = await safeFetch(getProperties(filters));
  const initialData = response ?? {
    data: [],
    total: 0,
    page: 1,
    limit: 30,
    totalPages: 0,
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <PropertySearch initialData={initialData} initialFilters={filters} />
      </div>
    </div>
  );
}
