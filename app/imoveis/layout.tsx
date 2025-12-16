'use client';

import { useEffect } from 'react';
import styles from './layout.module.css';

export default function ImoveisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Hide footer on mount
    const footer = document.querySelector('footer');
    if (footer) {
      footer.style.display = 'none';
    }

    // Show footer on unmount (when leaving the page)
    return () => {
      const footer = document.querySelector('footer');
      if (footer) {
        footer.style.display = '';
      }
    };
  }, []);

  return <div className={styles.imoveisLayout}>{children}</div>;
}
