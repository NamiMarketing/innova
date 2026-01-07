import Link from 'next/link';
import styles from './page.module.css';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.notFound}>
          <h1 className={styles.notFoundTitle}>Imovel nao encontrado</h1>
          <p className={styles.notFoundMessage}>
            O imovel que voce esta procurando nao existe ou foi removido.
          </p>
          <Link href="/venda" className={styles.backButton}>
            Voltar para imóveis
          </Link>
        </div>
      </div>
    </div>
  );
}
