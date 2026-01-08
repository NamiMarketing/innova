'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Property, PropertyFilters } from '@/types/property';
import { PropertyCard } from '@/components/PropertyCard';
import styles from './PropertyResults.module.css';
import ordenarIcon from '@/img/icons/ordenar-icon.svg';
import trashIcon from '@/img/icons/trash.svg';
import filterIcon from '@/img/icons/filter.svg';

interface PropertyResultsProps {
  properties: Property[];
  appliedFilters: PropertyFilters;
  loading?: boolean;
  loadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onReset: () => void;
  total?: number;
  onOpenFilters?: () => void;
}

export function PropertyResults({
  properties,
  appliedFilters,
  loading = false,
  loadingMore = false,
  hasMore = false,
  onLoadMore,
  onReset,
  onOpenFilters,
}: PropertyResultsProps) {
  // Sorting state
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | ''>('');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Track if we're on mobile for card size estimation
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  );

  // Virtualization ref - using page scroll
  const parentRef = useRef<HTMLDivElement>(null);

  // Update isMobile on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sort properties by price
  const sortedProperties = useMemo(() => {
    if (!sortOrder) return properties;
    return [...properties].sort((a, b) => {
      if (sortOrder === 'asc') return a.price - b.price;
      return b.price - a.price;
    });
  }, [properties, sortOrder]);

  // Virtualizer for performance - using document element for page scroll
  const rowVirtualizer = useVirtualizer({
    count: hasMore ? sortedProperties.length + 1 : sortedProperties.length,
    getScrollElement: () =>
      typeof window !== 'undefined' ? document.documentElement : null,
    estimateSize: () => (isMobile ? 468 : 301), // Mobile: ~454px card + 14px gap, Desktop: 287px card + 14px gap
    overscan: 2,
  });

  // Track if component has mounted to prevent auto-loading on initial render
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Infinite scroll - load more when scrolling near the bottom
  useEffect(() => {
    // Don't auto-load on initial mount
    if (!hasMounted) {
      return;
    }

    const virtualItems = rowVirtualizer.getVirtualItems();
    const [lastItem] = [...virtualItems].reverse();

    if (!lastItem) {
      return;
    }

    if (
      lastItem.index >= sortedProperties.length - 1 &&
      hasMore &&
      !loadingMore &&
      onLoadMore
    ) {
      onLoadMore();
    }
  }, [
    hasMounted,
    hasMore,
    loadingMore,
    sortedProperties.length,
    onLoadMore,
    rowVirtualizer,
  ]);

  const getSortLabel = () => {
    if (sortOrder === 'asc') return 'Menor preço';
    if (sortOrder === 'desc') return 'Maior preço';
    return 'Ordenar';
  };

  // Count active filters for display
  const hasActiveFilters = useMemo(() => {
    return Object.keys(appliedFilters).length > 0;
  }, [appliedFilters]);

  // Count active filters number
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (appliedFilters.type) count++;
    if (appliedFilters.city) count++;
    if (appliedFilters.minPrice || appliedFilters.maxPrice) count++;
    if (appliedFilters.minArea || appliedFilters.maxArea) count++;
    if (appliedFilters.minBedrooms) count++;
    if (appliedFilters.minBathrooms) count++;
    if (appliedFilters.minSuites) count++;
    if (appliedFilters.minParkingSpaces) count++;
    if (appliedFilters.code) count++;
    if (appliedFilters.category) {
      count += appliedFilters.category.split(',').length;
    }
    if (appliedFilters.neighborhood) {
      count += appliedFilters.neighborhood.split(',').length;
    }
    if (appliedFilters.amenities) {
      count += appliedFilters.amenities.length;
    }
    return count;
  }, [appliedFilters]);

  return (
    <main className={styles.results}>
      {/* Mobile Action Bar (visible only on mobile) */}
      <div className={styles.mobileActionBar}>
        <button
          type="button"
          className={`${styles.mobileActionButton} ${styles.mobileFilterButton}`}
          onClick={onOpenFilters}
        >
          <Image
            src={filterIcon}
            alt="icone para filtros"
            width={16}
            height={16}
          />
          Filtros
          {activeFiltersCount > 0 && (
            <span className={styles.mobileFilterBadge}>
              +{activeFiltersCount}
            </span>
          )}
        </button>

        <button
          type="button"
          className={`${styles.mobileActionButton} ${styles.mobileSortButton}`}
          onClick={() => setShowSortDropdown(!showSortDropdown)}
        >
          <Image
            src={ordenarIcon}
            alt="icone para ordenar"
            width={16}
            height={16}
          />
          Ordenar
        </button>

        <button
          type="button"
          className={`${styles.mobileActionButton} ${styles.mobileResetButton}`}
          onClick={onReset}
        >
          <Image
            src={trashIcon}
            alt="icone para limpar"
            width={16}
            height={16}
          />
          Limpar
        </button>

        {/* Mobile Sort Dropdown */}
        {showSortDropdown && (
          <div className={styles.mobileSortDropdown}>
            <button
              type="button"
              className={`${styles.sortOption} ${sortOrder === 'asc' ? styles.sortOptionActive : ''}`}
              onClick={() => {
                setSortOrder('asc');
                setShowSortDropdown(false);
              }}
            >
              Menor preço
            </button>
            <button
              type="button"
              className={`${styles.sortOption} ${sortOrder === 'desc' ? styles.sortOptionActive : ''}`}
              onClick={() => {
                setSortOrder('desc');
                setShowSortDropdown(false);
              }}
            >
              Maior preço
            </button>
            {sortOrder && (
              <button
                type="button"
                className={styles.sortOption}
                onClick={() => {
                  setSortOrder('');
                  setShowSortDropdown(false);
                }}
              >
                Limpar ordenação
              </button>
            )}
          </div>
        )}
      </div>

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerTitle}>
            <h1 className={styles.pageTitle}>
              {appliedFilters.city
                ? `Imóveis em ${appliedFilters.city} - PR`
                : appliedFilters.type === 'sale'
                  ? 'Imóveis à Venda'
                  : appliedFilters.type === 'rent'
                    ? 'Imóveis para Alugar'
                    : 'Imóveis à Venda e Aluguel'}
            </h1>
            <p className={styles.pageSubtitle}>
              {properties.length === 0
                ? 'Encontre seu imóvel perfeito'
                : hasActiveFilters
                  ? `Encontramos ${properties.length} imóveis com seus critérios de busca`
                  : 'Encontre seu imóvel perfeito'}
            </p>
          </div>

          {/* Sort Dropdown - Desktop */}
          <div className={styles.sortContainer}>
            <button
              type="button"
              className={styles.sortButton}
              onClick={() => setShowSortDropdown(!showSortDropdown)}
            >
              <Image src={ordenarIcon} alt="ícone para ordenar" />
              {getSortLabel()}
            </button>
            {showSortDropdown && (
              <div className={styles.sortDropdown}>
                <button
                  type="button"
                  className={`${styles.sortOption} ${sortOrder === 'asc' ? styles.sortOptionActive : ''}`}
                  onClick={() => {
                    setSortOrder('asc');
                    setShowSortDropdown(false);
                  }}
                >
                  Menor preço
                </button>
                <button
                  type="button"
                  className={`${styles.sortOption} ${sortOrder === 'desc' ? styles.sortOptionActive : ''}`}
                  onClick={() => {
                    setSortOrder('desc');
                    setShowSortDropdown(false);
                  }}
                >
                  Maior preço
                </button>
                {sortOrder && (
                  <button
                    type="button"
                    className={styles.sortOption}
                    onClick={() => {
                      setSortOrder('');
                      setShowSortDropdown(false);
                    }}
                  >
                    Limpar ordenação
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      {loading ? (
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
      ) : properties.length === 0 ? (
        <div className={styles.emptyState}>
          <svg
            className={styles.emptyIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {appliedFilters.code ? (
            <>
              <h3 className={styles.emptyTitle}>Código não encontrado</h3>
              <p className={styles.emptyMessage}>
                O imóvel com código &quot;{appliedFilters.code}&quot; não foi
                encontrado.
              </p>
            </>
          ) : (
            <>
              <h3 className={styles.emptyTitle}>Nenhum imóvel encontrado</h3>
              <p className={styles.emptyMessage}>
                Tente ajustar os filtros para encontrar mais opções.
              </p>
            </>
          )}
        </div>
      ) : (
        <div ref={parentRef} className={styles.virtualScrollContainer}>
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const isLoaderRow =
                virtualRow.index > sortedProperties.length - 1;
              const property = sortedProperties[virtualRow.index];

              return (
                <div
                  key={virtualRow.index}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {isLoaderRow ? (
                    hasMore ? (
                      <div className={styles.loadingMore}>
                        <div className={styles.spinner} />
                        Carregando mais imóveis...
                      </div>
                    ) : null
                  ) : (
                    <PropertyCard property={property} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}
