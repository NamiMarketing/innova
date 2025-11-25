import { Metadata } from 'next';
import Link from 'next/link';
import { SearchFilters } from '@/components/SearchFilters';
import { SearchResults } from '@/components/SearchResults';
import { getProperties } from '@/services/properfy';
import { safeFetch } from '@/lib/safe-fetch';
import { PropertyCategory } from '@/types/property';
import styles from '../../page.module.css';

const STATIC_CITIES = [
  { slug: 'curitiba', name: 'Curitiba' },
  { slug: 'sao-jose-dos-pinhais', name: 'Sao Jose dos Pinhais' },
  { slug: 'colombo', name: 'Colombo' },
  { slug: 'pinhais', name: 'Pinhais' },
  { slug: 'araucaria', name: 'Araucaria' },
];

const STATIC_CATEGORIES = [
  { slug: 'apartamentos', name: 'Apartamentos', value: 'apartment' as PropertyCategory },
  { slug: 'casas', name: 'Casas', value: 'house' as PropertyCategory },
  { slug: 'terrenos', name: 'Terrenos', value: 'land' as PropertyCategory },
  { slug: 'comerciais', name: 'Imoveis Comerciais', value: 'commercial' as PropertyCategory },
  { slug: 'chacaras', name: 'Chacaras e Fazendas', value: 'farm' as PropertyCategory },
];

// Generate all combinations of city + category at build time
export async function generateStaticParams() {
  const params: { city: string; category: string }[] = [];

  for (const city of STATIC_CITIES) {
    for (const category of STATIC_CATEGORIES) {
      params.push({
        city: city.slug,
        category: category.slug,
      });
    }
  }

  return params;
}

// Generate SEO metadata
export async function generateMetadata({ params }: { params: Promise<{ city: string; category: string }> }): Promise<Metadata> {
  const { city, category } = await params;
  const cityData = STATIC_CITIES.find((c) => c.slug === city);
  const categoryData = STATIC_CATEGORIES.find((c) => c.slug === category);

  const cityName = cityData?.name || city;
  const categoryName = categoryData?.name || category;

  return {
    title: `${categoryName} em ${cityName} | Venda e Aluguel | Innova Imobiliaria`,
    description: `Encontre ${categoryName.toLowerCase()} a venda e para alugar em ${cityName}. As melhores opcoes com fotos, precos e detalhes completos.`,
    openGraph: {
      title: `${categoryName} em ${cityName} | Innova Imobiliaria`,
      description: `${categoryName} a venda e aluguel em ${cityName}. Confira as melhores opcoes.`,
    },
  };
}

interface CategoryPageProps {
  params: Promise<{ city: string; category: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { city, category } = await params;
  const cityData = STATIC_CITIES.find((c) => c.slug === city);
  const categoryData = STATIC_CATEGORIES.find((c) => c.slug === category);

  const cityName = cityData?.name || city;
  const categoryName = categoryData?.name || category;
  const categoryValue = categoryData?.value;

  // Fetch properties for this city and category
  const { data: response } = await safeFetch(
    getProperties({
      city: cityName,
      category: categoryValue,
    })
  );
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
            <Link href={`/imoveis/${city}`} className={styles.breadcrumbLink}>{cityName}</Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <span className={styles.breadcrumbCurrent}>{categoryName}</span>
          </nav>
          <h1 className={styles.title}>{categoryName} em {cityName}</h1>
          <p className={styles.subtitle}>Encontre {categoryName.toLowerCase()} a venda e para alugar em {cityName}</p>
        </div>

        <SearchFilters initialFilters={{ city: cityName, category: categoryValue }} />
        <SearchResults properties={properties} total={total} />
      </div>
    </div>
  );
}
