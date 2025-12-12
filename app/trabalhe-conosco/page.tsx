import Image from 'next/image';
import styles from './page.module.css';
import trabalhe from '@/img/trabalhe.png';

export const metadata = {
  title: 'Trabalhe Conosco | Innova Imobiliária Digital',
  description:
    'Faça parte da equipe Innova. Buscamos pessoas que acreditam em relações transparentes e crescimento real no mercado imobiliário.',
};

export default function TrabalheConoscoPage() {
  return (
    <main className={styles.main}>
      <section className={styles.heroSection}>
        <div className={styles.card}>
          <div className={styles.cardContent}>
            <h1 className={styles.title}>Faça parte da Innova</h1>
            <p className={styles.description}>
              A Innova reúne pessoas que acreditam em relações transparentes,
              atendimento humano e crescimento real. Se você quer construir uma
              trajetória sólida no mercado imobiliário, queremos conhecer você.
            </p>
            <a
              href="https://forms.google.com/trabalhe-conosco"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaButton}
            >
              Preencher formulário
            </a>
          </div>
          <div className={styles.imageContainer}>
            <Image
              src={trabalhe}
              alt="Mão segurando um chaveiro de casa com a logo da Innova"
              width={470}
              height={470}
              className={styles.heroImage}
              priority
            />
          </div>
        </div>
      </section>
    </main>
  );
}
