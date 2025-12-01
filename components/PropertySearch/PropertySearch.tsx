'use client';

import { useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Property, PropertyFilters, PropertyResponse, PropertyType, PropertyCategory } from '@/types/property';
import { PropertyCard } from '@/components/PropertyCard';
import { Selector, SelectorOption } from '@/components/ui';
import styles from './PropertySearch.module.css';
import houseIcon from '@/img/icons/casa-icon.svg';
import cityIcon from '@/img/icons/city-icon.svg';
import neighborhoodIcon from '@/img/icons/bairro-icon.svg';

interface PropertySearchProps {
  initialData: PropertyResponse;
  initialFilters?: PropertyFilters;
}

const CITIES = ['Curitiba', 'Sao Jose dos Pinhais', 'Colombo', 'Pinhais', 'Araucaria'];

const TYPE_LABELS: Record<string, string> = {
  apartment: 'Apartamento',
  house: 'Casa',
  commercial: 'Comercial',
  land: 'Terreno',
  farm: 'Chácara/Fazenda',
};

const NEIGHBORHOODS_BY_CITY: Record<string, string[]> = {
  'Curitiba': ['Centro', 'Batel', 'Água Verde', 'Bigorrilho', 'Cabral', 'Juvevê', 'Alto da XV', 'Cristo Rei', 'Rebouças', 'Santa Felicidade'],
  'Sao Jose dos Pinhais': ['Centro', 'Afonso Pena', 'Cidade Jardim', 'São Pedro'],
  'Colombo': ['Centro', 'Maracanã', 'Atuba'],
  'Pinhais': ['Centro', 'Emiliano Perneta', 'Weissópolis'],
  'Araucaria': ['Centro', 'Costeira', 'Capela Velha'],
};

const toOptions = (items: string[]): SelectorOption[] =>
  items.map((item) => ({ value: item, label: item }));

const getCategoryLabel = (cat: string) => TYPE_LABELS[cat] || cat;

