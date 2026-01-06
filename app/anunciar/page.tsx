import { Metadata } from 'next';
import Image from 'next/image';
import { AnunciarForm } from '@/components/AnunciarForm/AnunciarForm';
import styles from './page.module.css';
import logoWatermark from '@/img/anunciar/logo-watermark.png';

export const metadata: Metadata = {
  title: 'Anunciar Imóvel | Innova Imobiliária',
  description:
    'Anuncie seu imóvel conosco. Todo o processo simples, rápido e transparente.',
};

export default function AnunciarPage() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <h1 className={styles.heroTitle}>Anuncie seu imóvel conosco</h1>
        <div className={styles.heroLogo}>
          <Image
            src={logoWatermark}
            alt=""
            fill
            className={styles.heroLogoImage}
          />
        </div>
      </section>

      {/* Process Explanation */}
      <section className={styles.process}>
        <div className={styles.processContent}>
          <h2 className={styles.processTitle}>
            Todo o processo simples,
            <br />
            rápido e transparente.
          </h2>

          <div className={styles.processSteps}>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>1</div>
              <p className={styles.stepText}>
                Preencha o formulário abaixo com seus dados pessoais e
                informações sobre o imóvel.
              </p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>2</div>
              <p className={styles.stepText}>
                Após o preenchimento das informações iremos entrar em contato
                para prosseguir com o seu anúncio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className={styles.formSection}>
        <AnunciarForm formsparkId="n0jg7yhra" />
      </section>
    </div>
  );
}
