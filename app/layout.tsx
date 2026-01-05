import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import styles from './layout.module.css';

import { Ubuntu } from 'next/font/google';

const ubuntu = Ubuntu({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-ubuntu',
});

export const metadata: Metadata = {
  title: 'Innova | Imobiliária Digital',
  description:
    'Encontre o imóvel perfeito para você. Apartamentos, casas, terrenos e imóveis comerciais em Curitiba e região.',
  icons: {
    icon: '/img/favicon-32x32.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${styles.body} ${ubuntu.variable} antialiased`}>
        <FavoritesProvider>
          <Header />
          <main className={styles.main}>{children}</main>
          <Footer />
        </FavoritesProvider>
      </body>
    </html>
  );
}
