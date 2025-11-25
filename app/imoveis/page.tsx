import { Metadata } from 'next';
import Link from 'next/link';
import { SearchFilters } from '@/components/SearchFilters';
import { SearchResults } from '@/components/SearchResults';
import { getProperties } from '@/services/properfy';
import { safeFetch } from '@/lib/safe-fetch';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Imoveis a Venda e Aluguel | Innova Imobiliaria',
  description: 'Encontre imoveis a venda e para alugar em Curitiba e regiao. Apartamentos, casas, terrenos e imoveis comerciais.',
};

export default async function ImoveisPage() {
  const { data: response } = await safeFetch(getProperties({}));
  const properties = response?.data ?? [];
  const total = response?.total ?? 0;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <nav className={styles.breadcrumb}>
            <Link href="/" className={styles.breadcrumbLink}>Home</Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <span className={styles.breadcrumbCurrent}>Imoveis</span>
          </nav>
          <h1 className={styles.title}>Imoveis a Venda e Aluguel</h1>
          <p className={styles.subtitle}>Encontre o imovel perfeito para voce</p>
        </div>

        <SearchFilters />
        <SearchResults properties={properties} total={total} />
      </div>
    </div>
  );
}
