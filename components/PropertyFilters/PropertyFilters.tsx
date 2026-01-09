'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  PropertyFilters as PropertyFiltersType,
  PropertyType,
} from '@/types/property';
import { Selector, SelectorOption, ButtonSelector } from '@/components/ui';
import styles from './PropertyFilters.module.css';
import houseIcon from '@/img/icons/casa-icon.svg';
import cityIcon from '@/img/icons/city-icon.svg';
import neighborhoodIcon from '@/img/icons/bairro-icon.svg';
import filterIcon from '@/img/icons/filter.svg';
import trashIcon from '@/img/icons/trash.svg';
import whiteFilterIcon from '@/img/icons/white-filter.svg';

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

interface PropertyFiltersProps {
  initialFilters?: PropertyFiltersType;
  onFiltersChange: (filters: PropertyFiltersType) => void;
  onReset: () => void;
  loading?: boolean;
  mobileFiltersOpen?: boolean;
  setMobileFiltersOpen?: (open: boolean) => void;
  filterOptions: {
    cities: string[];
    neighborhoodsByCity: Record<string, string[]>;
    types: Array<{ value: string; text: string }>;
  };
  lockedType?: PropertyType;
}

const toOptions = (items: string[]): SelectorOption[] =>
  items.map((item) => ({ value: item, label: item }));

