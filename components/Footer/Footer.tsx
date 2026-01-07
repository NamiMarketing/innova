import Link from 'next/link';
import styles from './Footer.module.css';
import Image from 'next/image';
import instagram from '@/img/icons/instagram.svg';
import facebook from '@/img/icons/facebook.svg';
import linkedin from '@/img/icons/linkedin.svg';
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
          <div className={styles.left}>
            <ul className={styles.linkList}>
              <li>
                <Link href="/" className={styles.link}>
                  Início
                </Link>
              </li>
              <li>
                <Link href="/locacao" className={styles.link}>
                  Imóveis para Alugar
                </Link>
              </li>
              <li>
                <Link href="/venda" className={styles.link}>
                  Imóveis à Venda
                </Link>
              </li>
              <li>
                <Link href="/anunciar" className={styles.link}>
                  Anunciar
                </Link>
              </li>
              <li>
                <Link href="/trabalhe-conosco" className={styles.link}>
                  Trabalhe Conosco
                </Link>
              </li>
              <li>
                <Link href="/favoritos" className={styles.link}>
                  Favoritos
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div className={styles.left}>
            <div className={styles.linkList}>
              <h5>
                Innova Imobiliária Digital <br /> Creci J06584
              </h5>
              <p>
                R. Anne Frank, 2132 <br />
                Hauer - Curitiba/PR
              </p>
              <Link
                href="https://wa.me/5541987010407"
                target="_blank"
                className={styles.link}
              >
                <p>
                  Locação <br /> (41) 98701-0407
                </p>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.80175 5.17004C6.98475 5.17504 7.18775 5.18504 7.38075 5.61304C7.50875 5.89804 7.72375 6.42304 7.89975 6.85104C8.03675 7.18404 8.14875 7.45804 8.17675 7.51404C8.24075 7.64204 8.28075 7.78904 8.19675 7.96204L8.16875 8.02004C8.11186 8.15462 8.03425 8.27946 7.93875 8.39004L7.79575 8.56004C7.71075 8.66404 7.62575 8.76604 7.55375 8.83804C7.42475 8.96604 7.29175 9.10404 7.43975 9.36004C7.58775 9.61604 8.10775 10.458 8.87475 11.137C9.43573 11.643 10.0794 12.0489 10.7778 12.337C10.8478 12.367 10.9044 12.3924 10.9477 12.413C11.2047 12.541 11.3577 12.521 11.5058 12.349C11.6548 12.176 12.1487 11.6 12.3227 11.344C12.4907 11.088 12.6627 11.128 12.9007 11.216C13.1387 11.305 14.4048 11.926 14.6618 12.053L14.8048 12.123C14.9838 12.208 15.1047 12.267 15.1567 12.353C15.2207 12.462 15.2208 12.973 15.0088 13.575C14.7908 14.175 13.7418 14.751 13.2668 14.795L13.1318 14.811C12.6958 14.863 12.1438 14.931 10.1758 14.156C7.74975 13.202 6.14875 10.836 5.82575 10.357L5.77275 10.281L5.76675 10.273C5.61975 10.076 4.71875 8.87104 4.71875 7.62704C4.71875 6.43704 5.30575 5.81704 5.57275 5.53504L5.61975 5.48504C5.70617 5.38741 5.81177 5.30862 5.92996 5.25357C6.04815 5.19851 6.17641 5.16838 6.30675 5.16504C6.47975 5.16504 6.65375 5.16504 6.80175 5.17004Z"
                    fill="white"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.0999999 19.331C0.0811567 19.3988 0.0805292 19.4704 0.0981808 19.5385C0.115832 19.6066 0.151138 19.6689 0.200536 19.719C0.249933 19.7691 0.311674 19.8053 0.379527 19.8239C0.447381 19.8425 0.518946 19.8429 0.587 19.825L5.194 18.621C6.65568 19.4128 8.29168 19.8276 9.954 19.828H9.958C15.444 19.828 19.916 15.382 19.916 9.91605C19.9194 8.61259 19.6635 7.32149 19.1632 6.11785C18.6629 4.91422 17.9283 3.8221 17.002 2.90505C16.0773 1.98046 14.9789 1.24782 13.77 0.749271C12.5612 0.25072 11.2656 -0.00390357 9.958 4.52349e-05C4.472 4.52349e-05 0 4.44604 0 9.91105C0 11.65 0.458 13.358 1.33 14.865L0.0999999 19.331ZM2.777 15.263C2.82987 15.0711 2.84402 14.8706 2.81861 14.6732C2.7932 14.4757 2.72874 14.2853 2.629 14.113C1.89014 12.8358 1.50075 11.3866 1.5 9.91105C1.5 5.28104 5.293 1.50005 9.958 1.50005C12.228 1.50005 14.346 2.37705 15.944 3.96805C16.7302 4.74575 17.3538 5.67223 17.7782 6.69344C18.2026 7.71465 18.4194 8.81015 18.416 9.91605C18.416 14.546 14.623 18.328 9.958 18.328H9.953C8.5407 18.3273 7.15083 17.9747 5.909 17.302C5.57429 17.1208 5.18321 17.0737 4.815 17.17L2.053 17.891L2.777 15.263Z"
                    fill="white"
                  />
                </svg>
              </Link>
              <Link
                href="https://wa.me/5541987010071"
                target="_blank"
                className={styles.link}
              >
                <p>
                  Vendas <br /> (41) 98701-0071
                </p>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.80175 5.17004C6.98475 5.17504 7.18775 5.18504 7.38075 5.61304C7.50875 5.89804 7.72375 6.42304 7.89975 6.85104C8.03675 7.18404 8.14875 7.45804 8.17675 7.51404C8.24075 7.64204 8.28075 7.78904 8.19675 7.96204L8.16875 8.02004C8.11186 8.15462 8.03425 8.27946 7.93875 8.39004L7.79575 8.56004C7.71075 8.66404 7.62575 8.76604 7.55375 8.83804C7.42475 8.96604 7.29175 9.10404 7.43975 9.36004C7.58775 9.61604 8.10775 10.458 8.87475 11.137C9.43573 11.643 10.0794 12.0489 10.7778 12.337C10.8478 12.367 10.9044 12.3924 10.9477 12.413C11.2047 12.541 11.3577 12.521 11.5058 12.349C11.6548 12.176 12.1487 11.6 12.3227 11.344C12.4907 11.088 12.6627 11.128 12.9007 11.216C13.1387 11.305 14.4048 11.926 14.6618 12.053L14.8048 12.123C14.9838 12.208 15.1047 12.267 15.1567 12.353C15.2207 12.462 15.2208 12.973 15.0088 13.575C14.7908 14.175 13.7418 14.751 13.2668 14.795L13.1318 14.811C12.6958 14.863 12.1438 14.931 10.1758 14.156C7.74975 13.202 6.14875 10.836 5.82575 10.357L5.77275 10.281L5.76675 10.273C5.61975 10.076 4.71875 8.87104 4.71875 7.62704C4.71875 6.43704 5.30575 5.81704 5.57275 5.53504L5.61975 5.48504C5.70617 5.38741 5.81177 5.30862 5.92996 5.25357C6.04815 5.19851 6.17641 5.16838 6.30675 5.16504C6.47975 5.16504 6.65375 5.16504 6.80175 5.17004Z"
                    fill="white"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.0999999 19.331C0.0811567 19.3988 0.0805292 19.4704 0.0981808 19.5385C0.115832 19.6066 0.151138 19.6689 0.200536 19.719C0.249933 19.7691 0.311674 19.8053 0.379527 19.8239C0.447381 19.8425 0.518946 19.8429 0.587 19.825L5.194 18.621C6.65568 19.4128 8.29168 19.8276 9.954 19.828H9.958C15.444 19.828 19.916 15.382 19.916 9.91605C19.9194 8.61259 19.6635 7.32149 19.1632 6.11785C18.6629 4.91422 17.9283 3.8221 17.002 2.90505C16.0773 1.98046 14.9789 1.24782 13.77 0.749271C12.5612 0.25072 11.2656 -0.00390357 9.958 4.52349e-05C4.472 4.52349e-05 0 4.44604 0 9.91105C0 11.65 0.458 13.358 1.33 14.865L0.0999999 19.331ZM2.777 15.263C2.82987 15.0711 2.84402 14.8706 2.81861 14.6732C2.7932 14.4757 2.72874 14.2853 2.629 14.113C1.89014 12.8358 1.50075 11.3866 1.5 9.91105C1.5 5.28104 5.293 1.50005 9.958 1.50005C12.228 1.50005 14.346 2.37705 15.944 3.96805C16.7302 4.74575 17.3538 5.67223 17.7782 6.69344C18.2026 7.71465 18.4194 8.81015 18.416 9.91605C18.416 14.546 14.623 18.328 9.958 18.328H9.953C8.5407 18.3273 7.15083 17.9747 5.909 17.302C5.57429 17.1208 5.18321 17.0737 4.815 17.17L2.053 17.891L2.777 15.263Z"
                    fill="white"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Contato */}
          <div className={styles.right}>
            <div className={`${styles.icons} ${styles.socials}`}>
              <Link
                href="https://www.instagram.com/innovaimobiliariadigital/"
                target="_blank"
              >
                <Image src={instagram} alt="Instagram" width={30} height={30} />
              </Link>
              <Link
                href="https://www.facebook.com/innovaimobiliariadigital/"
                target="_blank"
              >
                <Image src={facebook} alt="Facebook" width={30} height={30} />
              </Link>
              <Link
                href="https://br.linkedin.com/company/innova-imobili%C3%A1ria-digital"
                target="_blank"
              >
                <Image src={linkedin} alt="LinkedIn" width={30} height={30} />
              </Link>
            </div>
            <div className={`${styles.icons} ${styles.partners}`}>
              <Image
                src={pequeno}
                alt="Logo do Pequeno Principe"
                width={80}
                height={80}
                className={styles.pequeno}
              />
              <Image
                src={alcance}
                alt="Logo do Alcance"
                width={140}
                height={50}
                className={styles.alcance}
              />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className={styles.copyright}>
          <Link href="https://namiconsultoria.com.br/" target="_blank">
            Desenvolvido por Nami Consultoria
          </Link>
        </div>
      </div>
    </footer>
  );
}
