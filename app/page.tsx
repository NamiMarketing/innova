import { HomeSearch } from '@/components/HomeSearch';
import Image from 'next/image';
import styles from './page.module.css';
import headerImg from '@/img/home/header.png';
import { getFilterOptions } from '@/services/properfy';
import { safeFetch } from '@/lib/safe-fetch';
import Link from 'next/link';
import cardImg from '@/img/home/card-image.png';
import logoCard from '@/img/home/logo-card.png';
import { HomeSwiper } from '@/components/HomeSwiper';
import itemImg from '@/img/home/item.png';

export default async function Home() {
  const { data: options } = await safeFetch(getFilterOptions());
  const cities = options?.cities ?? [];
  const neighborhoodsByCity = options?.neighborhoodsByCity ?? {};
  const types = options?.types ?? [];

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        {/* Background Pattern */}
        <div className={styles.heroPattern}>
          <Image src={headerImg} alt="Header" fill className={styles.heroPatternInner} />
        </div>

        <div className={styles.heroContent}>
          <div className={styles.heroInner}>
            <HomeSearch cities={cities} neighborhoodsByCity={neighborhoodsByCity} types={types} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.card}>
        <div className={styles.cardContent}>
          <div className={styles.leftCard}>
            <h2>Tecnologia, praticidade e confiança — tudo no mesmo lugar para facilitar a sua jornada imobiliária.</h2>
            <p>Simplificamos a experiência de alugar, vender e comprar imóveis, combinando atendimento humano com a agilidade do digital.</p>
            <Link href="/contato" className={styles.cardButton}>Entre em contato</Link>
          </div>
          <Image src={cardImg} alt="Imagem de um casal segurando uma chave" />
          <Image className={styles.logoCard} src={logoCard} alt="Logo da Innova" />
        </div>
      </section>

      <section className={styles.descubra}>
        <h2>Descubra o imóvel ideal para o que você precisa</h2>
        <div className={styles.descubraItens}>
          <div className={styles.descubraItem}>
            <Image src={itemImg} alt="ícone de casa" />
            <p>Casas</p>
          </div>
          <div className={styles.descubraItem}>
            <Image src={itemImg} alt="ícone de apartamentos" />
            <p>Apartamentos</p>
          </div>
          <div className={styles.descubraItem}>
            <Image src={itemImg} alt="ícone de comercial" />
            <p>Comercial</p>
          </div>
          <div className={styles.descubraItem}>
            <Image src={itemImg} alt="ícone de terrenos" />
            <p>Terrenos</p>
          </div>
          <div className={styles.descubraItem}>
            <Image src={itemImg} alt="ícone de planta de imóvel" />
            <p>Na planta</p>
          </div>
        </div>
      </section>

      <section className={styles.destaque}>
        <HomeSwiper />
      </section>
    </div>
  );
}
