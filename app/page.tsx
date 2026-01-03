import { HomeSearch } from '@/components/HomeSearch';
import Image from 'next/image';
import styles from './page.module.css';
import headerImg from '@/img/home/header.png';
import {
  getHighlightedProperties,
  getExclusiveProperties,
} from '@/services/properfy';
import { safeFetch } from '@/lib/safe-fetch';
import Link from 'next/link';
import cardImg from '@/img/home/card-image.png';
import logoCard from '@/img/home/logo-card.png';
import { PropertySwiper } from '@/components/PropertySwiper';
import { TestimonialSwiper } from '@/components/TestimonialSwiper/TestimonialSwiper';
import itemCasa from '@/img/home/item-casa.png';
import itemAp from '@/img/home/item-ap.png';
import itemComercial from '@/img/home/item-comercial.png';
import itemTerreno from '@/img/home/item-terreno.png';
import itemPlanta from '@/img/home/item-planta.png';
import escolherBack from '@/img/home/escolher-back.png';
import fachada from '@/img/home/fachada.png';
import atendimento from '@/img/home/atendimento.png';
import rapido from '@/img/home/rapido.png';
import variedade from '@/img/home/variedade.png';
import transparencia from '@/img/home/transparencia.png';
import suporte from '@/img/home/suporte.png';

export default async function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const filterOptionsRes = await fetch(`${baseUrl}/api/filter-options`, {
    next: { revalidate: 14400 }, // 4 hours
  });
  const options = filterOptionsRes.ok ? await filterOptionsRes.json() : null;
  const cities = options?.cities ?? [];
  const neighborhoodsByCity = options?.neighborhoodsByCity ?? {};
  const types = options?.types ?? [];

  // Fetch properties for swiper sections
  const { data: highlightedProperties } = await safeFetch(
    getHighlightedProperties(10)
  );
  const { data: exclusiveProperties } = await safeFetch(
    getExclusiveProperties(10)
  );

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        {/* Background Pattern */}
        <div className={styles.heroPattern}>
          <Image
            src={headerImg}
            alt="Header"
            fill
            className={styles.heroPatternInner}
          />
        </div>

        <div className={styles.heroContent}>
          <div className={styles.heroInner}>
            <HomeSearch
              cities={cities}
              neighborhoodsByCity={neighborhoodsByCity}
              types={types}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.card}>
        <div className={styles.cardContent}>
          <div className={styles.leftCard}>
            <h2>
              Tecnologia, praticidade e confiança — tudo no mesmo lugar para
              facilitar a sua jornada imobiliária.
            </h2>
            <p>
              Simplificamos a experiência de alugar, vender e comprar imóveis,
              combinando atendimento humano com a agilidade do digital.
            </p>
            <Link href="/contato" className={styles.cardButton}>
              Entre em contato
            </Link>
          </div>
          <Image
            src={cardImg}
            className={styles.cardImg}
            alt="Imagem de um casal segurando uma chave"
          />
          <Image
            className={styles.logoCard}
            src={logoCard}
            alt="Logo da Innova"
          />
        </div>
      </section>

      <section className={styles.descubra}>
        <h2>Descubra o imóvel ideal para o que você precisa</h2>
        <div className={styles.descubraItens}>
          <div className={styles.descubraItem}>
            <Image src={itemCasa} alt="ícone de casa" />
            <p>Casas</p>
          </div>
          <div className={styles.descubraItem}>
            <Image src={itemAp} alt="ícone de apartamentos" />
            <p>Apartamentos</p>
          </div>
          <div className={styles.descubraItem}>
            <Image src={itemComercial} alt="ícone de comercial" />
            <p>Comercial</p>
          </div>
          <div className={styles.descubraItem}>
            <Image src={itemTerreno} alt="ícone de terrenos" />
            <p>Terrenos</p>
          </div>
          <div className={styles.descubraItem}>
            <Image src={itemPlanta} alt="ícone de planta de imóvel" />
            <p>Na planta</p>
          </div>
        </div>
      </section>

      {/* imoveis em destaque swiper */}
      <PropertySwiper
        title="Imóveis em destaque"
        properties={highlightedProperties ?? []}
      />

      {/* imoveis exclusivos swiper */}
      <PropertySwiper
        title="Exclusivos Innova"
        properties={exclusiveProperties ?? []}
      />

      <section className={styles.escolher}>
        <Image
          className={styles.escolherBack}
          src={escolherBack}
          alt="Logo da Innova"
        />
        <div className={styles.escolherContainer}>
          <Image
            className={styles.fachada}
            src={fachada}
            alt="Imagem da fachada da Innova imobiliária"
          />
          <div className={styles.escolherContent}>
            <h1>Por que escolher a Innova?</h1>
            <div className={styles.escolherItens}>
              <div className={styles.escolherItem}>
                <Image
                  src={atendimento}
                  width={46}
                  height={46}
                  alt="ícone de atendimento"
                />
                <p>Atendimento ágil e digital</p>
              </div>
              <div className={styles.escolherItem}>
                <Image
                  src={rapido}
                  width={46}
                  height={46}
                  alt="ícone de rapido"
                />
                <p>Processo menos burocrático e rápido</p>
              </div>
              <div className={styles.escolherItem}>
                <Image
                  src={variedade}
                  width={46}
                  height={46}
                  alt="ícone de variedade"
                />
                <p>Variedade de opções em compra e locação</p>
              </div>
              <div className={styles.escolherItem}>
                <Image
                  src={transparencia}
                  width={46}
                  height={46}
                  alt="ícone de transparencia"
                />
                <p>Transparência e clareza nas negociações</p>
              </div>
              <div className={styles.escolherItem}>
                <Image
                  src={suporte}
                  width={46}
                  height={46}
                  alt="ícone de suporte"
                />
                <p>Suporte completo para locadores e locatários</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TestimonialSwiper />
    </div>
  );
}
