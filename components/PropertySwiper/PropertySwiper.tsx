'use client';

import { Property } from '@/types/property';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Navigation } from 'swiper/modules';
import { useState, useEffect, useRef } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import styles from './PropertySwiper.module.css';
import { CardHome } from '@/components/CardHome';
import Link from 'next/link';

interface PropertySwiperProps {
  title: string;
  type?: 'highlighted' | 'exclusive';
  properties?: Property[];
}

export function PropertySwiper({
  title,
  type,
  properties: propProperties,
}: PropertySwiperProps) {
  const [properties, setProperties] = useState<Property[]>(
    propProperties || []
  );
  const [loading, setLoading] = useState(!propProperties);
  const [prevEl, setPrevEl] = useState<HTMLButtonElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLButtonElement | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  // Fetch properties based on type (only if properties not provided)
  useEffect(() => {
    if (propProperties) {
      setProperties(propProperties);
      setLoading(false);
      return;
    }

    if (!type) {
      return;
    }

    const fetchProperties = async () => {
      try {
        setLoading(true);
        const endpoint =
          type === 'highlighted'
            ? '/api/properties/highlighted'
            : '/api/properties/exclusive';
        const response = await fetch(endpoint);
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error(`Error fetching ${type} properties:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [type, propProperties]);

  // Update navigation when buttons are mounted
  useEffect(() => {
    if (swiperRef.current && prevEl && nextEl) {
      const swiper = swiperRef.current;
      if (
        typeof swiper.params.navigation !== 'boolean' &&
        swiper.params.navigation
      ) {
        swiper.params.navigation.prevEl = prevEl;
        swiper.params.navigation.nextEl = nextEl;

        // Reinitialize navigation
        swiper.navigation.destroy();
        swiper.navigation.init();
        swiper.navigation.update();
      }
    }
  }, [prevEl, nextEl]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>{title}</h2>
          <Link href="/venda" className={styles.link}>
            Ver todos
          </Link>
        </div>
        <div className={styles.skeletonWrapper}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className={styles.skeletonCard}>
              <div className={styles.skeletonImage} />
              <div className={styles.skeletonContent}>
                <div className={styles.skeletonTitle} />
                <div className={styles.skeletonLocation} />
                <div className={styles.skeletonFeatures}>
                  <div className={styles.skeletonFeature} />
                  <div className={styles.skeletonFeature} />
                  <div className={styles.skeletonFeature} />
                </div>
                <div className={styles.skeletonPrice} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>{title}</h2>
        <Link href="/venda" className={styles.link}>
          Ver todos
        </Link>
      </div>

      <div className={styles.swiperWrapper}>
        {/* Botão Anterior - Fora do Swiper */}
        <button
          ref={(node) => setPrevEl(node)}
          className={`${styles.navButton} ${styles.navButtonPrev}`}
          aria-label="Anterior"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>

        <Swiper
          modules={[Navigation]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          spaceBetween={20}
          slidesPerView={'auto'}
          centeredSlides={false}
          centerInsufficientSlides={true}
          draggable={true}
          navigation={{
            prevEl,
            nextEl,
          }}
          breakpoints={{
            768: {
              slidesPerView: 'auto',
              centeredSlides: true,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 'auto',
              centeredSlides: false,
              spaceBetween: 20,
            },
            1280: {
              slidesPerView: 'auto',
              centeredSlides: false,
              spaceBetween: 20,
            },
          }}
          className={styles.swiper}
        >
          {properties.map((property) => (
            <SwiperSlide key={property.id}>
              <CardHome property={property} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Botão Próximo - Fora do Swiper */}
        <button
          ref={(node) => setNextEl(node)}
          className={`${styles.navButton} ${styles.navButtonNext}`}
          aria-label="Próximo"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
