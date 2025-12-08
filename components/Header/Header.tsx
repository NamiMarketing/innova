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
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <Image
              src={logoNav}
              alt="Logo do Innova Imobiliária Digital"
              width={120}
              height={50}
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

          {/* Botao Mobile Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={styles.mobileMenuButton}
            aria-label="Toggle menu"
          >
            <svg className={styles.menuIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <nav className={styles.mobileNav}>
            <div className={styles.mobileNavInner}>
              <Link href="/" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link href="/imoveis" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>
                Imoveis
              </Link>
              <Link href="/sobre" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>
                Sobre
              </Link>
              <Link href="/contato" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>
                Contato
              </Link>
              <Link href="/anunciar" className={styles.mobileCtaButton} onClick={() => setMobileMenuOpen(false)}>
                Anunciar Imovel
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
