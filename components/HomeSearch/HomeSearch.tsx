'use client';

import Image from 'next/image';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PropertyType, PropertyCategory } from '@/types/property';
import styles from './HomeSearch.module.css';
import cityIcon from '@/img/city-icon.svg';
import neighborhoodIcon from '@/img/bairro-icon.svg';
import houseIcon from '@/img/casa-icon.svg';

interface HomeSearchProps {
  cities: string[];
  neighborhoodsByCity: Record<string, string[]>;
  types: string[];
}

export function HomeSearch({ cities = [], neighborhoodsByCity = {}, types = [] }: HomeSearchProps) {
  const router = useRouter();
  const [type, setType] = useState<PropertyType | ''>('rent');
  const [category, setCategory] = useState<PropertyCategory | ''>('');
  const [city, setCity] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
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

  // Reset neighborhood when city changes if the current neighborhood is not in the new city
  useEffect(() => {
    if (city && neighborhood && neighborhoodsByCity[city] && !neighborhoodsByCity[city].includes(neighborhood)) {
      setNeighborhood('');
    }
  }, [city, neighborhood, neighborhoodsByCity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (type) params.set('type', type);
    if (category) params.set('category', category);
    if (city) params.set('city', city);
    if (neighborhood) params.set('neighborhood', neighborhood);
    if (code) params.set('code', code);

    router.push(`/imoveis?${params.toString()}`);
  };

  // Map property types to display names
  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'apartment': 'Apartamento',
      'house': 'Casa',
      'commercial': 'Comercial',
      'land': 'Terreno',
      'farm': 'Chácara/Fazenda',
    };
    return labels[type] || type;
  };

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
        <div className={styles.field}>
          <label htmlFor="category" className={styles.label}>
            <Image src={houseIcon} alt="ícone de casa" width={12} height={12} />
            Tipo de Imóvel
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as PropertyCategory)}
            className={styles.select}
            id="category"
          >
            <option value="">Todos</option>
            {types.map((t) => (
              <option key={t} value={t}>{getTypeLabel(t)}</option>
            ))}
          </select>
        </div>
        
        <div className={styles.field}>
          <label htmlFor="city" className={styles.label}>
            <Image src={cityIcon} alt="ícone de cidade" width={12} height={12} />
            Cidade
          </label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={styles.select}
            id="city"
          >
            <option value="">Busque por cidade</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="neighborhood" className={styles.label}>
            <Image src={neighborhoodIcon} alt="ícone de bairro" width={12} height={12} />
            Bairro
          </label>
          <select
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            className={styles.select}
            id="neighborhood"
          >
            <option value="">Busque por bairro</option>
            {availableNeighborhoods.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

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
