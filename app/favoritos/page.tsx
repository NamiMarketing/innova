'use client';

import { useEffect, useState } from 'react';
import { Property } from '@/types/property';
import { PropertyCard } from '@/components/PropertyCard';
import { useFavorites } from '@/contexts/FavoritesContext';
import styles from './page.module.css';
import Link from 'next/link';

export default function FavoritosPage() {
  const { favorites, clearFavorites } = useFavorites();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFavoriteProperties() {
      if (favorites.length === 0) {
        setProperties([]);
        setLoading(false);
        return;
      }

      try {
        // Fetch only favorite properties
        const response = await fetch(
          `/api/properties?ids=${favorites.join(',')}`
        );
        const data = await response.json();

        setProperties(data.data);
      } catch (error) {
        console.error('Error fetching favorite properties:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFavoriteProperties();
  }, [favorites]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div>
            <h1 className={styles.title}>Meus Favoritos</h1>
            <p className={styles.subtitle}>
              {favorites.length === 0
                ? 'Você ainda não tem imóveis favoritos'
                : `Você tem ${favorites.length} ${favorites.length === 1 ? 'imóvel salvo' : 'imóveis salvos'}`}
            </p>
          </div>
          {favorites.length > 0 && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={clearFavorites}
            >
              Limpar todos
            </button>
          )}
        </div>
      </header>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Carregando seus favoritos...</p>
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
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <h2 className={styles.emptyTitle}>Nenhum favorito ainda</h2>
          <p className={styles.emptyText}>
            Encontre imóveis que você gosta e clique no coração para salvá-los
            aqui.
          </p>
          <Link href="/venda" className={styles.exploreButton}>
            Ver imóveis
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