export function PropertyFilters({
  initialFilters = {},
  onFiltersChange,
  onReset,
  loading = false,
  mobileFiltersOpen = false,
  setMobileFiltersOpen,
  filterOptions,
  lockedType,
}: PropertyFiltersProps) {
  const [filters, setFilters] = useState<PropertyFiltersType>(initialFilters);

  const handleCloseMobileFilters = () => {
    if (setMobileFiltersOpen) {
      setMobileFiltersOpen(false);
    }
  };

  // Multi-select states
  const [selectedChrTypes, setSelectedChrTypes] = useState<string[]>(
    initialFilters.chrTypes
      ? initialFilters.chrTypes.split(',').map((c) => c.trim())
      : initialFilters.category
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

  // States for formatted area display
  const [minAreaDisplay, setMinAreaDisplay] = useState(
    formatArea(initialFilters.minArea)
  );
  const [maxAreaDisplay, setMaxAreaDisplay] = useState(
    formatArea(initialFilters.maxArea)
  );

  // Handlers for price input
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrencyInput(e.target.value);
    setMinPriceDisplay(formatted);
    setFilters((prev) => ({ ...prev, minPrice: parseCurrency(formatted) }));
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrencyInput(e.target.value);
    setMaxPriceDisplay(formatted);
    setFilters((prev) => ({ ...prev, maxPrice: parseCurrency(formatted) }));
  };

  // Handlers for area input
  const handleMinAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAreaInput(e.target.value);
    setMinAreaDisplay(formatted);
    setFilters((prev) => ({ ...prev, minArea: parseArea(formatted) }));
  };

  const handleMaxAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAreaInput(e.target.value);
    setMaxAreaDisplay(formatted);
    setFilters((prev) => ({ ...prev, maxArea: parseArea(formatted) }));
  };

  const handleCityChange = (newCity: string) => {
    setFilters((prev) => ({ ...prev, city: newCity || undefined }));

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

  const handleTypeChange = (type: 'sale' | 'rent') => {
    const newFilters: PropertyFiltersType = {
      ...initialFilters,
      type,
      chrTypes:
        selectedChrTypes.length > 0 ? selectedChrTypes.join(',') : undefined,
      neighborhood:
        selectedNeighborhoods.length > 0
          ? selectedNeighborhoods.join(',')
          : undefined,
      amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
    };
    onFiltersChange(newFilters);
  };

  const handleApply = () => {
    const newFilters: PropertyFiltersType = {
      ...filters,
      chrTypes:
        selectedChrTypes.length > 0 ? selectedChrTypes.join(',') : undefined,
      neighborhood:
        selectedNeighborhoods.length > 0
          ? selectedNeighborhoods.join(',')
          : undefined,
      amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
    };
    onFiltersChange(newFilters);
    handleCloseMobileFilters();
  };

  const handleReset = () => {
    const resetFilters: PropertyFiltersType = {};
    setFilters(resetFilters);
    setSelectedChrTypes([]);
    setSelectedNeighborhoods([]);
    setSelectedAmenities([]);
    setMinPriceDisplay('');
    setMaxPriceDisplay('');
    setMinAreaDisplay('');
    setMaxAreaDisplay('');
    onReset();
  };

  // Options
  const categoryOptions = useMemo(
    () =>
      filterOptions.types.map((type) => ({
        value: type.value,
        label: type.text,
      })),
    [filterOptions.types]
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
    return Array.from(all).sort((a, b) => a.localeCompare(b, 'pt-BR'));
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

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.type) count++;
    if (filters.city) count++;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.minArea || filters.maxArea) count++;
    if (filters.minTotalBedrooms) count++;
    if (filters.minBathrooms) count++;
    if (filters.minSuites) count++;
    if (filters.minParkingSpaces) count++;
    if (filters.code) count++;
    count += selectedChrTypes.length;
    count += selectedNeighborhoods.length;
    count += selectedAmenities.length;
    return count;
  }, [filters, selectedChrTypes, selectedNeighborhoods, selectedAmenities]);

  return (
    <>
      {/* Mobile Overlay */}
      {mobileFiltersOpen && (
        <div
          className={styles.mobileOverlay}
          onClick={handleCloseMobileFilters}
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
            onClick={handleCloseMobileFilters}
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
          {/* Type buttons - only show when type is not locked */}
          {/* Type buttons - show as links when locked, or filter toggles when unlocked */}
          <div className={styles.filterSection}>
            <div className={styles.typeButtons}>
              {lockedType ? (
                <>
                  {lockedType === 'rent' ? (
                    <>
                      <button
                        type="button"
                        className={`${styles.typeButton} ${styles.typeButtonActive}`}
                      >
                        Alugar
                      </button>
                      <Link href="/venda" className={styles.typeButton}>
                        Comprar
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/locacao" className={styles.typeButton}>
                        Alugar
                      </Link>
                      <button
                        type="button"
                        className={`${styles.typeButton} ${styles.typeButtonActive}`}
                      >
                        Comprar
                      </button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className={`${styles.typeButton} ${initialFilters.type === 'rent' ? styles.typeButtonActive : ''}`}
                    onClick={() => handleTypeChange('rent')}
                  >
                    Alugar
                  </button>
                  <button
                    type="button"
                    className={`${styles.typeButton} ${initialFilters.type === 'sale' ? styles.typeButtonActive : ''}`}
                    onClick={() => handleTypeChange('sale')}
                  >
                    Comprar
                  </button>
                </>
              )}
            </div>
          </div>

          <div className={styles.filterSection}>
            <Selector
              multiple
              options={categoryOptions}
              value={selectedChrTypes}
              onChange={setSelectedChrTypes}
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
                setFilters((prev) => ({
                  ...prev,
                  code: e.target.value || undefined,
                }))
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleApply();
                }
              }}
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
              value={filters.minTotalBedrooms?.toString() || ''}
              onChange={(v: string) =>
                setFilters((prev) => ({
                  ...prev,
                  minTotalBedrooms: v ? Number(v) : undefined,
                }))
              }
              label="Quartos"
            />
          </div>

          <div className={styles.filterSection}>
            <ButtonSelector
              options={quantityOptions}
              value={filters.minSuites?.toString() || ''}
              onChange={(v: string) =>
                setFilters((prev) => ({
                  ...prev,
                  minSuites: v ? Number(v) : undefined,
                }))
              }
              label="Suítes"
            />
          </div>

          <div className={styles.filterSection}>
            <ButtonSelector
              options={quantityOptions}
              value={filters.minBathrooms?.toString() || ''}
              onChange={(v: string) =>
                setFilters((prev) => ({
                  ...prev,
                  minBathrooms: v ? Number(v) : undefined,
                }))
              }
              label="Banheiros"
            />
          </div>

          <div className={styles.filterSection}>
            <ButtonSelector
              options={quantityOptions}
              value={filters.minParkingSpaces?.toString() || ''}
              onChange={(v: string) =>
                setFilters((prev) => ({
                  ...prev,
                  minParkingSpaces: v ? Number(v) : undefined,
                }))
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
            onClick={handleApply}
            className={styles.searchButton}
            disabled={loading}
          >
            <Image src={whiteFilterIcon} alt="icone para filtros" />
            Selecionar filtros
          </button>
        </aside>
      </div>
    </>
  );
}
