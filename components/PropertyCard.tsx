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
  const address = property.address
    ? `${property.address.neighborhood || ''}, ${property.address.city || ''} - ${property.address.state || ''}`.replace(/^, |, - $/, '').trim()
    : 'Endereço não disponível';

  return (
    <Link href={`/imovel/${property.id}`} className="group">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col group-hover:-translate-y-1">
        {/* Imagem */}
        <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          <Image
            src={mainImage}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badge de tipo */}
          <div className="absolute top-4 left-4">
            <span className="bg-primary/90 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg">
              {getTypeLabel(property.type)}
            </span>
          </div>

          {/* Badge de destaque */}
          {property.highlighted && (
            <div className="absolute top-4 right-4">
              <span className="bg-accent/90 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Destaque
              </span>
            </div>
          )}

          {/* Código do imóvel */}
          <div className="absolute bottom-4 right-4">
            <span className="bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-medium shadow-lg">
              Cód: {property.code}
            </span>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-5 flex flex-col flex-1">
          {/* Categoria */}
          <div className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold mb-3 w-fit">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            {getCategoryLabel(property.category)}
          </div>

          {/* Título */}
          <h3 className="text-xl font-bold text-gray-dark mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-primary transition-colors">
            {property.title}
          </h3>

          {/* Endereço */}
          <p className="text-sm text-gray-medium mb-4 flex items-start gap-2">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="line-clamp-1">{address}</span>
          </p>

          {/* Características */}
          <div className="flex items-center gap-5 text-sm text-gray-dark mb-5 pb-5 border-b border-gray-100">
            {property.features.bedrooms > 0 && (
              <div className="flex items-center gap-1.5">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="font-semibold">{property.features.bedrooms}</span>
              </div>
            )}
            {property.features.bathrooms > 0 && (
              <div className="flex items-center gap-1.5">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
                <span className="font-semibold">{property.features.bathrooms}</span>
              </div>
            )}
            {property.features.parkingSpaces > 0 && (
              <div className="flex items-center gap-1.5">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
                <span className="font-semibold">{property.features.parkingSpaces}</span>
              </div>
            )}
            {property.features.area > 0 && (
              <div className="flex items-center gap-1.5">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span className="font-semibold">{property.features.area}m²</span>
              </div>
            )}
          </div>

          {/* Preço */}
          <div className="mt-auto">
            <div className="text-3xl font-bold text-primary mb-2">
              {formatPrice(property.price)}
            </div>
            {property.type === 'rent' && (property.condoFee || property.iptu) && (
              <div className="text-xs text-gray-500 space-y-0.5">
                {property.condoFee && (
                  <div className="flex items-center gap-1">
                    <span className="text-gray-400">+</span>
                    <span>Condomínio: {formatPrice(property.condoFee)}</span>
                  </div>
                )}
                {property.iptu && (
                  <div className="flex items-center gap-1">
                    <span className="text-gray-400">+</span>
                    <span>IPTU: {formatPrice(property.iptu)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
