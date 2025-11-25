import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import styles from "./layout.module.css";

export const metadata: Metadata = {
  title: "Innova Imobiliária | Imóveis em Curitiba",
  description: "Encontre o imóvel perfeito para você. Apartamentos, casas, terrenos e imóveis comerciais em Curitiba e região.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={styles.body}>
        <Header />
        <main className={styles.main}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
