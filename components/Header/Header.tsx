'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useFavorites } from '@/contexts/FavoritesContext';
import styles from './Header.module.css';
import logoNav from '@/img/logo-nav.png';
import instagram from '@/img/icons/insta-header.png';
import facebook from '@/img/icons/face-header.png';
import linkedin from '@/img/icons/linkedin-header.png';
import favorito from '@/img/icons/favorito.svg';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { favorites } = useFavorites();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.inner}>
          {/* Botao Mobile Menu - Esquerda no mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={styles.mobileMenuButton}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg
                className={styles.menuIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                width="17"
                height="13"
                viewBox="0 0 17 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 0.5C0 0.223858 0.223858 0 0.5 0H16.5C16.7761 0 17 0.223858 17 0.5C17 0.776142 16.7761 1 16.5 1H8.5H0.5C0.223858 1 0 0.776142 0 0.5Z"
                  fill="black"
                />
                <rect x="3" y="6" width="14" height="1" rx="0.5" fill="black" />
                <rect
                  x="6"
                  y="12"
                  width="11"
                  height="1"
                  rx="0.5"
                  fill="black"
                />
              </svg>
            )}
          </button>

          {/* Logo - Centro */}
          <Link href="/" className={styles.logo}>
            <Image
              src={logoNav}
              alt="Logo do Innova Imobiliária Digital"
              width={120}
              height={50}
            />
          </Link>

          {/* Mobile Login Button - Direita no mobile */}
          <Link href="/favoritos" className={styles.mobileLoginButton}>
            <svg
              width="20"
              height="17"
              viewBox="0 0 20 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 2.69391L9.49767 3.16624C9.56276 3.23217 9.64078 3.28461 9.72709 3.32043C9.8134 3.35625 9.90622 3.37472 10 3.37472C10.0938 3.37472 10.1866 3.35625 10.2729 3.32043C10.3592 3.28461 10.4372 3.23217 10.5023 3.16624L10 2.69391ZM5.34977 12.6128C5.20667 12.4979 5.02269 12.4432 4.8383 12.4607C4.6539 12.4783 4.48419 12.5666 4.36651 12.7064C4.24883 12.8461 4.19281 13.0257 4.21078 13.2058C4.22875 13.3858 4.31923 13.5515 4.46233 13.6665L5.34977 12.6128ZM1.01581 9.87965C1.05979 9.95814 1.11917 10.0274 1.19056 10.0835C1.26195 10.1396 1.34396 10.1814 1.43189 10.2065C1.51983 10.2316 1.61197 10.2396 1.70306 10.23C1.79415 10.2203 1.88241 10.1933 1.96279 10.1503C2.04317 10.1074 2.1141 10.0494 2.17154 9.9797C2.22897 9.90999 2.27178 9.82992 2.29752 9.74406C2.32326 9.65819 2.33143 9.56822 2.32156 9.47927C2.31169 9.39033 2.28398 9.30415 2.24 9.22566L1.01581 9.87965ZM1.39535 5.99748C1.39535 4.04459 2.52558 2.40597 4.06884 1.71655C5.56837 1.04712 7.58326 1.22424 9.49767 3.16624L10.5023 2.22249C8.23256 -0.0819248 5.59442 -0.462512 3.48837 0.477602C1.42884 1.39773 0 3.53411 0 5.99748H1.39535ZM6.7414 15.4104C7.2186 15.7774 7.73023 16.168 8.24837 16.4641C8.76651 16.7602 9.35814 17 10 17V15.6375C9.71163 15.6375 9.37302 15.5285 8.95256 15.2878C8.53116 15.048 8.09488 14.7174 7.60558 14.3404L6.7414 15.4104ZM13.2586 15.4104C14.5851 14.3886 16.2819 13.2186 17.6121 11.7553C18.9674 10.2657 20 8.41907 20 5.99748H18.6047C18.6047 7.99398 17.7674 9.53177 16.5693 10.8507C15.346 12.195 13.8047 13.255 12.3944 14.3404L13.2586 15.4104ZM20 5.99748C20 3.53411 18.5721 1.39773 16.5116 0.477602C14.4056 -0.462512 11.7693 -0.0819248 9.49767 2.22158L10.5023 3.16624C12.4167 1.22515 14.4316 1.04712 15.9312 1.71655C17.4744 2.40597 18.6047 4.04368 18.6047 5.99748H20ZM12.3944 14.3404C11.9051 14.7174 11.4688 15.048 11.0474 15.2878C10.626 15.5276 10.2884 15.6375 10 15.6375V17C10.6419 17 11.2335 16.7593 11.7516 16.4641C12.2707 16.168 12.7814 15.7774 13.2586 15.4104L12.3944 14.3404ZM7.60558 14.3404C6.86512 13.7709 6.11256 13.2259 5.34977 12.6128L4.46233 13.6665C5.23442 14.2868 6.05116 14.8791 6.7414 15.4104L7.60558 14.3404ZM2.24 9.22657C1.67956 8.23873 1.38869 7.12676 1.39535 5.99748H0C0 7.48531 0.390698 8.76333 1.01581 9.87965L2.24 9.22657Z"
                fill="black"
              />
            </svg>
            {favorites.length > 0 && (
              <span className={styles.mobileFavoritesBadge}>
                {favorites.length}
              </span>
            )}
          </Link>

          {/* Menu Desktop */}
          <nav className={styles.desktopNav}>
            <Link href="/" className={styles.navLink}>
              Início
            </Link>
            <Link href="/imoveis?type=rent" className={styles.navLink}>
              Alugar
            </Link>
            <Link href="/imoveis?type=sale" className={styles.navLink}>
              Comprar
            </Link>
            <Link href="/anunciar" className={styles.navLink}>
              Anunciar
            </Link>
            <Link href="/trabalhe-conosco" className={styles.navLink}>
              Trabalhe Conosco
            </Link>
            {/* <Link href="/blog" className={styles.navLink}>Blog</Link> */}
            <Link href="/favoritos" className={styles.favoritesLink}>
              <Image
                src={favorito}
                width={16}
                height={14}
                alt="ícone de coração para favoritos"
              />
              Favoritos
              {favorites.length > 0 && (
                <span className={styles.favoritesBadge}>
                  {favorites.length}
                </span>
              )}
            </Link>
            {/* <Link href="/area-do-cliente" className={styles.login}>
              <Image src={login} alt="Login" width={13} height={14} />
              Entrar
            </Link> */}
          </nav>
        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <nav className={styles.mobileNav}>
            <div className={styles.mobileNavInner}>
              <Link
                href="/"
                className={styles.mobileNavLink}
                onClick={() => setMobileMenuOpen(false)}
              >
                Início
              </Link>
              <Link
                href="/imoveis?type=rent"
                className={styles.mobileNavLink}
                onClick={() => setMobileMenuOpen(false)}
              >
                Alugar
              </Link>
              <Link
                href="/imoveis?type=sale"
                className={styles.mobileNavLink}
                onClick={() => setMobileMenuOpen(false)}
              >
                Comprar
              </Link>
              <Link
                href="/anunciar"
                className={styles.mobileNavLink}
                onClick={() => setMobileMenuOpen(false)}
              >
                Anunciar
              </Link>
              <Link
                href="/trabalhe-conosco"
                className={styles.mobileNavLink}
                onClick={() => setMobileMenuOpen(false)}
              >
                Trabalhe Conosco
              </Link>
              <div className={styles.phoneNumbers}>
                <Link
                  href="https://wa.me/5541987010407"
                  className={styles.phoneNumber}
                >
                  <p>Locação</p>
                  (41) 98701-0407
                </Link>
                <Link
                  href="https://wa.me/5541987010071"
                  className={styles.phoneNumber}
                >
                  <p>Vendas</p>
                  (41) 98701-0071
                </Link>
              </div>
              <div className={styles.icons}>
                <Link href="https://www.instagram.com/innovaimobiliariadigital/">
                  <Image
                    src={instagram}
                    alt="Instagram"
                    width={24}
                    height={24}
                  />
                </Link>
                <Link href="https://www.facebook.com/innovaimobiliariadigital">
                  <Image src={facebook} alt="Facebook" width={24} height={24} />
                </Link>
                <Link href="https://www.linkedin.com/company/innovaimobiliariadigital">
                  <Image src={linkedin} alt="LinkedIn" width={24} height={24} />
                </Link>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
