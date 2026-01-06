'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useFavorites } from '@/contexts/FavoritesContext';
import styles from './page.module.css';
import tour from '@/img/icons/tour.png';

interface GalleryImage {
  id: string;
  url: string;
  title?: string;
  description?: string;
  order: number;
}

interface GalleryProps {
  images: GalleryImage[];
  title: string;
  propertyId: string;
  virtualTourUrl?: string;
}

export default function Gallery({
  images,
  title,
  propertyId,
  virtualTourUrl,
}: GalleryProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const isFav = isFavorite(propertyId);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [showCopied, setShowCopied] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const mainImage = images[activeIndex]?.url || '/placeholder-property.jpg';

  const handlePrev = () => {
    const newIndex = activeIndex > 0 ? activeIndex - 1 : images.length - 1;
    setActiveIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = activeIndex < images.length - 1 ? activeIndex + 1 : 0;
    setActiveIndex(newIndex);
  };

  const handleSelectImage = (index: number) => {
    setActiveIndex(index);
  };

  const handleShareClick = async () => {
    const shareData = {
      title: title,
      text: `Confira este imóvel: ${title}`,
      url: window.location.href,
    };

    // Tenta usar Web Share API (funciona bem em mobile)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Usuário cancelou ou erro - ignora
        console.log('Share cancelled or failed:', err);
      }
    } else {
      // Fallback: copia o link para a área de transferência
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  // Modal functions
  const openModal = () => {
    setIsModalOpen(true);
    setExpandedIndex(null);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setExpandedIndex(null);
    document.body.style.overflow = '';
  };

  const expandImage = (index: number) => {
    setExpandedIndex(index);
  };

  const collapseImage = () => {
    setExpandedIndex(null);
  };

  const handleExpandedPrev = useCallback(() => {
    setExpandedIndex((prev) => {
      if (prev !== null) {
        return prev > 0 ? prev - 1 : images.length - 1;
      }
      return prev;
    });
  }, [images.length]);

  const handleExpandedNext = useCallback(() => {
    setExpandedIndex((prev) => {
      if (prev !== null) {
        return prev < images.length - 1 ? prev + 1 : 0;
      }
      return prev;
    });
  }, [images.length]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;

      if (e.key === 'Escape') {
        if (expandedIndex !== null) {
          collapseImage();
        } else {
          closeModal();
        }
      } else if (expandedIndex !== null) {
        if (e.key === 'ArrowLeft') {
          handleExpandedPrev();
        } else if (e.key === 'ArrowRight') {
          handleExpandedNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, expandedIndex, handleExpandedPrev, handleExpandedNext]);

  // Scroll the thumbnail into view when activeIndex changes
  useEffect(() => {
    const thumbnail = thumbnailRefs.current[activeIndex];
    if (thumbnail && trackRef.current) {
      const track = trackRef.current;
      const thumbLeft = thumbnail.offsetLeft;
      const thumbWidth = thumbnail.offsetWidth;
      const trackScrollLeft = track.scrollLeft;
      const trackWidth = track.offsetWidth;

      // Check if thumbnail is out of view
      if (thumbLeft < trackScrollLeft) {
        // Scroll left to show thumbnail
        track.scrollTo({
          left: thumbLeft - 10,
          behavior: 'smooth',
        });
      } else if (thumbLeft + thumbWidth > trackScrollLeft + trackWidth) {
        // Scroll right to show thumbnail
        track.scrollTo({
          left: thumbLeft + thumbWidth - trackWidth + 10,
          behavior: 'smooth',
        });
      }
    }
  }, [activeIndex]);

  return (
    <div className={styles.gallerySection}>
      <div className={styles.mainImage}>
        <Image
          src={mainImage}
          alt={`${title} - Foto ${activeIndex + 1}`}
          fill
          className={styles.image}
          priority
        />
        {/* Botoes de compartilhar e favoritos */}
        <div className={styles.actionButtons}>
          {/* Botão de compartilhar */}
          <button
            type="button"
            className={styles.shareButton}
            onClick={handleShareClick}
            aria-label="Compartilhar imóvel"
          >
            {showCopied && (
              <span className={styles.copiedTooltip}>Link copiado!</span>
            )}
            <svg
              width="14"
              height="17"
              viewBox="0 0 14 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.95 5.04329H10.5V4.00358H13.1259C13.6071 4.00358 14 4.39001 14 4.86654V16.137C13.9991 16.3656 13.907 16.5846 13.7437 16.7462C13.5805 16.9079 13.3594 16.9991 13.1285 17H0.8715C0.640647 16.9991 0.419513 16.9079 0.256275 16.7462C0.093036 16.5846 0.000921578 16.3656 0 16.137V4.86654C0.000925117 4.6375 0.0934004 4.41814 0.257205 4.25643C0.421011 4.09472 0.642817 4.00381 0.874125 4.00358H3.5V5.04329H1.05V15.9603H12.95V5.04329ZM7.525 1.6313V9.63536H6.475V1.6313L4.64887 3.43953L3.906 2.70394L6.38138 0.253678C6.54546 0.0912481 6.76798 0 7 0C7.23202 0 7.45454 0.0912481 7.61862 0.253678L10.094 2.70394L9.35113 3.43953L7.525 1.6313Z"
                fill="black"
              />
            </svg>
          </button>
          {/* Botão de favorito */}
          <button
            type="button"
            className={`${styles.favoriteButton} ${isFav ? styles.favoriteButtonActive : ''}`}
            onClick={() => toggleFavorite(propertyId)}
            aria-label={
              isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'
            }
          >
            <svg
              width="20"
              height="17"
              viewBox="0 0 20 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 2.69391L9.49767 3.16624C9.56276 3.23217 9.64078 3.28461 9.72709 3.32043C9.8134 3.35625 9.90622 3.37472 10 3.37472C10.0938 3.37472 10.1866 3.35625 10.2729 3.32043C10.3592 3.28461 10.4372 3.23217 10.5023 3.16624L10 2.69391ZM5.34977 12.6128C5.20667 12.4979 5.02269 12.4432 4.8383 12.4607C4.6539 12.4783 4.48419 12.5666 4.36651 12.7064C4.24883 12.8461 4.19281 13.0257 4.21078 13.2058C4.22875 13.3858 4.31923 13.5515 4.46233 13.6665L5.34977 12.6128ZM1.01581 9.87965C1.05979 9.95814 1.11917 10.0274 1.19056 10.0835C1.26195 10.1396 1.34396 10.1814 1.43189 10.2065C1.51983 10.2316 1.61197 10.2396 1.70306 10.23C1.79415 10.2203 1.88241 10.1933 1.96279 10.1503C2.04317 10.1074 2.1141 10.0494 2.17154 9.9797C2.22897 9.90999 2.27178 9.82992 2.29752 9.74406C2.32326 9.65819 2.33143 9.56822 2.32156 9.47927C2.31169 9.39033 2.28398 9.30415 2.24 9.22566L1.01581 9.87965ZM1.39535 5.99748C1.39535 4.04459 2.52558 2.40597 4.06884 1.71655C5.56837 1.04712 7.58326 1.22424 9.49767 3.16624L10.5023 2.22249C8.23256 -0.0819248 5.59442 -0.462512 3.48837 0.477602C1.42884 1.39773 0 3.53411 0 5.99748H1.39535ZM6.7414 15.4104C7.2186 15.7774 7.73023 16.168 8.24837 16.4641C8.76651 16.7602 9.35814 17 10 17V15.6375C9.71163 15.6375 9.37302 15.5285 8.95256 15.2878C8.53116 15.048 8.09488 14.7174 7.60558 14.3404L6.7414 15.4104ZM13.2586 15.4104C14.5851 14.3886 16.2819 13.2186 17.6121 11.7553C18.9674 10.2657 20 8.41907 20 5.99748H18.6047C18.6047 7.99398 17.7674 9.53177 16.5693 10.8507C15.346 12.195 13.8047 13.255 12.3944 14.3404L13.2586 15.4104ZM20 5.99748C20 3.53411 18.5721 1.39773 16.5116 0.477602C14.4056 -0.462512 11.7693 -0.0819248 9.49767 2.22158L10.5023 3.16624C12.4167 1.22515 14.4316 1.04712 15.9312 1.71655C17.4744 2.40597 18.6047 4.04368 18.6047 5.99748H20ZM12.3944 14.3404C11.9051 14.7174 11.4688 15.048 11.0474 15.2878C10.626 15.5276 10.2884 15.6375 10 15.6375V17C10.6419 17 11.2335 16.7593 11.7516 16.4641C12.2707 16.168 12.7814 15.7774 13.2586 15.4104L12.3944 14.3404ZM7.60558 14.3404C6.86512 13.7709 6.11256 13.2259 5.34977 12.6128L4.46233 13.6665C5.23442 14.2868 6.05116 14.8791 6.7414 15.4104L7.60558 14.3404ZM2.24 9.22657C1.67956 8.23873 1.38869 7.12676 1.39535 5.99748H0C0 7.48531 0.390698 8.76333 1.01581 9.87965L2.24 9.22657Z"
                fill={isFav ? '#ef4444' : 'black'}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Arrows */}
        {images.length > 1 && (
          <div className={styles.mobileImageNavigation}>
            <button
              type="button"
              onClick={handlePrev}
              className={`${styles.mobileNavArrow} ${styles.mobileNavArrowLeft}`}
              aria-label="Foto anterior"
            >
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                width="20"
                height="20"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className={`${styles.mobileNavArrow} ${styles.mobileNavArrowRight}`}
              aria-label="Próxima foto"
            >
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                width="20"
                height="20"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}

        <div className={styles.galleryButtons}>
          {virtualTourUrl && (
            <a
              href={virtualTourUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.tourButton}
            >
              <Image src={tour} alt="Ícone de 360º para tour virtual" />
            </a>
          )}
          <button className={styles.viewAllPhotos} onClick={openModal}>
            Ver todas as fotos
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 2.25C4 1.65326 4.23705 1.08097 4.65901 0.65901C5.08097 0.237053 5.65326 0 6.25 0H15.25C15.8467 0 16.419 0.237053 16.841 0.65901C17.2629 1.08097 17.5 1.65326 17.5 2.25V11.25C17.5 11.8467 17.2629 12.419 16.841 12.841C16.419 13.2629 15.8467 13.5 15.25 13.5H13.5V15.25C13.5 15.8467 13.2629 16.419 12.841 16.841C12.419 17.2629 11.8467 17.5 11.25 17.5H2.25C1.65326 17.5 1.08097 17.2629 0.65901 16.841C0.237053 16.419 0 15.8467 0 15.25V6.25C0 5.65326 0.237053 5.08097 0.65901 4.65901C1.08097 4.23705 1.65326 4 2.25 4H4V2.25ZM12 6.25C12 6.05109 11.921 5.86032 11.7803 5.71967C11.6397 5.57902 11.4489 5.5 11.25 5.5H2.25C2.05109 5.5 1.86032 5.57902 1.71967 5.71967C1.57902 5.86032 1.5 6.05109 1.5 6.25V13.192L7.168 10.254C7.57959 10.0404 8.04711 9.95922 8.50661 10.0215C8.9661 10.0838 9.39513 10.2865 9.735 10.602L12 12.706V6.25ZM1.5 15.25C1.5 15.664 1.836 16 2.25 16H11.25C11.4489 16 11.6397 15.921 11.7803 15.7803C11.921 15.6397 12 15.4489 12 15.25V14.753L8.714 11.702C8.60088 11.5968 8.45805 11.5292 8.30501 11.5082C8.15198 11.4873 7.99622 11.5141 7.859 11.585L1.5 14.882V15.25ZM5.5 4H11.25C11.8467 4 12.419 4.23705 12.841 4.65901C13.2629 5.08097 13.5 5.65326 13.5 6.25V12H15.25C15.4489 12 15.6397 11.921 15.7803 11.7803C15.921 11.6397 16 11.4489 16 11.25V2.25C16 2.05109 15.921 1.86032 15.7803 1.71967C15.6397 1.57902 15.4489 1.5 15.25 1.5H6.25C6.05109 1.5 5.86032 1.57902 5.71967 1.71967C5.57902 1.86032 5.5 2.05109 5.5 2.25V4Z"
                fill="black"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Thumbnail Carousel - Outside mainImage to allow overflow */}
      {images.length > 1 && (
        <div className={styles.thumbnailCarousel}>
          <button
            type="button"
            onClick={handlePrev}
            className={`${styles.carouselArrow} ${styles.carouselArrowLeft}`}
            aria-label="Foto anterior"
          >
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              width="16"
              height="16"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className={styles.thumbnailTrack} ref={trackRef}>
            {images.map((img, index) => (
              <button
                key={img.id || index}
                type="button"
                ref={(el) => {
                  thumbnailRefs.current[index] = el;
                }}
                onClick={() => handleSelectImage(index)}
                className={`${styles.thumbnailItem} ${index === activeIndex ? styles.thumbnailActive : ''}`}
              >
                <Image
                  src={img.url}
                  alt={`${title} - Foto ${index + 1}`}
                  fill
                  className={styles.thumbnailImage}
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={handleNext}
            className={`${styles.carouselArrow} ${styles.carouselArrowRight}`}
            aria-label="Proxima foto"
          >
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              width="16"
              height="16"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Image Modal - Pinterest Style */}
      {isModalOpen && (
        <div className={styles.modal} onClick={closeModal}>
          {/* Fixed Close Button */}
          <button
            type="button"
            className={styles.modalClose}
            onClick={(e) => {
              e.stopPropagation();
              if (expandedIndex !== null) {
                collapseImage();
              } else {
                closeModal();
              }
            }}
            aria-label={expandedIndex !== null ? 'Voltar' : 'Fechar'}
          >
            {expandedIndex !== null ? (
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            ) : (
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </button>

          {/* Expanded Image View */}
          {expandedIndex !== null && (
            <div
              className={styles.expandedView}
              onClick={(e) => {
                e.stopPropagation();
                collapseImage();
              }}
            >
              <div
                className={styles.expandedImageWrapper}
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={
                    images[expandedIndex]?.url || '/placeholder-property.jpg'
                  }
                  alt={`${title} - Foto ${expandedIndex + 1}`}
                  fill
                  className={styles.expandedImage}
                />
              </div>

              {/* Counter */}
              <div className={styles.expandedCounter}>
                {expandedIndex + 1} / {images.length}
              </div>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExpandedPrev();
                    }}
                    className={`${styles.expandedArrow} ${styles.expandedArrowLeft}`}
                    aria-label="Foto anterior"
                  >
                    <svg
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExpandedNext();
                    }}
                    className={`${styles.expandedArrow} ${styles.expandedArrowRight}`}
                    aria-label="Proxima foto"
                  >
                    <svg
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </>
              )}
            </div>
          )}

          {/* Pinterest Grid */}
          {expandedIndex === null && (
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalGrid}>
                {images.map((img, index) => (
                  <div
                    key={img.id || index}
                    className={styles.modalGridItem}
                    onClick={() => expandImage(index)}
                  >
                    <Image
                      src={img.url}
                      alt={`${title} - Foto ${index + 1}`}
                      width={600}
                      height={400}
                      className={styles.modalGridImage}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
