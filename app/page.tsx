'use client';

import { useState, useMemo } from 'react';
import PropertyFilters from '@/components/PropertyFilters';
import PropertyCard from '@/components/PropertyCard';
import { PropertyFilters as PropertyFiltersType, Property } from '@/types/property';
import { mockProperties } from '@/lib/mockData';

export default function Home() {
  const [filters, setFilters] = useState<PropertyFiltersType>({});
  const [loading, setLoading] = useState(false);

  // Filtrar propriedades baseado nos filtros aplicados
  const filteredProperties = useMemo(() => {
    let result = [...mockProperties];

    if (filters.type) {
      result = result.filter(p => p.type === filters.type);
    }

    if (filters.category) {
      result = result.filter(p => p.category === filters.category);
    }

    if (filters.city) {
      result = result.filter(p =>
        p.address.city.toLowerCase().includes(filters.city!.toLowerCase())
      );
    }

    if (filters.neighborhood) {
      result = result.filter(p =>
        p.address.neighborhood.toLowerCase().includes(filters.neighborhood!.toLowerCase())
      );
    }

    if (filters.minPrice) {
      result = result.filter(p => p.price >= filters.minPrice!);
    }

    if (filters.maxPrice) {
      result = result.filter(p => p.price <= filters.maxPrice!);
    }

    if (filters.minBedrooms) {
      result = result.filter(p => p.features.bedrooms >= filters.minBedrooms!);
    }

    if (filters.minBathrooms) {
      result = result.filter(p => p.features.bathrooms >= filters.minBathrooms!);
    }

    if (filters.minParkingSpaces) {
      result = result.filter(p => p.features.parkingSpaces >= filters.minParkingSpaces!);
    }

    if (filters.minArea) {
      result = result.filter(p => p.features.area >= filters.minArea!);
    }

    if (filters.maxArea) {
      result = result.filter(p => p.features.area <= filters.maxArea!);
    }

    return result;
  }, [filters]);

  const handleFilterChange = (newFilters: PropertyFiltersType) => {
    setLoading(true);
    setFilters(newFilters);

    // Simular delay de API
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gray-light">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-light text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Encontre o Imóvel dos Seus Sonhos
            </h1>
            <p className="text-lg md:text-xl text-blue-100">
              A Innova Imobiliária oferece as melhores opções de imóveis em Curitiba e região.
              Seu novo lar está aqui!
            </p>
          </div>
        </div>
      </section>

      {/* Filtros e Listagem */}
      <section className="container mx-auto px-4 py-8">
        <PropertyFilters onFilterChange={handleFilterChange} initialFilters={filters} />

        {/* Resultados */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-dark">
            {filteredProperties.length === 0 ? (
              'Nenhum imóvel encontrado'
            ) : (
              <>
                {filteredProperties.length} {filteredProperties.length === 1 ? 'Imóvel Encontrado' : 'Imóveis Encontrados'}
              </>
            )}
          </h2>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {filteredProperties.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
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
                <h3 className="text-xl font-semibold text-gray-dark mb-2">
                  Nenhum imóvel encontrado
                </h3>
                <p className="text-gray-medium">
                  Tente ajustar os filtros para encontrar mais opções
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16 mt-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Não Encontrou o que Procura?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Nossa equipe está pronta para ajudá-lo a encontrar o imóvel perfeito.
            Entre em contato conosco!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contato"
              className="bg-white text-primary hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Falar com Corretor
            </a>
            <a
              href="/anunciar"
              className="bg-accent hover:bg-yellow-500 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Anunciar Meu Imóvel
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
