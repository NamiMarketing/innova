'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import styles from './page.module.css';

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
  virtualTourUrl?: string;
}

export default function Gallery({
  images,
  title,
  virtualTourUrl,
}: GalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
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
        <div className={styles.galleryOverlay}>
          <div className={styles.galleryActions}>
            <button className={styles.favoriteButton}>
              <svg
                className={styles.favoriteIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              Favoritar
            </button>
          </div>
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
              <svg
                className={styles.tourIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
              360°
            </a>
          )}
          <button className={styles.viewAllPhotos} onClick={openModal}>
            <svg
              className={styles.cameraIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Ver todas as fotos
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
