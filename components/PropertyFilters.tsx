'use client';

import { useState } from 'react';
import { PropertyFilters as PropertyFiltersType, PropertyType, PropertyCategory } from '@/types/property';

interface PropertyFiltersProps {
  onFilterChange: (filters: PropertyFiltersType) => void;
  initialFilters?: PropertyFiltersType;
}

export default function PropertyFilters({ onFilterChange, initialFilters = {} }: PropertyFiltersProps) {
  const [filters, setFilters] = useState<PropertyFiltersType>(initialFilters);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Helper function to remove empty values from filters
  const cleanFilters = (filterObj: PropertyFiltersType): PropertyFiltersType => {
    const cleaned: PropertyFiltersType = {};
    Object.entries(filterObj).forEach(([key, value]) => {
      // Only include non-empty values (excluding empty strings, null, undefined)
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
    <div className="bg-white rounded-xl shadow-xl px-6 py-6 mb-10 border border-gray-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-dark flex items-center gap-2">
          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filtrar Imóveis
        </h2>
        <p className="text-gray-medium text-sm mt-1">Encontre o imóvel perfeito para você</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          {/* Tipo */}
          <div>
            <label className="block text-sm font-semibold text-gray-dark mb-2.5">
              Tipo de Negócio
            </label>
            <select
              value={filters.type || ''}
              onChange={(e) => handleChange('type', e.target.value as PropertyType)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-gray-50 hover:bg-white"
            >
              <option value="">Todos</option>
              <option value="sale">Venda</option>
              <option value="rent">Aluguel</option>
            </select>
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-semibold text-gray-dark mb-2.5">
              Tipo de Imóvel
            </label>
            <select
              value={filters.category || ''}
              onChange={(e) => handleChange('category', e.target.value as PropertyCategory)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-gray-50 hover:bg-white"
            >
              <option value="">Todos</option>
              <option value="apartment">Apartamento</option>
              <option value="house">Casa</option>
              <option value="commercial">Comercial</option>
              <option value="land">Terreno</option>
              <option value="farm">Chácara/Fazenda</option>
            </select>
          </div>

          {/* Cidade */}
          <div>
            <label className="block text-sm font-semibold text-gray-dark mb-2.5">
              Cidade
            </label>
            <input
              type="text"
              value={filters.city || ''}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="Ex: Curitiba"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-gray-50 hover:bg-white placeholder:text-gray-400"
            />
          </div>

          {/* Bairro */}
          <div>
            <label className="block text-sm font-semibold text-gray-dark mb-2.5">
              Bairro
            </label>
            <input
              type="text"
              value={filters.neighborhood || ''}
              onChange={(e) => handleChange('neighborhood', e.target.value)}
              placeholder="Ex: Centro"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-gray-50 hover:bg-white placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Filtros Avançados */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-primary hover:text-primary-dark font-semibold mb-6 flex items-center gap-2 transition-colors group"
        >
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
            {showAdvanced ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </span>
          {showAdvanced ? 'Menos filtros' : 'Mais filtros'}
        </button>

        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6 pb-6 border-b border-gray-100">
            {/* Preço Mínimo */}
            <div>
              <label className="block text-sm font-semibold text-gray-dark mb-2.5">
                Preço Mínimo
              </label>
              <input
                type="number"
                value={filters.minPrice || ''}
                onChange={(e) => handleChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="R$ 0"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-gray-50 hover:bg-white placeholder:text-gray-400"
              />
            </div>

            {/* Preço Máximo */}
            <div>
              <label className="block text-sm font-semibold text-gray-dark mb-2.5">
                Preço Máximo
              </label>
              <input
                type="number"
                value={filters.maxPrice || ''}
                onChange={(e) => handleChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="R$ 0"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-gray-50 hover:bg-white placeholder:text-gray-400"
              />
            </div>

            {/* Quartos */}
            <div>
              <label className="block text-sm font-semibold text-gray-dark mb-2.5">
                Quartos (mín)
              </label>
              <select
                value={filters.minBedrooms || ''}
                onChange={(e) => handleChange('minBedrooms', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-gray-50 hover:bg-white"
              >
                <option value="">Qualquer</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>

            {/* Banheiros */}
            <div>
              <label className="block text-sm font-semibold text-gray-dark mb-2.5">
                Banheiros (mín)
              </label>
              <select
                value={filters.minBathrooms || ''}
                onChange={(e) => handleChange('minBathrooms', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-gray-50 hover:bg-white"
              >
                <option value="">Qualquer</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>

            {/* Vagas */}
            <div>
              <label className="block text-sm font-semibold text-gray-dark mb-2.5">
                Vagas (mín)
              </label>
              <select
                value={filters.minParkingSpaces || ''}
                onChange={(e) => handleChange('minParkingSpaces', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-gray-50 hover:bg-white"
              >
                <option value="">Qualquer</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>

            {/* Área Mínima */}
            <div>
              <label className="block text-sm font-semibold text-gray-dark mb-2.5">
                Área Mínima (m²)
              </label>
              <input
                type="number"
                value={filters.minArea || ''}
                onChange={(e) => handleChange('minArea', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="0"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-gray-50 hover:bg-white placeholder:text-gray-400"
              />
            </div>

            {/* Área Máxima */}
            <div>
              <label className="block text-sm font-semibold text-gray-dark mb-2.5">
                Área Máxima (m²)
              </label>
              <input
                type="number"
                value={filters.maxArea || ''}
                onChange={(e) => handleChange('maxArea', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="0"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-gray-50 hover:bg-white placeholder:text-gray-400"
              />
            </div>
          </div>
        )}

        {/* Botões */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Buscar Imóveis
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-3 border-2 border-gray-300 text-gray-dark hover:bg-gray-50 hover:border-gray-400 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Limpar Filtros
          </button>
        </div>
      </form>
    </div>
  );
}
