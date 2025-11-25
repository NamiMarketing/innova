'use client';

import { useState } from 'react';
import { PropertyFilters as PropertyFiltersType, PropertyType, PropertyCategory } from '@/types/property';
import styles from './PropertyFilters.module.css';

interface PropertyFiltersProps {
  onFilterChange: (filters: PropertyFiltersType) => void;
  initialFilters?: PropertyFiltersType;
}

export default function PropertyFilters({ onFilterChange, initialFilters = {} }: PropertyFiltersProps) {
  const [filters, setFilters] = useState<PropertyFiltersType>(initialFilters);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const cleanFilters = (filterObj: PropertyFiltersType): PropertyFiltersType => {
    const cleaned: PropertyFiltersType = {};
    Object.entries(filterObj).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        cleaned[key as keyof PropertyFiltersType] = value;
      }
    });
    return cleaned;
  };

  const handleChange = (key: keyof PropertyFiltersType, value: unknown) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedFilters = cleanFilters(filters);
    onFilterChange(cleanedFilters);
  };

  const handleReset = () => {
    setFilters({});
    onFilterChange({});
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <svg className={styles.titleIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filtrar Imoveis
        </h2>
        <p className={styles.subtitle}>Encontre o imovel perfeito para voce</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label className={styles.label}>Tipo de Negocio</label>
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
            <label className={styles.label}>Tipo de Imovel</label>
            <select
              value={filters.category || ''}
              onChange={(e) => handleChange('category', e.target.value as PropertyCategory)}
              className={styles.select}
            >
              <option value="">Todos</option>
              <option value="apartment">Apartamento</option>
              <option value="house">Casa</option>
              <option value="commercial">Comercial</option>
              <option value="land">Terreno</option>
              <option value="farm">Chacara/Fazenda</option>
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Cidade</label>
            <input
              type="text"
              value={filters.city || ''}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="Ex: Curitiba"
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Bairro</label>
            <input
              type="text"
              value={filters.neighborhood || ''}
              onChange={(e) => handleChange('neighborhood', e.target.value)}
              placeholder="Ex: Centro"
              className={styles.input}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={styles.toggleButton}
        >
          <span className={styles.toggleIconWrapper}>
            {showAdvanced ? (
              <svg className={styles.toggleIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg className={styles.toggleIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </span>
          {showAdvanced ? 'Menos filtros' : 'Mais filtros'}
        </button>

        {showAdvanced && (
          <div className={styles.advancedGrid}>
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
                <option value="4">4+</option>
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Vagas (min)</label>
              <select
                value={filters.minParkingSpaces || ''}
                onChange={(e) => handleChange('minParkingSpaces', e.target.value ? Number(e.target.value) : undefined)}
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
              <label className={styles.label}>Area Minima (m2)</label>
              <input
                type="number"
                value={filters.minArea || ''}
                onChange={(e) => handleChange('minArea', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="0"
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Area Maxima (m2)</label>
              <input
                type="number"
                value={filters.maxArea || ''}
                onChange={(e) => handleChange('maxArea', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="0"
                className={styles.input}
              />
            </div>
          </div>
        )}

        <div className={styles.buttons}>
          <button type="submit" className={styles.submitButton}>
            <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Buscar Imoveis
          </button>
          <button type="button" onClick={handleReset} className={styles.resetButton}>
            <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Limpar Filtros
          </button>
        </div>
      </form>
    </div>
  );
}
