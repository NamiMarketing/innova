import { HomeSearch } from '@/components/HomeSearch';
import Image from 'next/image';
import styles from './page.module.css';
import headerImg from '@/img/header.png';
import { getFilterOptions } from '@/services/properfy';
import { safeFetch } from '@/lib/safe-fetch';

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
      <section className={styles.cta}>
        {/* Background Pattern */}
        <div className={styles.ctaPattern}>
        </div>

        <div className={styles.ctaContent}>
          <div className={styles.ctaInner}>
            <div className={styles.badge}>
              <svg className={styles.badgeIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Atendimento Especializado
            </div>

            <h2 className={styles.ctaTitle}>
              Nao Encontrou o que Procura?
            </h2>

            <p className={styles.ctaSubtitle}>
              Nossa equipe esta pronta para ajuda-lo a encontrar o imovel perfeito.
              Entre em contato conosco e transforme seu sonho em realidade!
            </p>

            <div className={styles.ctaButtons}>
              <a href="/contato" className={styles.ctaButtonPrimary}>
                <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Falar com Corretor
              </a>
              <a href="/anunciar" className={styles.ctaButtonSecondary}>
                <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Anunciar Meu Imovel
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
