'use client';

import { useState, useEffect, useRef } from 'react';
import PropertyFilters from '@/components/PropertyFilters';
import PropertyCard from '@/components/PropertyCard';
import { PropertyFilters as PropertyFiltersType, Property } from '@/types/property';
import { properfyService } from '@/services/properfy';

interface PropertyListingProps {
  initialProperties: Property[];
  initialTotal: number;
}

export default function PropertyListing({ initialProperties, initialTotal }: PropertyListingProps) {
  const [filters, setFilters] = useState<PropertyFiltersType>({});
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(initialTotal);
  const isFirstRender = useRef(true);

  // Fetch properties when filters change
  useEffect(() => {
    // Skip the initial render (we already have initialProperties)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await properfyService.getProperties(filters);
        setProperties(response.data);
        setTotal(response.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load properties');
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [filters]);

  const handleFilterChange = (newFilters: PropertyFiltersType) => {
    setFilters(newFilters);
  };

  return (
    <section className="container mx-auto px-4 py-12">
      <PropertyFilters onFilterChange={handleFilterChange} initialFilters={filters} />

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-r-lg mb-8 shadow-md">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-bold text-lg">Erro ao carregar imóveis</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Resultados Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-dark flex items-center gap-3">
            {total === 0 ? (
              <>
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Nenhum imóvel encontrado
              </>
            ) : (
              <>
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>
                  {total} {total === 1 ? 'Imóvel Encontrado' : 'Imóveis Encontrados'}
                </span>
              </>
            )}
          </h2>
          {total > 0 && (
            <p className="text-gray-medium mt-2">Encontramos as melhores opções para você</p>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
              <div className="h-64 bg-gray-200"></div>
              <div className="p-6 space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="flex gap-4">
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {properties.length === 0 ? (
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl p-16 text-center border border-gray-100">
              <div className="max-w-md mx-auto">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
                  <svg
                    className="w-10 h-10 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-dark mb-3">
                  Nenhum imóvel encontrado
                </h3>
                <p className="text-gray-medium text-lg mb-6">
                  Não encontramos imóveis com os filtros selecionados.
                  Tente ajustar os critérios para ver mais opções.
                </p>
                <button
                  onClick={() => {
                    setFilters({});
                    handleFilterChange({});
                  }}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Limpar Filtros
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
