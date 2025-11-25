'use client';

import { useState, useEffect, useRef } from 'react';
import PropertyFilters from '@/components/PropertyFilters';
import PropertyCard from '@/components/PropertyCard';
import { PropertyFilters as PropertyFiltersType, Property } from '@/types/property';
import { getProperties } from '@/services/properfy';
import styles from './PropertyListing.module.css';

interface PropertyListingProps {
  initialProperties: Property[];
  initialTotal: number;
}

export default function PropertyListing({ initialProperties, initialTotal }: PropertyListingProps) {
  const [filters, setFilters] = useState<PropertyFiltersType>({});
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(initialTotal);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getProperties(filters);
        setProperties(response.data);
        setTotal(response.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load properties');
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [filters]);

  const handleFilterChange = (newFilters: PropertyFiltersType) => {
    setFilters(newFilters);
  };

  return (
    <section className={styles.section}>
      <PropertyFilters onFilterChange={handleFilterChange} initialFilters={filters} />

      {/* Error State */}
      {error && (
        <div className={styles.errorBox}>
          <div className={styles.errorContent}>
            <svg className={styles.errorIcon} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className={styles.errorTitle}>Erro ao carregar imoveis</p>
              <p className={styles.errorMessage}>{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Resultados Header */}
      <div className={styles.resultsHeader}>
        <div>
          <h2 className={styles.resultsTitle}>
            {total === 0 ? (
              <>
                <svg className={styles.resultsIconEmpty} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Nenhum imovel encontrado
              </>
            ) : (
              <>
                <svg className={styles.resultsIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>{total} {total === 1 ? 'Imovel Encontrado' : 'Imoveis Encontrados'}</span>
              </>
            )}
          </h2>
          {total > 0 && (
            <p className={styles.resultsSubtitle}>Encontramos as melhores opcoes para voce</p>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className={styles.grid}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className={styles.skeletonCard}>
              <div className={styles.skeletonImage} />
              <div className={styles.skeletonContent}>
                <div className={styles.skeletonLineSmall} />
                <div className={styles.skeletonLineMedium} />
                <div className={styles.skeletonLineFull} />
                <div className={styles.skeletonFeatures}>
                  <div className={styles.skeletonFeature} />
                  <div className={styles.skeletonFeature} />
                  <div className={styles.skeletonFeature} />
                </div>
                <div className={styles.skeletonPrice} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {properties.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateInner}>
                <div className={styles.emptyIconWrapper}>
                  <svg className={styles.emptyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h3 className={styles.emptyTitle}>Nenhum imovel encontrado</h3>
                <p className={styles.emptyMessage}>
                  Nao encontramos imoveis com os filtros selecionados.
                  Tente ajustar os criterios para ver mais opcoes.
                </p>
                <button
                  onClick={() => {
                    setFilters({});
                    handleFilterChange({});
                  }}
                  className={styles.clearButton}
                >
                  <svg className={styles.clearButtonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Limpar Filtros
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.grid}>
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
