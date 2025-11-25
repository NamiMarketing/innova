'use client';

import { Property } from '@/types/property';
import Image from 'next/image';
import Link from 'next/link';
import styles from './PropertyCard.module.css';

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
      farm: 'Chacara/Fazenda',
    };
    return labels[category] || category;
  };

  const getTypeLabel = (type: string) => {
    return type === 'sale' ? 'Venda' : 'Aluguel';
  };

  const mainImage = property.images?.[0]?.url || '/placeholder-property.jpg';
  const address = property.address
    ? `${property.address.neighborhood || ''}, ${property.address.city || ''} - ${property.address.state || ''}`.replace(/^, |, - $/, '').trim()
    : 'Endereco nao disponivel';

  return (
    <Link href={`/imovel/${property.id}`} className={styles.link}>
      <div className={styles.card}>
        {/* Imagem */}
        <div className={styles.imageContainer}>
          <Image
            src={mainImage}
            alt={property.title}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Gradient overlay */}
          <div className={styles.imageOverlay} />

          {/* Badge de tipo */}
          <div className={styles.typeBadge}>{getTypeLabel(property.type)}</div>

          {/* Badge de destaque */}
          {property.highlighted && (
            <div className={styles.highlightBadge}>
              <svg className={styles.highlightIcon} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Destaque
            </div>
          )}

          {/* Codigo do imovel */}
          <div className={styles.codeBadge}>Cod: {property.code}</div>
        </div>

        {/* Conteudo */}
        <div className={styles.content}>
          {/* Categoria */}
          <div className={styles.category}>
            <svg className={styles.categoryIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            {getCategoryLabel(property.category)}
          </div>

          {/* Titulo */}
          <h3 className={styles.title}>{property.title}</h3>

          {/* Endereco */}
          <p className={styles.address}>
            <svg className={styles.addressIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className={styles.addressText}>{address}</span>
          </p>

          {/* Caracteristicas */}
          <div className={styles.features}>
            {property.features.bedrooms > 0 && (
              <div className={styles.feature}>
                <svg className={styles.featureIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className={styles.featureValue}>{property.features.bedrooms}</span>
              </div>
            )}
            {property.features.bathrooms > 0 && (
              <div className={styles.feature}>
                <svg className={styles.featureIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
                <span className={styles.featureValue}>{property.features.bathrooms}</span>
              </div>
            )}
            {property.features.parkingSpaces > 0 && (
              <div className={styles.feature}>
                <svg className={styles.featureIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
                <span className={styles.featureValue}>{property.features.parkingSpaces}</span>
              </div>
            )}
            {property.features.area > 0 && (
              <div className={styles.feature}>
                <svg className={styles.featureIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span className={styles.featureValue}>{property.features.area}m2</span>
              </div>
            )}
          </div>

          {/* Preco */}
          <div className={styles.priceContainer}>
            <div className={styles.price}>{formatPrice(property.price)}</div>
            {property.type === 'rent' && (property.condoFee || property.iptu) && (
              <div className={styles.extraCosts}>
                {property.condoFee && (
                  <div className={styles.extraCost}>
                    <span className={styles.extraCostPlus}>+</span>
                    <span>Condominio: {formatPrice(property.condoFee)}</span>
                  </div>
                )}
                {property.iptu && (
                  <div className={styles.extraCost}>
                    <span className={styles.extraCostPlus}>+</span>
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
