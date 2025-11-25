import Link from 'next/link';
import styles from './Footer.module.css';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Sobre */}
          <div>
            <h3 className={styles.title}>INNOVA</h3>
            <p className={styles.description}>
              Sua imobiliaria de confianca. Facilitamos a busca pelo seu imovel ideal com
              tecnologia e atendimento personalizado.
            </p>
          </div>

          {/* Links Rapidos */}
          <div>
            <h4 className={styles.sectionTitle}>Links Rapidos</h4>
            <ul className={styles.linkList}>
              <li><Link href="/" className={styles.link}>Home</Link></li>
              <li><Link href="/imoveis" className={styles.link}>Imoveis</Link></li>
              <li><Link href="/sobre" className={styles.link}>Sobre Nos</Link></li>
              <li><Link href="/contato" className={styles.link}>Contato</Link></li>
            </ul>
          </div>

          {/* Servicos */}
          <div>
            <h4 className={styles.sectionTitle}>Servicos</h4>
            <ul className={styles.linkList}>
              <li><Link href="/imoveis?type=sale" className={styles.link}>Comprar Imovel</Link></li>
              <li><Link href="/imoveis?type=rent" className={styles.link}>Alugar Imovel</Link></li>
              <li><Link href="/anunciar" className={styles.link}>Anunciar Imovel</Link></li>
              <li><Link href="/avaliar" className={styles.link}>Avaliar Imovel</Link></li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className={styles.sectionTitle}>Contato</h4>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <svg className={styles.contactIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Curitiba, PR</span>
              </li>
              <li className={styles.contactItem}>
                <svg className={styles.contactIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>contato@innovaimobiliaria.com.br</span>
              </li>
              <li className={styles.contactItem}>
                <svg className={styles.contactIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>(41) 3333-3333</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className={styles.copyright}>
          <p>&copy; {currentYear} Innova Imobiliaria. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
