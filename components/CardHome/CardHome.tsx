'use client';

import { Property } from '@/types/property';
import Image from 'next/image';
import Link from 'next/link';
import styles from './CardHome.module.css';
import parking from '@/img/parking.svg';
import bathroom from '@/img/bathroom.svg';
import bedroom from '@/img/bedroom.svg';
import area from '@/img/area.svg';

interface PropertyCardProps {
  property: Property;
}

export function CardHome({ property }: PropertyCardProps) {
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
  const addressLineOne = property.address
    ? `${property.address.street || ''}, ${property.address.number || ''}`.replace(/^, |, - $/, '').trim()
    : 'Endereco nao disponivel';
  const addressLineTwo = property.address
    ? `${property.address.neighborhood || ''} - ${property.address.city || ''}/${property.address.state || ''}`.replace(/^, |, - $/, '').trim()
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

          {/* Codigo do imovel */}
          <div className={styles.codeBadge}>{property.code}</div>
        </div>

        {/* Conteudo */}
        <div className={styles.content}>
          <div className={styles.typeContainer}>
            <div className={styles.typeBadge}>{getTypeLabel(property.type)}</div>
            <p>•</p>
            <div className={styles.category}>
              {getCategoryLabel(property.category)}
            </div>
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

          {/* Endereco */}
          <p className={styles.address}>
            <span className={styles.addressText}>{addressLineOne}</span>
            <span className={styles.addressText}>{addressLineTwo}</span>
          </p>

          {/* Caracteristicas */}
          <div className={styles.features}>
            {property.features.bedrooms > 0 && (
              <div className={styles.feature}>
                <Image src={bedroom} alt="icone de quarto" width={15} height={12} />
                <span className={styles.featureValue}>{property.features.bedrooms}</span>
              </div>
            )}
            {property.features.bathrooms > 0 && (
              <div className={styles.feature}>
                <Image src={bathroom} alt="icone de banheiro" width={12} height={15} />
                <span className={styles.featureValue}>{property.features.bathrooms}</span>
              </div>
            )}
            {property.features.parkingSpaces > 0 && (
              <div className={styles.feature}>
                <Image src={parking} alt="icone de carro" width={12} height={12} />
                <span className={styles.featureValue}>{property.features.parkingSpaces}</span>
              </div>
            )}
            {property.features.area > 0 && (
              <div className={styles.feature}>
                <Image src={area} alt="icone de area" width={12} height={12} />
                <span className={styles.featureValue}>{property.features.area}m2</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </Link>
  );
}
