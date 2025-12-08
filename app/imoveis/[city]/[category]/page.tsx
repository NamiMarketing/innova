import { Metadata } from 'next';
import { PropertySearch } from '@/components/PropertySearch';
import { getProperties } from '@/services/properfy';
import { safeFetch } from '@/lib/safe-fetch';
import { PropertyCategory } from '@/types/property';
import styles from '../../page.module.css';

// Revalidate every hour (ISR)
export const revalidate = 3600;

const STATIC_CITIES = [
  { slug: 'curitiba', name: 'Curitiba' },
  { slug: 'sao-jose-dos-pinhais', name: 'São José dos Pinhais' },
  { slug: 'colombo', name: 'Colombo' },
  { slug: 'pinhais', name: 'Pinhais' },
  { slug: 'araucaria', name: 'Araucária' },
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
  const initialData = response ?? { data: [], total: 0, page: 1, limit: 20, totalPages: 0 };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <PropertySearch initialData={initialData} initialFilters={{ city: cityName, category: categoryValue }} />
      </div>
    </div>
  );
}
