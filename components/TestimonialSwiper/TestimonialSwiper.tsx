'use client';

import Image from 'next/image';
import type { StaticImageData } from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { useState, useEffect, useRef } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import styles from './TestimonialSwiper.module.css';
import previous from '@/img/icons/previous.svg';
import next from '@/img/icons/next.svg';
import joao from '@/img/testimonials/joao.png';

interface Testimonial {
  id: number;
  text: string;
  name: string;
  avatar: StaticImageData;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'João Oliveira',
    text: 'Empresa séria, super profissional, Fui atendido desde o primeiro contato com muita clareza e transparência, tivemos a oportunidade de esclarecer todas as dúvidas e com uma negociação exclusiva, atendimento personalizado, desde diretoria e equipe de apoio, são sensacionais, com certeza é primeiro de muitos contratos que vamos fechar com Innova.',
    avatar: joao,
  },
  {
    id: 2,
    name: 'Carlos Souza',
    text: 'Excelente atendimento e suporte. A equipe foi muito atenciosa em todos os detalhes, desde a visita até a assinatura do contrato. Profissionalismo nota 10.',
    avatar: joao,
  },
  {
    id: 3,
    name: 'Mariana Oliveira',
    text: 'Gerenciar meus imóveis nunca foi tão fácil. A plataforma é intuitiva e o repasse é sempre pontual. A melhor parceira para proprietários.',
    avatar: joao,
  },
  {
    id: 4,
    name: 'Ricardo Santos',
    text: 'Estava com dificuldade para vender meu apartamento, mas com a Innova foi tudo muito ágil. As fotos profissionais fizeram toda a diferença.',
    avatar: joao,
  },
];

export function TestimonialSwiper() {
  const [prevEl, setPrevEl] = useState<HTMLButtonElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLButtonElement | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    if (swiperRef.current && prevEl && nextEl) {
      const swiper = swiperRef.current;
      if (
        typeof swiper.params.navigation !== 'boolean' &&
        swiper.params.navigation
      ) {
        swiper.params.navigation.prevEl = prevEl;
        swiper.params.navigation.nextEl = nextEl;

        swiper.navigation.destroy();
        swiper.navigation.init();
        swiper.navigation.update();
      }
    }
  }, [prevEl, nextEl]);

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>
          A confiança refletida na experiência de cada cliente
        </h2>
      </div>

      <button
        ref={(node) => setPrevEl(node)}
        className={`${styles.navButton} ${styles.navButtonPrev}`}
        aria-label="Anterior"
      >
        <Image src={previous} width={16} height={30} alt="Previous" />
      </button>
      <div className={styles.swiperWrapper}>
        <Swiper
          modules={[Navigation, Pagination]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          slidesPerView={1}
          loop={true}
          draggable={true}
          navigation={{
            prevEl,
            nextEl,
          }}
          pagination={{
            el: '.swiper-pagination',
            clickable: true,
          }}
          className={styles.swiper}
        >
          {TESTIMONIALS.map((item) => (
            <SwiperSlide key={item.id}>
              <div className={styles.card}>
                <div className={styles.avatar}>
                  {/* <Image
                    src={item.avatar}
                    width={80}
                    height={80}
                    alt={item.name}
                  /> */}
                </div>
                <div className={styles.author}>
                  <h4 className={styles.name}>{item.name}</h4>
                </div>
                <p className={styles.text}>{item.text}</p>
              </div>
            </SwiperSlide>
          ))}
          <div className="swiper-pagination"></div>
        </Swiper>
      </div>
      <button
        ref={(node) => setNextEl(node)}
        className={`${styles.navButton} ${styles.navButtonNext}`}
        aria-label="Próximo"
      >
        <Image src={next} width={16} height={30} alt="Next" />
      </button>
    </div>
  );
}
