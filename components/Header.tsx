'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="text-2xl font-bold text-primary">
              INNOVA
            </div>
            <div className="ml-2 text-sm text-gray-medium">
              Imobiliária
            </div>
          </Link>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-dark hover:text-primary font-medium transition-colors">
              Home
            </Link>
            <Link href="/imoveis" className="text-gray-dark hover:text-primary font-medium transition-colors">
              Imóveis
            </Link>
            <Link href="/sobre" className="text-gray-dark hover:text-primary font-medium transition-colors">
              Sobre
            </Link>
            <Link href="/contato" className="text-gray-dark hover:text-primary font-medium transition-colors">
              Contato
            </Link>
            <Link
              href="/anunciar"
              className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Anunciar Imóvel
            </Link>
          </nav>

          {/* Botão Mobile Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-gray-dark"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-dark hover:text-primary font-medium transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/imoveis"
                className="text-gray-dark hover:text-primary font-medium transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Imóveis
              </Link>
              <Link
                href="/sobre"
                className="text-gray-dark hover:text-primary font-medium transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sobre
              </Link>
              <Link
                href="/contato"
                className="text-gray-dark hover:text-primary font-medium transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contato
              </Link>
              <Link
                href="/anunciar"
                className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Anunciar Imóvel
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
