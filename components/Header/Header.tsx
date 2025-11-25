'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './Header.module.css';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.inner}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <div className={styles.logoTitle}>INNOVA</div>
            <div className={styles.logoSubtitle}>Imobiliaria</div>
          </Link>

          {/* Menu Desktop */}
          <nav className={styles.desktopNav}>
            <Link href="/" className={styles.navLink}>Home</Link>
            <Link href="/imoveis" className={styles.navLink}>Imoveis</Link>
            <Link href="/sobre" className={styles.navLink}>Sobre</Link>
            <Link href="/contato" className={styles.navLink}>Contato</Link>
            <Link href="/anunciar" className={styles.ctaButton}>Anunciar Imovel</Link>
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
