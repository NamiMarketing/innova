'use client';

import { useState, useCallback } from 'react';
import { Property, PropertyFilters, PropertyResponse, PropertyType, PropertyCategory } from '@/types/property';
import { PropertyCard } from '@/components/PropertyCard';
import styles from './PropertySearch.module.css';

interface PropertySearchProps {
  initialData: PropertyResponse;
  initialFilters?: PropertyFilters;
}

const CITIES = ['Curitiba', 'Sao Jose dos Pinhais', 'Colombo', 'Pinhais', 'Araucaria'];
const CATEGORIES: { value: PropertyCategory; label: string }[] = [
  { value: 'apartment', label: 'Apartamento' },
  { value: 'house', label: 'Casa' },
  { value: 'commercial', label: 'Comercial' },
  { value: 'land', label: 'Terreno' },
  { value: 'farm', label: 'Chacara/Fazenda' },
];

export function PropertySearch({ initialData, initialFilters = {} }: PropertySearchProps) {
  const [filters, setFilters] = useState<PropertyFilters>(initialFilters);
  const [properties, setProperties] = useState<Property[]>(initialData.data);
  const [total, setTotal] = useState(initialData.total);
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const fetchProperties = useCallback(async (newFilters: PropertyFilters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (newFilters.type) params.set('type', newFilters.type);
      if (newFilters.category) params.set('category', newFilters.category);
      if (newFilters.city) params.set('city', newFilters.city);
      if (newFilters.neighborhood) params.set('neighborhood', newFilters.neighborhood);
      if (newFilters.minPrice) params.set('minPrice', newFilters.minPrice.toString());
      if (newFilters.maxPrice) params.set('maxPrice', newFilters.maxPrice.toString());
      if (newFilters.minBedrooms) params.set('minBedrooms', newFilters.minBedrooms.toString());
      if (newFilters.minBathrooms) params.set('minBathrooms', newFilters.minBathrooms.toString());
      if (newFilters.minParkingSpaces) params.set('minParkingSpaces', newFilters.minParkingSpaces.toString());
      if (newFilters.page) params.set('page', newFilters.page.toString());

      const response = await fetch(`/api/properties?${params.toString()}`);
      const data: PropertyResponse = await response.json();

      setProperties(data.data);
      setTotal(data.total);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (key: keyof PropertyFilters, value: unknown) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProperties(filters);
  };

  const handleReset = () => {
    const resetFilters: PropertyFilters = {};
    setFilters(resetFilters);
    fetchProperties(resetFilters);
  };

  return (
    <div className={styles.container}>
      {/* Filters */}
      <div className={styles.filtersContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Tipo</label>
            <select
              value={filters.type || ''}
              onChange={(e) => handleChange('type', e.target.value as PropertyType)}
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
              {CITIES.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Tipo de Imovel</label>
            <select
              value={filters.category || ''}
              onChange={(e) => handleChange('category', e.target.value as PropertyCategory)}
              className={styles.select}
            >
              <option value="">Todos</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? (
                <span className={styles.spinner} />
              ) : (
                <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
              Buscar
            </button>
            <button type="button" onClick={handleReset} className={styles.resetButton}>
              Limpar
            </button>
          </div>
        </form>

        <div className={styles.advancedToggle}>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={styles.toggleButton}
          >
            <svg className={styles.toggleIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showAdvanced ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
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
                  onChange={(e) => handleChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="R$ 0"
                  className={styles.input}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Preco Maximo</label>
                <input
                  type="number"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="R$ 0"
                  className={styles.input}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Quartos (min)</label>
                <select
                  value={filters.minBedrooms || ''}
                  onChange={(e) => handleChange('minBedrooms', e.target.value ? Number(e.target.value) : undefined)}
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
                  onChange={(e) => handleChange('minBathrooms', e.target.value ? Number(e.target.value) : undefined)}
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
      </div>

      {/* Results */}
      <div className={styles.resultsContainer}>
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
            <svg className={styles.emptyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className={styles.emptyTitle}>Nenhum imovel encontrado</h3>
            <p className={styles.emptyMessage}>Tente ajustar os filtros para encontrar mais opcoes.</p>
          </div>
        ) : (
          <>
            <div className={styles.resultsHeader}>
              <h2 className={styles.resultsTitle}>
                <span className={styles.count}>{total}</span> {total === 1 ? 'imovel encontrado' : 'imoveis encontrados'}
              </h2>
            </div>
            <div className={styles.grid}>
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
