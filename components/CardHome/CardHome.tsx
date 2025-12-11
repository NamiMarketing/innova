'use client';

import { Property } from '@/types/property';
import Image from 'next/image';
import Link from 'next/link';
import styles from './CardHome.module.css';
import parking from '@/img/parking.svg';
import bathroom from '@/img/bathroom.svg';
import bedroom from '@/img/bedroom.svg';
import area from '@/img/area.svg';
import toilet from '@/img/toilet.png';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { useState, useRef } from 'react';

interface PropertyCardProps {
  property: Property;
}

export function CardHome({ property }: PropertyCardProps) {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

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

  const images = property.images?.slice(0, 5) || [];
  if (images.length === 0) {
    images.push({
      url: '/placeholder-property.jpg',
      id: 'placeholder',
      order: 0,
    });
  }

  const addressLineOne = property.address
    ? `${property.address.street || ''}, ${property.address.number || ''}`
        .replace(/^, |, - $/, '')
        .trim()
    : 'Endereco nao disponivel';
  const addressLineTwo = property.address
    ? `${property.address.neighborhood || ''} - ${property.address.city || ''}/${property.address.state || ''}`
        .replace(/^, |, - $/, '')
        .trim()
    : 'Endereco nao disponivel';

  return (
    <Link href={`/imovel/${property.id}`} className={styles.link}>
      <div className={styles.card}>
        {/* Imagem / Swiper */}
        <div className={styles.imageContainer}>
          <Swiper
            modules={[Navigation]}
            onSwiper={setSwiper}
            slidesPerView={1}
            spaceBetween={0}
            allowTouchMove={true}
            onBeforeInit={(swiper) => {
              // Override navigation elements
              if (
                typeof swiper.params.navigation !== 'boolean' &&
                swiper.params.navigation
              ) {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }
            }}
          >
            {images.map((image, index) => (
              <SwiperSlide key={image.id || index}>
                <div className={styles.slideContent}>
                  <Image
                    src={image.url}
                    alt={property.title}
                    fill
                    className={styles.image}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Codigo do imovel */}
          <div className={styles.codeBadge}>{property.code}</div>

          {/* Navegação Customizada */}
          {images.length > 1 && (
            <div className={styles.navigation}>
              <button
                ref={prevRef}
                className={styles.navButton}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  swiper?.slidePrev();
                }}
              >
                <svg
                  width="6"
                  height="10"
                  viewBox="0 0 6 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 9L1 5L5 1"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                ref={nextRef}
                className={styles.navButton}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  swiper?.slideNext();
                }}
              >
                <svg
                  width="6"
                  height="10"
                  viewBox="0 0 6 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 9L5 5L1 1"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Conteudo */}
        <div className={styles.content}>
          <div className={styles.typeContainer}>
            <div className={styles.typeBadge}>
              {getTypeLabel(property.type)}
            </div>
            <p>•</p>
            <div className={styles.category}>
              {getCategoryLabel(property.category)}
            </div>
          </div>

          {/* Preco */}
          <div className={styles.priceContainer}>
            <div className={styles.price}>{formatPrice(property.price)}</div>
            {property.type === 'rent' &&
              (property.condoFee || property.iptu) && (
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
                <Image
                  src={bedroom}
                  alt="icone de quarto"
                  width={15}
                  height={12}
                />
                <span className={styles.featureValue}>
                  {property.features.bedrooms}
                </span>
              </div>
            )}
            {property.features.bathrooms > 0 && (
              <div className={styles.feature}>
                <Image
                  src={bathroom}
                  alt="icone de banheiro"
                  width={12}
                  height={15}
                />
                <span className={styles.featureValue}>
                  {property.features.bathrooms}
                </span>
              </div>
            )}
            {property.features.totalBaths > 0 && (
              <div className={styles.feature}>
                <Image
                  src={toilet}
                  alt="icone de banheiro"
                  width={12}
                  height={12}
                />
                <span className={styles.featureValue}>
                  {property.features.totalBaths}
                </span>
              </div>
            )}
            {property.features.parkingSpaces > 0 && (
              <div className={styles.feature}>
                <Image
                  src={parking}
                  alt="icone de carro"
                  width={12}
                  height={12}
                />
                <span className={styles.featureValue}>
                  {property.features.parkingSpaces}
                </span>
              </div>
            )}
            {property.features.area > 0 && (
              <div className={styles.feature}>
                <Image src={area} alt="icone de area" width={12} height={12} />
                <span className={styles.featureValue}>
                  {property.features.area}m2
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
