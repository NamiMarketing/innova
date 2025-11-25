import PropertyListing from '@/components/PropertyListing';
import { getProperties } from '@/services/properfy';
import { safeFetch } from '@/lib/safe-fetch';
import styles from './page.module.css';

const SVG_PATTERN = "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")";

export default async function Home() {
  const { data: response, error } = await safeFetch(getProperties({}));
  const properties = response?.data ?? [];
  const total = response?.total ?? 0;

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        {/* Background Pattern */}
        <div className={styles.heroPattern}>
          <div className={styles.heroPatternInner} style={{ backgroundImage: SVG_PATTERN }} />
        </div>

        {/* Decorative Elements */}
        <div className={styles.decorativeCircleTopRight} />
        <div className={styles.decorativeCircleBottomLeft} />

        <div className={styles.heroContent}>
          <div className={styles.heroInner}>
            <div className={styles.badge}>
              <svg className={styles.badgeIcon} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Imobiliaria de Confianca em Curitiba
            </div>

            <h1 className={styles.title}>
              Encontre o Imovel dos{' '}
              <span className={styles.titleHighlight}>Seus Sonhos</span>
            </h1>

            <p className={styles.subtitle}>
              A Innova Imobiliaria oferece as melhores opcoes de imoveis em Curitiba e regiao.
              Seu novo lar esta aqui!
            </p>

            <div className={styles.features}>
              <div className={styles.featureItem}>
                <svg className={styles.featureIcon} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Atendimento Personalizado
              </div>
              <div className={styles.featureItem}>
                <svg className={styles.featureIcon} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Imoveis Verificados
              </div>
              <div className={styles.featureItem}>
                <svg className={styles.featureIcon} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Processo Seguro
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Error State */}
      {error && (
        <div className={styles.errorContainer}>
          <div className={styles.errorBox}>
            <p className={styles.errorTitle}>Erro ao carregar imoveis</p>
            <p className={styles.errorMessage}>{error}</p>
          </div>
        </div>
      )}

      {/* Filtros e Listagem */}
      <PropertyListing initialProperties={properties} initialTotal={total} />

      {/* CTA Section */}
      <section className={styles.cta}>
        {/* Background Pattern */}
        <div className={styles.ctaPattern}>
          <div className={styles.heroPatternInner} style={{ backgroundImage: SVG_PATTERN }} />
        </div>

        <div className={`${styles.decorativeCircleTopRight} ${styles.decorativeCircleAccent}`} />
        <div className={`${styles.decorativeCircleBottomLeft} ${styles.decorativeCircleAccent}`} />

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
