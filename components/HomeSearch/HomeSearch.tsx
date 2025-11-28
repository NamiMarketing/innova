'use client';

import Image from 'next/image';
import { useState, useMemo, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { PropertyType, PropertyCategory } from '@/types/property';
import styles from './HomeSearch.module.css';
import cityIcon from '@/img/city-icon.svg';
import neighborhoodIcon from '@/img/bairro-icon.svg';
import houseIcon from '@/img/casa-icon.svg';
import { Selector, SelectorOption } from '../ui';

const TYPE_LABELS: Record<string, string> = {
  apartment: 'Apartamento',
  house: 'Casa',
  commercial: 'Comercial',
  land: 'Terreno',
  farm: 'Chácara/Fazenda',
};

const getTypeLabel = (type: string) => TYPE_LABELS[type] || type;

const toOptions = (items: string[]): SelectorOption[] =>
  items.map((item) => ({ value: item, label: item }));

interface HomeSearchProps {
  cities: string[];
  neighborhoodsByCity: Record<string, string[]>;
  types: string[];
}

export function HomeSearch({ cities = [], neighborhoodsByCity = {}, types = [] }: HomeSearchProps) {
  const router = useRouter();
  const [type, setType] = useState<PropertyType | ''>('rent');
  const [categories, setCategories] = useState<PropertyCategory[]>([]);
  const [city, setCity] = useState('');
  const [neighborhoods, setNeighborhoods] = useState<string[]>([]);
  const [code, setCode] = useState('');
  
  // Derive available neighborhoods based on selected city
  const availableNeighborhoods = useMemo(() => {
    if (city && neighborhoodsByCity[city]) {
      return neighborhoodsByCity[city];
    }
    // If no city selected, show all unique neighborhoods
    const allNeighborhoods = new Set<string>();
    Object.values(neighborhoodsByCity).forEach(neighborhoods => {
      neighborhoods.forEach(n => allNeighborhoods.add(n));
    });
    return Array.from(allNeighborhoods).sort();
  }, [city, neighborhoodsByCity]);

  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    // Reset neighborhoods that are not valid for the new city
    if (newCity && neighborhoods.length > 0 && neighborhoodsByCity[newCity]) {
      const validNeighborhoods = neighborhoods.filter(n => neighborhoodsByCity[newCity].includes(n));
      if (validNeighborhoods.length !== neighborhoods.length) {
        setNeighborhoods(validNeighborhoods);
      }
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (type) params.set('type', type);
    if (categories.length > 0) params.set('category', categories.join(','));
    if (city) params.set('city', city);
    if (neighborhoods.length > 0) params.set('neighborhood', neighborhoods.join(','));
    if (code) params.set('code', code);

    router.push(`/imoveis?${params.toString()}`);
  };

  const categoryOptions = useMemo(
    () => types.map((t) => ({ value: t, label: getTypeLabel(t) })),
    [types]
  );

  const cityOptions = useMemo(() => toOptions(cities), [cities]);

  const neighborhoodOptions = useMemo(
    () => toOptions(availableNeighborhoods),
    [availableNeighborhoods]
  );

  return (
    <div className={styles.container}>
      <h2>Seu próximo imóvel começa aqui</h2>
      <div className={styles.tabs}>
        <button 
          type="button"
          className={`${styles.tab} ${type === 'rent' ? styles.tabActive : ''}`}
          onClick={() => setType('rent')}
        >
          Alugar
        </button>
        <button 
          type="button"
          className={`${styles.tab} ${type === 'sale' ? styles.tabActive : ''}`}
          onClick={() => setType('sale')}
        >
          Comprar
        </button>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <Selector
          multiple
          options={categoryOptions}
          value={categories}
          onChange={(value) => setCategories(value as PropertyCategory[])}
          label="Tipo de Imóvel"
          icon={<Image src={houseIcon} alt="ícone de casa" width={12} height={12} />}
          placeholder="Todos"
          id="category"
        />

        <Selector
          searchable
          options={cityOptions}
          value={city}
          onChange={handleCityChange}
          label="Cidade"
          icon={<Image src={cityIcon} alt="ícone de cidade" width={12} height={12} />}
          placeholder="Busque por cidade"
          id="city"
        />

        <Selector
          multiple
          searchable
          options={neighborhoodOptions}
          value={neighborhoods}
          onChange={setNeighborhoods}
          label="Bairro"
          icon={<Image src={neighborhoodIcon} alt="ícone de bairro" width={12} height={12} />}
          placeholder="Busque por bairro"
          id="neighborhood"
        />

        <div className={styles.field}>
          <label htmlFor="code" className={styles.label}>Código do Imóvel</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={styles.input}
            id="code"
            placeholder="Busque por código"
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Buscar
        </button>
      </form>
    </div>
  );
}
