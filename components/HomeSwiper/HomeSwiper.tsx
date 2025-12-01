'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Image from 'next/image';
import swiperOne from '@/img/home/swiper1.png'
import swiperTwo from '@/img/home/swiper2.png'

export function HomeSwiper() {
  return (
    <Swiper
      spaceBetween={20}
      slidesPerView={1}
      breakpoints={{
        640: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 4,
        },
      }}
    >
      <SwiperSlide>
        <Image src={swiperOne} alt='Imagem de imóvel' />
      </SwiperSlide>
      <SwiperSlide>
        <Image src={swiperTwo} alt='Imagem de imóvel' />
      </SwiperSlide>
    </Swiper>
  );
}
