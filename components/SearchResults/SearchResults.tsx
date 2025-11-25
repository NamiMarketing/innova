import { Property } from '@/types/property';
import { PropertyCard } from '@/components/PropertyCard';
import styles from './SearchResults.module.css';

interface SearchResultsProps {
  properties: Property[];
  total: number;
  loading?: boolean;
}

export function SearchResults({ properties, total, loading = false }: SearchResultsProps) {
  if (loading) {
    return (
      <div className={styles.loading}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className={styles.skeleton}>
            <div className={styles.skeletonImage} />
            <div className={styles.skeletonContent}>
              <div className={styles.skeletonLine} />
              <div className={styles.skeletonLineShort} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className={styles.emptyState}>
        <svg className={styles.emptyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 className={styles.emptyTitle}>Nenhum imovel encontrado</h3>
        <p className={styles.emptyMessage}>Tente ajustar os filtros para encontrar mais opcoes.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <span className={styles.count}>{total}</span> {total === 1 ? 'imovel encontrado' : 'imoveis encontrados'}
        </h2>
      </div>
      <div className={styles.grid}>
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
