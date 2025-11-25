import { Metadata } from 'next';
import Link from 'next/link';
import { SearchFilters } from '@/components/SearchFilters';
import { SearchResults } from '@/components/SearchResults';
import { getProperties } from '@/services/properfy';
import { safeFetch } from '@/lib/safe-fetch';
import styles from '../page.module.css';

// Revalidate every hour (ISR)
export const revalidate = 3600;

// Define the cities to pre-render at build time
const STATIC_CITIES = [
  { slug: 'curitiba', name: 'Curitiba' },
  { slug: 'sao-jose-dos-pinhais', name: 'Sao Jose dos Pinhais' },
  { slug: 'colombo', name: 'Colombo' },
  { slug: 'pinhais', name: 'Pinhais' },
  { slug: 'araucaria', name: 'Araucaria' },
];

// Generate static params for SEO - these pages will be pre-rendered at build time
export async function generateStaticParams() {
  return STATIC_CITIES.map((city) => ({
    city: city.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params;
  const cityData = STATIC_CITIES.find((c) => c.slug === city);
  const cityName = cityData?.name || city;

  return {
    title: `Imoveis em ${cityName} | Venda e Aluguel | Innova Imobiliaria`,
    description: `Encontre imoveis a venda e para alugar em ${cityName}. Apartamentos, casas, terrenos e imoveis comerciais com as melhores condicoes.`,
    openGraph: {
      title: `Imoveis em ${cityName} | Innova Imobiliaria`,
      description: `As melhores opcoes de imoveis em ${cityName}. Apartamentos, casas, terrenos e mais.`,
    },
  };
}

interface CityPageProps {
  params: Promise<{ city: string }>;
}

export default async function CityPage({ params }: CityPageProps) {
  const { city } = await params;
  const cityData = STATIC_CITIES.find((c) => c.slug === city);
  const cityName = cityData?.name || city;

  // Fetch properties for this city
  const { data: response } = await safeFetch(getProperties({ city: cityName }));
  const properties = response?.data ?? [];
  const total = response?.total ?? 0;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <nav className={styles.breadcrumb}>
            <Link href="/" className={styles.breadcrumbLink}>Home</Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <Link href="/imoveis" className={styles.breadcrumbLink}>Imoveis</Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <span className={styles.breadcrumbCurrent}>{cityName}</span>
          </nav>
          <h1 className={styles.title}>Imoveis em {cityName}</h1>
          <p className={styles.subtitle}>Encontre apartamentos, casas e terrenos em {cityName}</p>
        </div>

        <SearchFilters initialFilters={{ city: cityName }} />
        <SearchResults properties={properties} total={total} />
      </div>
    </div>
  );
}
