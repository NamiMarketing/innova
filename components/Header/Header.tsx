'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useFavorites } from '@/contexts/FavoritesContext';
import styles from './Header.module.css';
import logoNav from '@/img/logo-nav.png';
import login from '@/img/icons/login.svg';
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
              <svg className={styles.menuIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg width="17" height="13" viewBox="0 0 17 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0.5C0 0.223858 0.223858 0 0.5 0H16.5C16.7761 0 17 0.223858 17 0.5C17 0.776142 16.7761 1 16.5 1H8.5H0.5C0.223858 1 0 0.776142 0 0.5Z" fill="black"/>
                <rect x="3" y="6" width="14" height="1" rx="0.5" fill="black"/>
                <rect x="6" y="12" width="11" height="1" rx="0.5" fill="black"/>
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
          <Link href="/area-do-cliente" className={styles.mobileLoginButton}>
            <Image
              src={login}
              alt="Login"
              width={16}
              height={17}
            />
          </Link>

          {/* Menu Desktop */}
          <nav className={styles.desktopNav}>
            <Link href="/" className={styles.navLink}>Início</Link>
            <Link href="/imoveis?type=rent" className={styles.navLink}>Alugar</Link>
            <Link href="/imoveis?type=sale" className={styles.navLink}>Comprar</Link>
            <Link href="/anunciar" className={styles.navLink}>Anunciar</Link>
            <Link href="/trabalhe-conosco" className={styles.navLink}>Trabalhe Conosco</Link>
            {/* <Link href="/blog" className={styles.navLink}>Blog</Link> */}
            <Link href="/favoritos" className={styles.favoritesLink}>
              <Image
                src={favorito}
                width={16}
                height={14}
                alt='ícone de coração para favoritos'
              />
              Favoritos
              {favorites.length > 0 && (
                <span className={styles.favoritesBadge}>{favorites.length}</span>
              )}
            </Link>
            <Link href="/area-do-cliente" className={styles.login}>
              <Image
                src={login}
                alt="Login"
                width={13}
                height={14}
              />
              Entrar
            </Link>
          </nav>
        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <nav className={styles.mobileNav}>
            <div className={styles.mobileNavInner}>
              <Link href="/" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>
                Início
              </Link>
              <Link href="/imoveis?type=rent" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>
                Alugar
              </Link>
              <Link href="/imoveis?type=sale" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>
                Comprar
              </Link>
              <Link href="/anunciar" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>
                Anunciar
              </Link>
              <Link href="/trabalhe-conosco" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>
                Trabalhe Conosco
              </Link>
              <Link href="/favoritos" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>
                Favoritos
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