export function PropertySearch({ initialData, initialFilters = {} }: PropertySearchProps) {
  const [filters, setFilters] = useState<PropertyFilters>(initialFilters);
  const [properties, setProperties] = useState<Property[]>(initialData.data);
  const [total, setTotal] = useState(initialData.total);
  const [loading, setLoading] = useState(false);

  // Multi-select states
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialFilters.category ? [initialFilters.category] : []
  );
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>(
    initialFilters.neighborhood ? [initialFilters.neighborhood] : []
  );

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

  const handleCityChange = (newCity: string) => {
    const newFilters = { ...filters, city: newCity || undefined };
    setFilters(newFilters);

    // Reset neighborhoods that are not valid for the new city
    if (newCity && selectedNeighborhoods.length > 0 && NEIGHBORHOODS_BY_CITY[newCity]) {
      const validNeighborhoods = selectedNeighborhoods.filter(n =>
        NEIGHBORHOODS_BY_CITY[newCity].includes(n)
      );
      if (validNeighborhoods.length !== selectedNeighborhoods.length) {
        setSelectedNeighborhoods(validNeighborhoods);
      }
    }
  };

  const handleSubmit = () => {
    const newFilters: PropertyFilters = {
      ...filters,
      category: selectedCategories.length > 0 ? selectedCategories.join(',') as PropertyCategory : undefined,
      neighborhood: selectedNeighborhoods.length > 0 ? selectedNeighborhoods.join(',') : undefined,
    };
    fetchProperties(newFilters);
  };

  const handleReset = () => {
    const resetFilters: PropertyFilters = {};
    setFilters(resetFilters);
    setSelectedCategories([]);
    setSelectedNeighborhoods([]);
    fetchProperties(resetFilters);
  };

  // Options
  const categoryOptions = useMemo(
    () => Object.entries(TYPE_LABELS).map(([value, label]) => ({ value, label })),
    []
  );

  const cityOptions = useMemo(() => toOptions(CITIES), []);

  const availableNeighborhoods = useMemo(() => {
    if (filters.city && NEIGHBORHOODS_BY_CITY[filters.city]) {
      return NEIGHBORHOODS_BY_CITY[filters.city];
    }
    const all = new Set<string>();
    Object.values(NEIGHBORHOODS_BY_CITY).forEach(neighborhoods => {
      neighborhoods.forEach(n => all.add(n));
    });
    return Array.from(all).sort();
  }, [filters.city]);

  const neighborhoodOptions = useMemo(
    () => toOptions(availableNeighborhoods),
    [availableNeighborhoods]
  );

  const bedroomOptions: SelectorOption[] = [
    { value: '1', label: '1+ quarto' },
    { value: '2', label: '2+ quartos' },
    { value: '3', label: '3+ quartos' },
    { value: '4', label: '4+ quartos' },
  ];

  const bathroomOptions: SelectorOption[] = [
    { value: '1', label: '1+ banheiro' },
    { value: '2', label: '2+ banheiros' },
    { value: '3', label: '3+ banheiros' },
  ];

  const parkingOptions: SelectorOption[] = [
    { value: '1', label: '1+ vaga' },
    { value: '2', label: '2+ vagas' },
    { value: '3', label: '3+ vagas' },
  ];

  return (
    <div className={styles.container}>
      {/* Sidebar Filters */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h3 className={styles.sidebarTitle}>Filtros</h3>
          <button type="button" onClick={handleReset} className={styles.clearButton}>
            Limpar filtros
          </button>
        </div>

        <div className={styles.filterSection}>
          <h4 className={styles.filterTitle}>Finalidade</h4>
          <div className={styles.typeButtons}>
            <button
              type="button"
              className={`${styles.typeButton} ${filters.type === 'rent' ? styles.typeButtonActive : ''}`}
              onClick={() => setFilters({ ...filters, type: 'rent' })}
            >
              Alugar
            </button>
            <button
              type="button"
              className={`${styles.typeButton} ${filters.type === 'sale' ? styles.typeButtonActive : ''}`}
              onClick={() => setFilters({ ...filters, type: 'sale' })}
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
            icon={<Image src={houseIcon} alt="" width={14} height={14} />}
            placeholder="Todos os tipos"
          />
        </div>

        <div className={styles.filterSection}>
          <Selector
            searchable
            options={cityOptions}
            value={filters.city || ''}
            onChange={handleCityChange}
            label="Cidade"
            icon={<Image src={cityIcon} alt="" width={14} height={14} />}
            placeholder="Todas as cidades"
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
            icon={<Image src={neighborhoodIcon} alt="" width={14} height={14} />}
            placeholder="Todos os bairros"
          />
        </div>

        <div className={styles.filterSection}>
          <h4 className={styles.filterTitle}>Preço</h4>
          <div className={styles.priceInputs}>
            <input
              type="number"
              value={filters.minPrice || ''}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })}
              placeholder="Mínimo"
              className={styles.priceInput}
            />
            <span className={styles.priceSeparator}>até</span>
            <input
              type="number"
              value={filters.maxPrice || ''}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
              placeholder="Máximo"
              className={styles.priceInput}
            />
          </div>
        </div>

        <div className={styles.filterSection}>
          <Selector
            options={bedroomOptions}
            value={filters.minBedrooms?.toString() || ''}
            onChange={(v) => setFilters({ ...filters, minBedrooms: v ? Number(v) : undefined })}
            label="Quartos"
            placeholder="Qualquer"
          />
        </div>

        <div className={styles.filterSection}>
          <Selector
            options={bathroomOptions}
            value={filters.minBathrooms?.toString() || ''}
            onChange={(v) => setFilters({ ...filters, minBathrooms: v ? Number(v) : undefined })}
            label="Banheiros"
            placeholder="Qualquer"
          />
        </div>

        <div className={styles.filterSection}>
          <Selector
            options={parkingOptions}
            value={filters.minParkingSpaces?.toString() || ''}
            onChange={(v) => setFilters({ ...filters, minParkingSpaces: v ? Number(v) : undefined })}
            label="Vagas"
            placeholder="Qualquer"
          />
        </div>

        <button type="button" onClick={handleSubmit} className={styles.searchButton} disabled={loading}>
          {loading ? <span className={styles.spinner} /> : 'Buscar imóveis'}
        </button>
      </aside>

      {/* Results */}
      <main className={styles.results}>
        {/* Header */}
        <header className={styles.header}>
          <nav className={styles.breadcrumb}>
            <Link href="/" className={styles.breadcrumbLink}>Home</Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <Link href="/imoveis" className={styles.breadcrumbLink}>Imóveis</Link>
            {filters.city && (
              <>
                <span className={styles.breadcrumbSeparator}>/</span>
                <span className={styles.breadcrumbCurrent}>{filters.city}</span>
              </>
            )}
          </nav>
          <h1 className={styles.pageTitle}>
            {filters.city ? `Imóveis em ${filters.city}` : 'Imóveis à Venda e Aluguel'}
          </h1>
          <p className={styles.pageSubtitle}>
            {filters.city
              ? `Encontre apartamentos, casas e terrenos em ${filters.city}`
              : 'Encontre o imóvel perfeito para você'}
          </p>
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
            <svg className={styles.emptyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className={styles.emptyTitle}>Nenhum imóvel encontrado</h3>
            <p className={styles.emptyMessage}>Tente ajustar os filtros para encontrar mais opções.</p>
          </div>
        ) : (
          <>
            <div className={styles.resultsHeader}>
              <h2 className={styles.resultsTitle}>
                <span className={styles.count}>{total}</span> {total === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
              </h2>
            </div>
            <div className={styles.grid}>
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
