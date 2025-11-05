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

  const handleChange = (key: keyof PropertyFiltersType, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  const handleReset = () => {
    setFilters({});
    onFilterChange({});
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-dark mb-2">
              Tipo de Negócio
            </label>
            <select
              value={filters.type || ''}
              onChange={(e) => handleChange('type', e.target.value as PropertyType)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Todos</option>
              <option value="sale">Venda</option>
              <option value="rent">Aluguel</option>
            </select>
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-dark mb-2">
              Tipo de Imóvel
            </label>
            <select
              value={filters.category || ''}
              onChange={(e) => handleChange('category', e.target.value as PropertyCategory)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
            <label className="block text-sm font-medium text-gray-dark mb-2">
              Cidade
            </label>
            <input
              type="text"
              value={filters.city || ''}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="Ex: Curitiba"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Bairro */}
          <div>
            <label className="block text-sm font-medium text-gray-dark mb-2">
              Bairro
            </label>
            <input
              type="text"
              value={filters.neighborhood || ''}
              onChange={(e) => handleChange('neighborhood', e.target.value)}
              placeholder="Ex: Centro"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Filtros Avançados */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-primary hover:text-primary-dark font-medium mb-4 flex items-center gap-2"
        >
          {showAdvanced ? '- Menos filtros' : '+ Mais filtros'}
        </button>

        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 pb-4 border-b">
            {/* Preço Mínimo */}
            <div>
              <label className="block text-sm font-medium text-gray-dark mb-2">
                Preço Mínimo
              </label>
              <input
                type="number"
                value={filters.minPrice || ''}
                onChange={(e) => handleChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="R$ 0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Preço Máximo */}
            <div>
              <label className="block text-sm font-medium text-gray-dark mb-2">
                Preço Máximo
              </label>
              <input
                type="number"
                value={filters.maxPrice || ''}
                onChange={(e) => handleChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="R$ 0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Quartos */}
            <div>
              <label className="block text-sm font-medium text-gray-dark mb-2">
                Quartos (mín)
              </label>
              <select
                value={filters.minBedrooms || ''}
                onChange={(e) => handleChange('minBedrooms', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
              <label className="block text-sm font-medium text-gray-dark mb-2">
                Banheiros (mín)
              </label>
              <select
                value={filters.minBathrooms || ''}
                onChange={(e) => handleChange('minBathrooms', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
              <label className="block text-sm font-medium text-gray-dark mb-2">
                Vagas (mín)
              </label>
              <select
                value={filters.minParkingSpaces || ''}
                onChange={(e) => handleChange('minParkingSpaces', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
              <label className="block text-sm font-medium text-gray-dark mb-2">
                Área Mínima (m²)
              </label>
              <input
                type="number"
                value={filters.minArea || ''}
                onChange={(e) => handleChange('minArea', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Área Máxima */}
            <div>
              <label className="block text-sm font-medium text-gray-dark mb-2">
                Área Máxima (m²)
              </label>
              <input
                type="number"
                value={filters.maxArea || ''}
                onChange={(e) => handleChange('maxArea', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Botões */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Buscar Imóveis
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-3 border border-gray-300 text-gray-dark hover:bg-gray-50 rounded-lg font-semibold transition-colors"
          >
            Limpar Filtros
          </button>
        </div>
      </form>
    </div>
  );
}
