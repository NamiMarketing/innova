'use client';

import { useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import {
  Property,
  PropertyFilters,
  PropertyResponse,
  PropertyCategory,
} from '@/types/property';
import { PropertyCard } from '@/components/PropertyCard';
import { Selector, SelectorOption, ButtonSelector } from '@/components/ui';
import styles from './PropertySearch.module.css';
import houseIcon from '@/img/icons/casa-icon.svg';
import cityIcon from '@/img/icons/city-icon.svg';
import neighborhoodIcon from '@/img/icons/bairro-icon.svg';
import filterIcon from '@/img/icons/filter.svg';
import trashIcon from '@/img/icons/trash.svg';
import whiteFilterIcon from '@/img/icons/white-filter.svg';
import ordenarIcon from '@/img/icons/ordenar-icon.svg';

// Formata número para moeda brasileira (R$ X.XXX,XX)
const formatCurrency = (value: number | undefined): string => {
  if (value === undefined || value === 0) return '';
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Remove formatação e retorna o número
const parseCurrency = (value: string): number | undefined => {
  if (!value) return undefined;
  // Remove R$, pontos e espaços, substitui vírgula por ponto
  const cleaned = value
    .replace(/R\$\s?/g, '')
    .replace(/\./g, '')
    .replace(',', '.')
    .trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? undefined : num;
};

// Formata enquanto digita
const formatCurrencyInput = (value: string): string => {
  // Remove tudo exceto números
  const numbers = value.replace(/\D/g, '');
  if (!numbers) return '';

  // Converte para centavos e depois para reais
  const cents = parseInt(numbers, 10);
  const reais = cents / 100;

  return reais.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Formata área para exibição (X m²)
const formatArea = (value: number | undefined): string => {
  if (value === undefined || value === 0) return '';
  return `${value.toLocaleString('pt-BR')} m²`;
};

// Remove formatação de área e retorna o número
const parseArea = (value: string): number | undefined => {
  if (!value) return undefined;
  // Remove "m²", espaços e pontos de milhar
  const cleaned = value
    .replace(/m²/gi, '')
    .replace(/\./g, '')
    .replace(',', '.')
    .trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? undefined : Math.round(num);
};

// Formata área enquanto digita
const formatAreaInput = (value: string): string => {
  // Remove tudo exceto números
  const numbers = value.replace(/\D/g, '');
  if (!numbers) return '';

  const num = parseInt(numbers, 10);
  return `${num.toLocaleString('pt-BR')} m²`;
};

interface PropertySearchProps {
  initialData: PropertyResponse;
  initialFilters?: PropertyFilters;
  filterOptions: {
    cities: string[];
    neighborhoodsByCity: Record<string, string[]>;
    types: string[];
  };
}

const TYPE_LABELS: Record<string, string> = {
  apartment: 'Apartamento',
  house: 'Casa',
  commercial: 'Comercial',
  land: 'Terreno',
  farm: 'Chácara/Fazenda',
};

const toOptions = (items: string[]): SelectorOption[] =>
  items.map((item) => ({ value: item, label: item }));

const _getCategoryLabel = (cat: string) => TYPE_LABELS[cat] || cat;

export function PropertySearch({
  initialData,
  initialFilters = {},
  filterOptions,
}: PropertySearchProps) {
  const [filters, setFilters] = useState<PropertyFilters>(initialFilters);
  const [appliedFilters, setAppliedFilters] =
    useState<PropertyFilters>(initialFilters); // Filtros aplicados após busca
  const [properties, setProperties] = useState<Property[]>(
    initialData.data || []
  );
  const [, setTotal] = useState(initialData.total ?? 0);
  const [loading, setLoading] = useState(false);

  // Mobile filters drawer state
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sorting state
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | ''>('');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Multi-select states
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialFilters.category
      ? initialFilters.category.split(',').map((c) => c.trim())
      : []
  );
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>(
    initialFilters.neighborhood
      ? initialFilters.neighborhood.split(',').map((n) => n.trim())
      : []
  );
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    initialFilters.amenities || []
  );

  // States for formatted price display
  const [minPriceDisplay, setMinPriceDisplay] = useState(
    formatCurrency(initialFilters.minPrice)
  );
  const [maxPriceDisplay, setMaxPriceDisplay] = useState(
    formatCurrency(initialFilters.maxPrice)
  );

  // Handlers for price input
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrencyInput(e.target.value);
    setMinPriceDisplay(formatted);
    setFilters({ ...filters, minPrice: parseCurrency(formatted) });
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrencyInput(e.target.value);
    setMaxPriceDisplay(formatted);
    setFilters({ ...filters, maxPrice: parseCurrency(formatted) });
  };

  // States for formatted area display
  const [minAreaDisplay, setMinAreaDisplay] = useState(
    formatArea(initialFilters.minArea)
  );
  const [maxAreaDisplay, setMaxAreaDisplay] = useState(
    formatArea(initialFilters.maxArea)
  );

  // Handlers for area input
  const handleMinAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAreaInput(e.target.value);
    setMinAreaDisplay(formatted);
    setFilters({ ...filters, minArea: parseArea(formatted) });
  };

  const handleMaxAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAreaInput(e.target.value);
    setMaxAreaDisplay(formatted);
    setFilters({ ...filters, maxArea: parseArea(formatted) });
  };

  const fetchProperties = useCallback(async (newFilters: PropertyFilters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (newFilters.type) params.set('type', newFilters.type);
      if (newFilters.category) params.set('category', newFilters.category);
      if (newFilters.city) params.set('city', newFilters.city);
      if (newFilters.neighborhood)
        params.set('neighborhood', newFilters.neighborhood);
      if (newFilters.minPrice)
        params.set('minPrice', newFilters.minPrice.toString());
      if (newFilters.maxPrice)
        params.set('maxPrice', newFilters.maxPrice.toString());
      if (newFilters.minBedrooms)
        params.set('minBedrooms', newFilters.minBedrooms.toString());
      if (newFilters.minBathrooms)
        params.set('minBathrooms', newFilters.minBathrooms.toString());
      if (newFilters.minSuites)
        params.set('minSuites', newFilters.minSuites.toString());
      if (newFilters.minParkingSpaces)
        params.set('minParkingSpaces', newFilters.minParkingSpaces.toString());
      if (newFilters.code) params.set('code', newFilters.code);
      if (newFilters.amenities && newFilters.amenities.length > 0) {
        params.set('amenities', newFilters.amenities.join(','));
      }
      if (newFilters.page) params.set('page', newFilters.page.toString());

      const response = await fetch(`/api/properties?${params.toString()}`);
      const data: PropertyResponse = await response.json();

      setProperties(data.data || []);
      setTotal(data.total ?? 0);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCityChange = (newCity: string) => {
    const newFilters = { ...filters, city: newCity || undefined };
    setFilters(newFilters);

    // Reset neighborhoods that are not valid for the new city
    if (
      newCity &&
      selectedNeighborhoods.length > 0 &&
      filterOptions.neighborhoodsByCity[newCity]
    ) {
      const validNeighborhoods = selectedNeighborhoods.filter((n) =>
        filterOptions.neighborhoodsByCity[newCity].includes(n)
      );
      if (validNeighborhoods.length !== selectedNeighborhoods.length) {
        setSelectedNeighborhoods(validNeighborhoods);
      }
    }
  };

  const handleSubmit = () => {
    const newFilters: PropertyFilters = {
      ...filters,
      category:
        selectedCategories.length > 0
          ? (selectedCategories.join(',') as PropertyCategory)
          : undefined,
      neighborhood:
        selectedNeighborhoods.length > 0
          ? selectedNeighborhoods.join(',')
          : undefined,
      amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
    };
    setAppliedFilters(newFilters);
    fetchProperties(newFilters);
  };

  const handleTypeChange = (type: 'sale' | 'rent') => {
    const newFilters: PropertyFilters = {
      ...filters,
      type,
      category:
        selectedCategories.length > 0
          ? (selectedCategories.join(',') as PropertyCategory)
          : undefined,
      neighborhood:
        selectedNeighborhoods.length > 0
          ? selectedNeighborhoods.join(',')
          : undefined,
      amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
    };
    setFilters(newFilters);
    setAppliedFilters(newFilters);
    fetchProperties(newFilters);
  };

  const handleReset = () => {
    const resetFilters: PropertyFilters = {};
    setFilters(resetFilters);
    setAppliedFilters(resetFilters);
    setSelectedCategories([]);
    setSelectedNeighborhoods([]);
    setSelectedAmenities([]);
    setMinPriceDisplay('');
    setMaxPriceDisplay('');
    setMinAreaDisplay('');
    setMaxAreaDisplay('');
    fetchProperties(resetFilters);
  };

  // Options
  const categoryOptions = useMemo(
    () =>
      Object.entries(TYPE_LABELS).map(([value, label]) => ({ value, label })),
    []
  );

  const cityOptions = useMemo(
    () => toOptions(filterOptions.cities),
    [filterOptions.cities]
  );

  const availableNeighborhoods = useMemo(() => {
    if (filters.city && filterOptions.neighborhoodsByCity[filters.city]) {
      return filterOptions.neighborhoodsByCity[filters.city];
    }
    const all = new Set<string>();
    Object.values(filterOptions.neighborhoodsByCity).forEach(
      (neighborhoods) => {
        neighborhoods.forEach((n) => all.add(n));
      }
    );
    return Array.from(all).sort();
  }, [filters.city, filterOptions.neighborhoodsByCity]);

  const neighborhoodOptions = useMemo(
    () => toOptions(availableNeighborhoods),
    [availableNeighborhoods]
  );

  const quantityOptions = [
    { value: '1', label: '+1' },
    { value: '2', label: '+2' },
    { value: '3', label: '+3' },
    { value: '4', label: '+4' },
  ];

  // Sort properties by price
  const sortedProperties = useMemo(() => {
    if (!sortOrder) return properties;
    return [...properties].sort((a, b) => {
      if (sortOrder === 'asc') return a.price - b.price;
      return b.price - a.price;
    });
  }, [properties, sortOrder]);

  const getSortLabel = () => {
    if (sortOrder === 'asc') return 'Menor preço';
    if (sortOrder === 'desc') return 'Maior preço';
    return 'Ordenar';
  };

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.type) count++;
    if (filters.city) count++;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.minArea || filters.maxArea) count++;
    if (filters.minBedrooms) count++;
    if (filters.minBathrooms) count++;
    if (filters.minSuites) count++;
    if (filters.minParkingSpaces) count++;
    if (filters.code) count++;
    count += selectedCategories.length;
    count += selectedNeighborhoods.length;
    count += selectedAmenities.length;
    return count;
  }, [filters, selectedCategories, selectedNeighborhoods, selectedAmenities]);

  // Handle apply filters and close mobile drawer
  const handleMobileApply = () => {
    handleSubmit();
    setMobileFiltersOpen(false);
  };

  return (
    <div className={styles.container}>
      {/* Mobile Action Bar */}
      <div className={styles.mobileActionBar}>
        <button
          type="button"
          className={`${styles.mobileActionButton} ${styles.mobileFilterButton}`}
          onClick={() => setMobileFiltersOpen(true)}
        >
          <Image
            src={whiteFilterIcon}
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
          onClick={handleReset}
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

      {/* Mobile Overlay */}
      {mobileFiltersOpen && (
        <div
          className={styles.mobileOverlay}
          onClick={() => setMobileFiltersOpen(false)}
        />
      )}

      {/* Filter Column Wrapper */}
      <div
        className={`${styles.filterColumn} ${mobileFiltersOpen ? styles.filterColumnOpen : ''}`}
      >
        {/* Mobile Drawer Header */}
        <div className={styles.mobileDrawerHeader}>
          <button
            type="button"
            className={styles.mobileCloseButton}
            onClick={() => setMobileFiltersOpen(false)}
          >
            ✕
          </button>
          <h3 className={styles.mobileDrawerTitle}>Filtros</h3>
          <button
            type="button"
            onClick={handleReset}
            className={styles.mobileClearButton}
          >
            <Image
              src={trashIcon}
              alt="icone para limpar filtros"
              width={16}
              height={16}
            />
            Limpar
          </button>
        </div>

        {/* Filter Header - Desktop Only */}
        <div className={styles.filterHeader}>
          <div className={styles.filterHeaderLeft}>
            <Image src={filterIcon} alt="icone para filtros" />
            <h3 className={styles.sidebarTitle}>Filtros</h3>
          </div>
          <div className={styles.filterHeaderRight}>
            <Image src={trashIcon} alt="icone para limpar filtros" />
            <button
              type="button"
              onClick={handleReset}
              className={styles.clearButton}
            >
              Limpar tudo
            </button>
          </div>
        </div>

        {activeFiltersCount > 0 && (
          <button type="button" className={styles.selectedFiltersButton}>
            Selecionados{' '}
            <span className={styles.selectedCount}>{activeFiltersCount}</span>
          </button>
        )}

        {/* Sidebar Filters */}
        <aside className={styles.sidebar}>
          <div className={styles.filterSection}>
            <div className={styles.typeButtons}>
              <button
                type="button"
                className={`${styles.typeButton} ${appliedFilters.type === 'rent' ? styles.typeButtonActive : ''}`}
                onClick={() => handleTypeChange('rent')}
              >
                Alugar
              </button>
              <button
                type="button"
                className={`${styles.typeButton} ${appliedFilters.type === 'sale' ? styles.typeButtonActive : ''}`}
                onClick={() => handleTypeChange('sale')}
              >
                Comprar
              </button>
            </div>
          </div>

          <div className={styles.filterSection}>
            <Selector
              multiple
              options={categoryOptions}
              value={selectedCategories}
              onChange={setSelectedCategories}
              label="Tipo de Imóvel"
              icon={
                <Image
                  src={houseIcon}
                  alt="ícone de casa"
                  width={12}
                  height={12}
                />
              }
              placeholder="Todos"
            />
          </div>

          <div className={styles.filterSection}>
            <Selector
              searchable
              options={cityOptions}
              value={filters.city || ''}
              onChange={handleCityChange}
              label="Cidade"
              icon={
                <Image
                  src={cityIcon}
                  alt="ícone de cidade"
                  width={12}
                  height={12}
                />
              }
              placeholder="Busque por cidade"
            />
          </div>

          <div className={styles.filterSection}>
            <Selector
              multiple
              searchable
              options={neighborhoodOptions}
              value={selectedNeighborhoods}
              onChange={setSelectedNeighborhoods}
              label="Bairro"
              icon={
                <Image
                  src={neighborhoodIcon}
                  alt="ícone de bairro"
                  width={12}
                  height={12}
                />
              }
              placeholder="Busque por bairro"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="code" className={styles.label}>
              Código do Imóvel
            </label>
            <input
              type="text"
              value={filters.code || ''}
              onChange={(e) =>
                setFilters({ ...filters, code: e.target.value || undefined })
              }
              placeholder="Busque por código"
              className={styles.codeInput}
              id="code"
            />
          </div>

          <span className={styles.separator}></span>

          <div className={styles.filterSection}>
            <div className={styles.wrapTitle}>
              <h4 className={styles.filterTitle}>Preço a partir de</h4>
              <h4 className={styles.filterTitle}>Até</h4>
            </div>
            <div className={styles.priceInputs}>
              <input
                type="text"
                value={minPriceDisplay}
                onChange={handleMinPriceChange}
                placeholder="R$ 0,00"
                className={styles.priceInput}
              />
              <input
                type="text"
                value={maxPriceDisplay}
                onChange={handleMaxPriceChange}
                placeholder="R$ 0,00"
                className={styles.priceInput}
              />
            </div>
          </div>

          <span className={styles.separator}></span>

          <div className={styles.filterSection}>
            <ButtonSelector
              options={quantityOptions}
              value={filters.minBedrooms?.toString() || ''}
              onChange={(v: string) =>
                setFilters({
                  ...filters,
                  minBedrooms: v ? Number(v) : undefined,
                })
              }
              label="Quartos"
            />
          </div>

          <div className={styles.filterSection}>
            <ButtonSelector
              options={quantityOptions}
              value={filters.minSuites?.toString() || ''}
              onChange={(v: string) =>
                setFilters({ ...filters, minSuites: v ? Number(v) : undefined })
              }
              label="Suítes"
            />
          </div>

          <div className={styles.filterSection}>
            <ButtonSelector
              options={quantityOptions}
              value={filters.minBathrooms?.toString() || ''}
              onChange={(v: string) =>
                setFilters({
                  ...filters,
                  minBathrooms: v ? Number(v) : undefined,
                })
              }
              label="Banheiros"
            />
          </div>

          <div className={styles.filterSection}>
            <ButtonSelector
              options={quantityOptions}
              value={filters.minParkingSpaces?.toString() || ''}
              onChange={(v: string) =>
                setFilters({
                  ...filters,
                  minParkingSpaces: v ? Number(v) : undefined,
                })
              }
              label="Garagem"
            />
          </div>

          <span className={styles.separator}></span>

          <div className={styles.filterSection}>
            <div className={styles.wrapTitle}>
              <h4 className={styles.filterTitle}>Área útil (m²) de</h4>
              <h4 className={styles.filterTitle}>Até</h4>
            </div>
            <div className={styles.priceInputs}>
              <input
                type="text"
                value={minAreaDisplay}
                onChange={handleMinAreaChange}
                placeholder="0 m²"
                className={styles.priceInput}
              />
              <input
                type="text"
                value={maxAreaDisplay}
                onChange={handleMaxAreaChange}
                placeholder="0 m²"
                className={styles.priceInput}
              />
            </div>
          </div>

          <span className={styles.separator}></span>

          <div className={styles.filterSection}>
            <h4 className={styles.filterTitle}>Conveniências</h4>
            <div className={styles.amenitiesGrid}>
              {[
                { value: 'furnished', label: 'Mobiliado' },
                { value: 'airConditioning', label: 'Ar-condicionado' },
                { value: 'elevator', label: 'Elevador' },
                { value: 'fireplace', label: 'Lareira' },
                { value: 'laundry', label: 'Lavanderia' },
              ].map((amenity) => (
                <button
                  key={amenity.value}
                  type="button"
                  className={`${styles.amenityButton} ${selectedAmenities.includes(amenity.value) ? styles.amenityButtonActive : ''}`}
                  onClick={() => {
                    if (selectedAmenities.includes(amenity.value)) {
                      setSelectedAmenities(
                        selectedAmenities.filter((a) => a !== amenity.value)
                      );
                    } else {
                      setSelectedAmenities([
                        ...selectedAmenities,
                        amenity.value,
                      ]);
                    }
                  }}
                >
                  {amenity.label}
                </button>
              ))}
            </div>
          </div>

          <span className={styles.separator}></span>

          <div className={styles.filterSection}>
            <h4 className={styles.filterTitle}>Lazer</h4>
            <div className={styles.amenitiesGrid}>
              {[
                { value: 'barbecue', label: 'Churrasqueira' },
                { value: 'pool', label: 'Piscina' },
                { value: 'gym', label: 'Academia' },
                { value: 'partyHall', label: 'Salão de festas' },
                { value: 'playground', label: 'Playground' },
                { value: 'gourmetSpace', label: 'Espaço gourmet' },
              ].map((amenity) => (
                <button
                  key={amenity.value}
                  type="button"
                  className={`${styles.amenityButton} ${selectedAmenities.includes(amenity.value) ? styles.amenityButtonActive : ''}`}
                  onClick={() => {
                    if (selectedAmenities.includes(amenity.value)) {
                      setSelectedAmenities(
                        selectedAmenities.filter((a) => a !== amenity.value)
                      );
                    } else {
                      setSelectedAmenities([
                        ...selectedAmenities,
                        amenity.value,
                      ]);
                    }
                  }}
                >
                  {amenity.label}
                </button>
              ))}
            </div>
          </div>

          <span className={styles.separator}></span>

          <div className={styles.filterSection}>
            <h4 className={styles.filterTitle}>Segurança</h4>
            <div className={styles.amenitiesGrid}>
              {[
                { value: 'gatekeeper', label: 'Portaria' },
                { value: 'securitySystem', label: 'Circuito de segurança' },
              ].map((amenity) => (
                <button
                  key={amenity.value}
                  type="button"
                  className={`${styles.amenityButton} ${selectedAmenities.includes(amenity.value) ? styles.amenityButtonActive : ''}`}
                  onClick={() => {
                    if (selectedAmenities.includes(amenity.value)) {
                      setSelectedAmenities(
                        selectedAmenities.filter((a) => a !== amenity.value)
                      );
                    } else {
                      setSelectedAmenities([
                        ...selectedAmenities,
                        amenity.value,
                      ]);
                    }
                  }}
                >
                  {amenity.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleMobileApply}
            className={styles.searchButton}
            disabled={loading}
          >
            <Image src={whiteFilterIcon} alt="icone para filtros" />
            Selecionar filtros
          </button>
        </aside>
      </div>

      {/* Results */}
      <main className={styles.results}>
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
                  : activeFiltersCount > 0
                    ? `Encontramos ${properties.length} imóveis com seus critérios de busca`
                    : 'Encontre seu imóvel perfeito'}
              </p>
            </div>

            {/* Sort Dropdown */}
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
            <h3 className={styles.emptyTitle}>Nenhum imóvel encontrado</h3>
            <p className={styles.emptyMessage}>
              Tente ajustar os filtros para encontrar mais opções.
            </p>
          </div>
        ) : (
          <>
            <div className={styles.grid}>
              {sortedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
