'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  PropertyFilters as PropertyFiltersType,
  PropertyType,
  PropertyCategory,
} from '@/types/property';
import styles from './SearchFilters.module.css';

interface SearchFiltersProps {
  initialFilters?: PropertyFiltersType;
  onFilterChange?: (filters: PropertyFiltersType) => void;
  showAdvancedToggle?: boolean;
  filterOptions?: {
    cities: string[];
    neighborhoodsByCity: Record<string, string[]>;
    types: Array<{ value: string; text: string }>;
  };
}

export function SearchFilters({
  initialFilters = {},
  onFilterChange,
  showAdvancedToggle = true,
  filterOptions = { cities: [], neighborhoodsByCity: {}, types: [] },
}: SearchFiltersProps) {
  const router = useRouter();
  const [filters, setFilters] = useState<PropertyFiltersType>(initialFilters);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (key: keyof PropertyFiltersType, value: unknown) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (onFilterChange) {
      onFilterChange(filters);
    } else {
      // Build URL for navigation
      const params = new URLSearchParams();
      if (filters.type) params.set('tipo', filters.type);
      if (filters.city) params.set('cidade', filters.city);
      if (filters.category) params.set('categoria', filters.category);
      if (filters.minPrice)
        params.set('preco_min', filters.minPrice.toString());
      if (filters.maxPrice)
        params.set('preco_max', filters.maxPrice.toString());
      if (filters.minTotalBedrooms)
        params.set('minTotalBedrooms', filters.minTotalBedrooms.toString());

      // Determine base path based on type filter
      let basePath = '/venda';
      if (filters.type === 'rent') {
        basePath = '/locacao';
        params.delete('tipo'); // Remove type param as it's implied by the route
      } else if (filters.type === 'sale') {
        basePath = '/venda';
        params.delete('tipo'); // Remove type param as it's implied by the route
      }

      const finalQueryString = params.toString();
      router.push(
        `${basePath}${finalQueryString ? `?${finalQueryString}` : ''}`
      );
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>Tipo</label>
          <select
            value={filters.type || ''}
            onChange={(e) =>
              handleChange('type', e.target.value as PropertyType)
            }
            className={styles.select}
          >
            <option value="">Todos</option>
            <option value="sale">Venda</option>
            <option value="rent">Aluguel</option>
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Cidade</label>
          <select
            value={filters.city || ''}
            onChange={(e) => handleChange('city', e.target.value)}
            className={styles.select}
          >
            <option value="">Todas</option>
            {filterOptions.cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Tipo de Imovel</label>
          <select
            value={filters.category || ''}
            onChange={(e) =>
              handleChange('category', e.target.value as PropertyCategory)
            }
            className={styles.select}
          >
            <option value="">Todos</option>
            {filterOptions.types.map((type) => (
              <option key={type.value} value={type.value}>
                {type.text}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className={styles.submitButton}>
          <svg
            className={styles.buttonIcon}
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
          Buscar
        </button>
      </form>

      {showAdvancedToggle && (
        <div className={styles.advancedToggle}>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={styles.toggleButton}
          >
            <svg
              className={styles.toggleIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={showAdvanced ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}
              />
            </svg>
            {showAdvanced ? 'Menos filtros' : 'Mais filtros'}
          </button>

          {showAdvanced && (
            <div className={styles.advancedFilters}>
              <div className={styles.field}>
                <label className={styles.label}>Preco Minimo</label>
                <input
                  type="number"
                  value={filters.minPrice || ''}
                  onChange={(e) =>
                    handleChange(
                      'minPrice',
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  placeholder="R$ 0"
                  className={styles.input}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Preco Maximo</label>
                <input
                  type="number"
                  value={filters.maxPrice || ''}
                  onChange={(e) =>
                    handleChange(
                      'maxPrice',
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  placeholder="R$ 0"
                  className={styles.input}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Quartos (min)</label>
                <select
                  value={filters.minTotalBedrooms || ''}
                  onChange={(e) =>
                    handleChange(
                      'minTotalBedrooms',
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className={styles.select}
                >
                  <option value="">Qualquer</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Banheiros (min)</label>
                <select
                  value={filters.minBathrooms || ''}
                  onChange={(e) =>
                    handleChange(
                      'minBathrooms',
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className={styles.select}
                >
                  <option value="">Qualquer</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
