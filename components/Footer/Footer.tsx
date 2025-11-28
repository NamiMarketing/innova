import Link from 'next/link';
import styles from './Footer.module.css';
import Image from 'next/image';
import instagram from '@/img/instagram.svg';
import facebook from '@/img/facebook.svg';
import linkedin from '@/img/linkedin.svg';
import pequeno from '@/img/pequeno-principe.png';
import alcance from '@/img/alcance.png';
import logoFooter from '@/img/logo-footer.png';

export function Footer() {

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>

          <Image
            src={logoFooter}
            alt="Logo do Innova Imobiliária Digital"
            width={184}
            height={272}
            className={styles.logoFooter}
          />

          {/* Links Rapidos */}
          <div>
            <ul className={styles.linkList}>
              <li><Link href="/" className={styles.link}>Início</Link></li>
              <li><Link href="/alugar" className={styles.link}>Alugar</Link></li>
              <li><Link href="/comprar" className={styles.link}>Comprar</Link></li>
              <li><Link href="/anunciar" className={styles.link}>Anunciar</Link></li>
              <li><Link href="/trabalhe-conosco" className={styles.link}>Trabalhe Conosco</Link></li>
              <li><Link href="/area-do-cliente" className={styles.link}>Área do cliente</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <div className={styles.linkList}>
              <h5>Innova Imobiliária Digital <br/> Creci J06584</h5>
              <p>R. Anne Frank, 2132 <br/>Hauer - Curitiba/PR</p>
              <p>Locação <br/> (41) 98701-0407</p>
              <p>Vendas <br/> (41) 98701-0407</p>
            </div>
          </div>

          {/* Contato */}
          <div className={styles.right}>
            <div className={styles.icons}>
              <Link href="https://www.instagram.com/innovaimobiliaria/" target="_blank">
                <Image
                  src={instagram}
                  alt="Instagram"
                  width={30}
                  height={30}
                />
              </Link>
              <Link href="https://www.facebook.com/innovaimobiliariadigital/" target="_blank">
                <Image
                  src={facebook}
                  alt="Facebook"
                  width={30}
                  height={30}
                />
              </Link>
              <Link href="https://www.linkedin.com/company/innovaimobiliaria/" target="_blank">
                <Image
                  src={linkedin}
                  alt="LinkedIn"
                  width={30}
                  height={30}
                />
              </Link>
            </div>
            <div className={styles.icons}>
              <Image
                src={pequeno}
                alt="Logo do Pequeno Principe"
                width={80}
                height={80}
              />
              <Image
                src={alcance}
                alt="Logo do Alcance"
                width={140}
                height={50}
              />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className={styles.copyright}>
          <Link href="https://namiconsultoria.com.br/" target="_blank">Desenvolvido por Nami Consultoria</Link>
        </div>
      </div>
    </footer>
  );
}
