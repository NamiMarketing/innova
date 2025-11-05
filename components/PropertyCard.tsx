'use client';

import { Property } from '@/types/property';
import Image from 'next/image';
import Link from 'next/link';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      apartment: 'Apartamento',
      house: 'Casa',
      commercial: 'Comercial',
      land: 'Terreno',
      farm: 'Chácara/Fazenda',
    };
    return labels[category] || category;
  };

  const getTypeLabel = (type: string) => {
    return type === 'sale' ? 'Venda' : 'Aluguel';
  };

  const mainImage = property.images?.[0]?.url || '/placeholder-property.jpg';
  const address = `${property.address.neighborhood}, ${property.address.city} - ${property.address.state}`;

  return (
    <Link href={`/imovel/${property.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
        {/* Imagem */}
        <div className="relative h-56 bg-gray-200">
          <Image
            src={mainImage}
            alt={property.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Badge de tipo */}
          <div className="absolute top-3 left-3">
            <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
              {getTypeLabel(property.type)}
            </span>
          </div>

          {/* Badge de destaque */}
          {property.highlighted && (
            <div className="absolute top-3 right-3">
              <span className="bg-accent text-white px-3 py-1 rounded-full text-xs font-semibold">
                Destaque
              </span>
            </div>
          )}

          {/* Código do imóvel */}
          <div className="absolute bottom-3 right-3">
            <span className="bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
              Cód: {property.code}
            </span>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-4 flex flex-col flex-1">
          {/* Categoria */}
          <div className="text-xs text-gray-medium font-medium mb-2">
            {getCategoryLabel(property.category)}
          </div>

          {/* Título */}
          <h3 className="text-lg font-bold text-gray-dark mb-2 line-clamp-2 min-h-[3.5rem]">
            {property.title}
          </h3>

          {/* Endereço */}
          <p className="text-sm text-gray-medium mb-3 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {address}
          </p>

          {/* Características */}
          <div className="flex items-center gap-4 text-sm text-gray-dark mb-4 pb-4 border-b">
            {property.features.bedrooms > 0 && (
              <div className="flex items-center gap-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>{property.features.bedrooms}</span>
              </div>
            )}
            {property.features.bathrooms > 0 && (
              <div className="flex items-center gap-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
                <span>{property.features.bathrooms}</span>
              </div>
            )}
            {property.features.parkingSpaces > 0 && (
              <div className="flex items-center gap-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
                <span>{property.features.parkingSpaces}</span>
              </div>
            )}
            {property.features.area > 0 && (
              <div className="flex items-center gap-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span>{property.features.area}m²</span>
              </div>
            )}
          </div>

          {/* Preço */}
          <div className="mt-auto">
            <div className="text-2xl font-bold text-primary mb-1">
              {formatPrice(property.price)}
            </div>
            {property.type === 'rent' && (property.condoFee || property.iptu) && (
              <div className="text-xs text-gray-medium">
                {property.condoFee && <span>Condomínio: {formatPrice(property.condoFee)}</span>}
                {property.condoFee && property.iptu && <span> • </span>}
                {property.iptu && <span>IPTU: {formatPrice(property.iptu)}</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
